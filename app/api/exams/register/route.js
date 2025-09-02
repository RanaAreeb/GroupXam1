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
    try {
        const data = await request.json();
        const db = await getDatabase();

        // Handle both logged-in users and guest registrations
        const user = getUserFromRequest(request);

        let studentEmail, studentName;

        if (user && (user.role === "student" || user.role === "university")) {
            // Logged-in user (student or university)
            studentEmail = user.email;
            studentName = user.name;
        } else if (data.name && data.email) {
            // Guest registration with simplified form
            studentEmail = data.email;
            studentName = data.name;
        } else {
            return NextResponse.json({
                error: "Name and email are required for registration"
            }, { status: 400 });
        }

        // Check if already registered
        const existing = await db.collection("examRegistrations").findOne({
            examId: data.examId,
            studentEmail: studentEmail
        });

        if (existing) {
            return NextResponse.json({
                error: "You are already registered for this exam"
            }, { status: 409 });
        }

        // Create simplified registration
        const registration = {
            examId: data.examId,
            studentEmail: studentEmail,
            studentName: studentName,
            registeredAt: new Date(),
            status: "registered",
            registrationType: user ? "logged-in" : "guest"
        };

        const result = await db.collection("examRegistrations").insertOne(registration);

        return NextResponse.json({
            message: "Registration successful! You're all set for the exam.",
            registrationId: result.insertedId
        }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({
            error: "Registration failed. Please try again."
        }, { status: 500 });
    }
} 