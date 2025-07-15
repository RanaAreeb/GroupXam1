import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// POST - Update user stats
export async function POST(request) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const body = await request.json();
        const db = await getDatabase();
        const users = db.collection("users");

        const user = await users.findOne({ email: decoded.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updateData = {
            updatedAt: new Date(),
        };

        if (decoded.role === "student") {
            // Update student stats
            const currentStats = user.stats || {};
            const newStats = { ...currentStats };

            // Handle different stat updates
            if (body.totalQuestions !== undefined) {
                newStats.totalQuestions = (currentStats.totalQuestions || 0) + body.totalQuestions;
            }
            if (body.correctAnswers !== undefined) {
                newStats.correctAnswers = (currentStats.correctAnswers || 0) + body.correctAnswers;
            }
            if (body.streak !== undefined) {
                newStats.streak = body.streak;
                newStats.longestStreak = Math.max(currentStats.longestStreak || 0, body.streak);
            }
            if (body.level !== undefined) {
                newStats.level = body.level;
            }
            if (body.totalQuizzes !== undefined) {
                newStats.totalQuizzes = (currentStats.totalQuizzes || 0) + body.totalQuizzes;
            }
            if (body.totalFlashcards !== undefined) {
                newStats.totalFlashcards = (currentStats.totalFlashcards || 0) + body.totalFlashcards;
            }
            if (body.studyTime !== undefined) {
                newStats.studyTime = (currentStats.studyTime || 0) + body.studyTime;
            }

            updateData.stats = newStats;

            // Update progress tracking
            if (body.progress) {
                const currentProgress = user.progress || {};
                updateData.progress = {
                    ...currentProgress,
                    ...body.progress,
                    lastActive: new Date(),
                };
            }

        } else if (decoded.role === "university") {
            // Update institution stats
            const currentStats = user.stats || {};
            const newStats = { ...currentStats };

            if (body.totalExams !== undefined) {
                newStats.totalExams = (currentStats.totalExams || 0) + body.totalExams;
            }
            if (body.totalStudents !== undefined) {
                newStats.totalStudents = body.totalStudents;
            }
            if (body.totalSubmissions !== undefined) {
                newStats.totalSubmissions = (currentStats.totalSubmissions || 0) + body.totalSubmissions;
            }
            if (body.totalCourses !== undefined) {
                newStats.totalCourses = (currentStats.totalCourses || 0) + body.totalCourses;
            }

            updateData.stats = newStats;
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
            message: "Stats updated successfully",
            stats: updateData.stats
        });
    } catch (error) {
        console.error("Error updating stats:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 