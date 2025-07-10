import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function getUserFromRequest(request) {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export async function POST(request) {
    const user = getUserFromRequest(request);
    if (!user || user.role !== "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { examId, answers, securityAlerts = [] } = body;
    if (!examId || !Array.isArray(answers)) {
        return NextResponse.json({ error: "Missing examId or answers" }, { status: 400 });
    }
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("groupxam");
    try {
        // Get exam and MCQs
        const exam = await db.collection("exams").findOne({ _id: new ObjectId(examId) });
        if (!exam) {
            await client.close();
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }
        // Calculate score
        let score = 0;
        let totalQuestions = exam.mcqs.length;
        for (let i = 0; i < totalQuestions; i++) {
            if (answers[i] === exam.mcqs[i].correctAnswer) score++;
        }
        const examIdStr = typeof examId === "string" ? examId : examId.toString();
        // Find existing registration/submission
        const existing = await db.collection("submissions").findOne({
            examId: examIdStr,
            studentEmail: user.email
        });
        const now = new Date();
        let update = {
            status: "submitted",
            submittedAt: now,
            score,
            totalQuestions,
            timeTaken: exam.duration || 0,
            answers,
            examTitle: exam.title || "",
            securityAlerts,
        };
        if (existing) {
            await db.collection("submissions").updateOne(
                { _id: existing._id },
                { $set: update }
            );
        } else {
            // If not registered, create new submission
            await db.collection("submissions").insertOne({
                examId: examIdStr,
                studentEmail: user.email,
                studentName: user.name || "",
                ...update,
                registeredAt: now,
            });
        }
        await client.close();
        return NextResponse.json({ message: "Submission saved", score });
    } catch (error) {
        await client.close();
        return NextResponse.json({ error: "Failed to submit assessment" }, { status: 500 });
    }
} 