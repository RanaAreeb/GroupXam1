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
    const user = getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("groupxam");
    let submissions = [];
    if (user.role === "university") {
        // Find all exams for this university
        const exams = await db.collection("exams").find({ universityId: user.userId.toString() }).toArray();
        const examIds = exams.map(e => e._id?.toString()).filter(Boolean);
        // Find all submissions for these exams
        submissions = await db.collection("submissions").find({ examId: { $in: examIds } }).toArray();
    } else if (user.role === "student") {
        // Find all submissions for this student
        submissions = await db.collection("submissions").find({ studentEmail: user.email }).toArray();
    } else {
        await client.close();
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await client.close();
    return NextResponse.json(submissions);
} 