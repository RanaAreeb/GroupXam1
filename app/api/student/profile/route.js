import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Fetch student profile
export async function GET(request) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "student") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const db = await getDatabase();
        const users = db.collection("users");

        const user = await users.findOne({ email: decoded.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return student profile data (excluding sensitive info)
        const profileData = {
            name: user.name,
            email: user.email,
            selectedSubjects: user.selectedSubjects,
            stats: user.stats,
            settings: user.settings,
            progress: user.progress,
            status: user.status,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        };

        return NextResponse.json({ profile: profileData });
    } catch (error) {
        console.error("Error fetching student profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT - Update student profile
export async function PUT(request) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "student") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const body = await request.json();
        const db = await getDatabase();
        const users = db.collection("users");

        // Fields that can be updated
        const updateData = {
            updatedAt: new Date(),
        };

        // Basic info
        if (body.name) updateData.name = body.name;
        if (body.selectedSubjects) updateData.selectedSubjects = body.selectedSubjects;

        // Settings
        if (body.settings) {
            updateData.settings = { ...body.settings };
        }

        // Progress tracking
        if (body.progress) {
            updateData.progress = { ...body.progress };
        }

        const result = await users.updateOne(
            { email: decoded.email },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Error updating student profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 