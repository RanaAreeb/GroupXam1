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

export async function GET(request) {
    // List exams - different behavior for different user types
    const user = getUserFromRequest(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const db = await getDatabase();

    try {
        if (id) {
            // Fetch a single exam by id
            const exam = await db.collection("exams").findOne({ _id: new ObjectId(id) });
            if (!exam) return NextResponse.json({ error: "Exam not found" }, { status: 404 });
            return NextResponse.json(exam);
        }

        let exams;

        if (!user) {
            // Unauthenticated users can see all upcoming exams
            const now = new Date();
            exams = await db.collection("exams")
                .find({
                    date: { $gte: now.toISOString().split('T')[0] } // Only future exams
                })
                .sort({ date: 1, time: 1 })
                .toArray();
        } else if (user.role === "university") {
            // Universities see only their own exams
            exams = await db.collection("exams")
                .find({ universityId: user.userId.toString() })
                .sort({ date: 1, time: 1 })
                .toArray();
        } else if (user.role === "student") {
            // Students see all upcoming exams
            const now = new Date();
            exams = await db.collection("exams")
                .find({
                    date: { $gte: now.toISOString().split('T')[0] } // Only future exams
                })
                .sort({ date: 1, time: 1 })
                .toArray();
        } else {
            // Other roles see all upcoming exams
            const now = new Date();
            exams = await db.collection("exams")
                .find({
                    date: { $gte: now.toISOString().split('T')[0] } // Only future exams
                })
                .sort({ date: 1, time: 1 })
                .toArray();
        }

        return NextResponse.json(exams);
    } catch (error) {
        console.error("Error fetching exams:", error);
        return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 });
    }
}

export async function POST(request) {
    // Create a new exam (with conflict check)
    const user = getUserFromRequest(request);
    if (!user || user.role !== "university") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    const db = await getDatabase();

    // Conflict check: no two exams at the same date+time+timezone
    const conflict = await db.collection("exams").findOne({
        date: data.date,
        time: data.time,
        timezone: data.timezone || null
    });
    if (conflict) {
        return NextResponse.json({ error: "Exam time conflicts with another exam in the same timezone." }, { status: 409 });
    }
    const exam = {
        ...data,
        universityId: user.userId.toString(),
        universityName: user.universityName,
        createdAt: new Date(),
        mcqs: data.mcqs || [],
    };
    const result = await db.collection("exams").insertOne(exam);
    return NextResponse.json({ message: "Exam created", examId: result.insertedId }, { status: 201 });
}

export async function PUT(request) {
    // Edit an exam (only by the owner university)
    const user = getUserFromRequest(request);
    if (!user || user.role !== "university") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    if (!data._id) {
        return NextResponse.json({ error: "Missing exam ID" }, { status: 400 });
    }
    const db = await getDatabase();

    // Conflict check (ignore self)
    const conflict = await db.collection("exams").findOne({
        date: data.date,
        time: data.time,
        timezone: data.timezone || null,
        _id: { $ne: new ObjectId(data._id) }
    });
    if (conflict) {
        return NextResponse.json({ error: "Exam time conflicts with another exam in the same timezone." }, { status: 409 });
    }
    const result = await db.collection("exams").updateOne(
        { _id: new ObjectId(data._id), universityId: user.userId.toString() },
        { $set: { ...data, updatedAt: new Date() } }
    );
    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Exam not found or not owned by you" }, { status: 404 });
    }
    return NextResponse.json({ message: "Exam updated" });
}

export async function DELETE(request) {
    // Delete an exam (only by the owner university)
    const user = getUserFromRequest(request);
    if (!user || user.role !== "university") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({ error: "Missing exam ID" }, { status: 400 });
    }
    const db = await getDatabase();
    const result = await db.collection("exams").deleteOne({ _id: new ObjectId(id), universityId: user.userId.toString() });
    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Exam not found or not owned by you" }, { status: 404 });
    }
    return NextResponse.json({ message: "Exam deleted" });
} 