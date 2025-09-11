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

    const db = await getDatabase();

    try {
        // Get user's registrations from examRegistrations collection
        const registrations = await db.collection("examRegistrations")
            .find({ studentEmail: user.email })
            .sort({ registeredAt: -1 })
            .toArray();

        // Also get submissions to check completion status
        const submissions = await db.collection("examSubmissions")
            .find({ studentEmail: user.email })
            .sort({ submittedAt: -1 })
            .toArray();

        // Combine the data
        const combinedData = {
            registrations: registrations.map(reg => ({
                examId: reg.examId,
                status: reg.status,
                registeredAt: reg.registeredAt,
                registrationType: reg.registrationType
            })),
            submissions: submissions.map(sub => ({
                examId: sub.examId,
                status: sub.status,
                submittedAt: sub.submittedAt,
                score: sub.score
            }))
        };

        return NextResponse.json(combinedData);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }
}











