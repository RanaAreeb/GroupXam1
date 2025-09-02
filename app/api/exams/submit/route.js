import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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
    // Submit exam answers
    const user = getUserFromRequest(request);
    if (!user || (user.role !== "student" && user.role !== "university")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    const db = await getDatabase();

    // Check if already submitted
    const existing = await db.collection("examSubmissions").findOne({
        examId: data.examId,
        studentEmail: user.email
    });
    if (existing) {
        return NextResponse.json({ error: "Already submitted this exam" }, { status: 409 });
    }

    // Calculate score
    const exam = await db.collection("exams").findOne({ _id: new ObjectId(data.examId) });
    if (!exam) {
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    let score = 0;
    let totalQuestions = 0;
    if (exam.mcqs && data.answers) {
        exam.mcqs.forEach((mcq, index) => {
            totalQuestions++;
            if (data.answers[index] === mcq.correctAnswer) {
                score += mcq.points || 1;
            }
        });
    }

    const submission = {
        examId: data.examId,
        studentEmail: user.email,
        studentName: user.name,
        studentRollNumber: data.studentRollNumber || "",
        studentInstitution: data.studentInstitution || "",
        studentClass: data.studentClass || "",
        answers: data.answers || [],
        score,
        totalQuestions,
        submittedAt: new Date(),
        timeTaken: data.timeTaken || 0,
        securityAlerts: data.securityAlerts || []
    };

    const result = await db.collection("examSubmissions").insertOne(submission);
    return NextResponse.json({
        message: "Exam submitted successfully",
        submissionId: result.insertedId,
        score,
        totalQuestions
    }, { status: 201 });
} 