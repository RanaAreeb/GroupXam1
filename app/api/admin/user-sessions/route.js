import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('email');

        if (!userEmail) {
            return NextResponse.json({ error: "User email is required" }, { status: 400 });
        }

        const db = await getDatabase();
        const sessions = db.collection("sessions");

        // Find all sessions for the specified user
        const userSessions = await sessions
            .find({ userEmail: userEmail })
            .sort({ endTime: -1 })
            .limit(100)
            .toArray();

        console.log(`Found ${userSessions.length} sessions for user: ${userEmail}`);

        return NextResponse.json({
            success: true,
            sessions: userSessions,
            totalSessions: userSessions.length
        });

    } catch (error) {
        console.error("Error fetching user sessions:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch user sessions" },
            { status: 500 }
        );
    }
}
