import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
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

export async function GET(request) {
    // Get exam submissions
    const user = getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = await getDatabase();

    try {
        let submissions;
        if (user.role === "university") {
            // Universities see submissions for their exams
            const exams = await db.collection("exams").find({ universityId: user.userId.toString() }).toArray();
            const examIds = exams.map(exam => exam._id.toString());
            submissions = await db.collection("examSubmissions")
                .find({ examId: { $in: examIds } })
                .sort({ submittedAt: -1 })
                .toArray();
        } else if (user.role === "student") {
            // Students see their own submissions
            submissions = await db.collection("examSubmissions")
                .find({ studentEmail: user.email })
                .sort({ submittedAt: -1 })
                .toArray();
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
    }
} 