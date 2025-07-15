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

export async function POST(request) {
    // Register for an exam
    const user = getUserFromRequest(request);
    if (!user || user.role !== "student") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();
    const db = await getDatabase();
    // Check if already registered
    const existing = await db.collection("examRegistrations").findOne({
        examId: data.examId,
        studentEmail: user.email
    });
    if (existing) {
        return NextResponse.json({ error: "Already registered for this exam" }, { status: 409 });
    }
    const registration = {
        examId: data.examId,
        studentEmail: user.email,
        studentName: user.name,
        regNo: data.regNo,
        registeredAt: new Date(),
        status: "registered"
    };
    const result = await db.collection("examRegistrations").insertOne(registration);
    return NextResponse.json({ message: "Registered successfully", registrationId: result.insertedId }, { status: 201 });
} 