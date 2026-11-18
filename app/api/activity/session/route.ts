import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const MAX_SESSION_SECONDS = 4 * 60 * 60; // 4 hours
const MIN_COMPLETE_SECONDS = 60; // ignore sub-minute noise in feed

function clampDuration(seconds: number): number {
    if (!Number.isFinite(seconds) || seconds < 0) return 0;
    return Math.min(Math.floor(seconds), MAX_SESSION_SECONDS);
}

async function refreshUserSessionStats(users: any, sessions: any, userId: ObjectId) {
    const userSessionStats = await sessions.aggregate([
        { $match: { userId, status: 'completed' } },
        {
            $group: {
                _id: null,
                totalSessions: { $sum: 1 },
                totalSessionTime: { $sum: "$sessionDuration" },
                totalPageViews: { $sum: "$pageViews" },
                averageSessionTime: { $avg: "$sessionDuration" },
                lastSessionAt: { $max: "$endTime" },
            },
        },
    ]).toArray().catch(() => []);

    const stats = userSessionStats[0] || {
        totalSessions: 0,
        totalSessionTime: 0,
        totalPageViews: 0,
        averageSessionTime: 0,
        lastSessionAt: null,
    };

    await users.updateOne(
        { _id: userId },
        {
            $set: {
                sessionStats: {
                    totalSessions: stats.totalSessions,
                    totalSessionTime: stats.totalSessionTime,
                    totalPageViews: stats.totalPageViews,
                    averageSessionTime: Math.round(stats.averageSessionTime || 0),
                    lastSessionAt: stats.lastSessionAt || new Date(),
                },
                updatedAt: new Date(),
            },
        }
    ).catch(() => {});

    return stats;
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as any;
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        let requestBody;
        try {
            requestBody = await request.text();
        } catch {
            return NextResponse.json({ error: "Failed to read request body" }, { status: 400 });
        }

        if (!requestBody || requestBody.trim() === '') {
            return NextResponse.json({ error: "Empty request body" }, { status: 400 });
        }

        let sessionData;
        try {
            sessionData = JSON.parse(requestBody);
        } catch {
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
        }

        const {
            sessionDuration,
            pageViews = 0,
            actions = [],
            pageVisits = [],
            finalize = false,
        } = sessionData;

        if (typeof sessionDuration !== 'number' || sessionDuration < 0) {
            return NextResponse.json({ error: "Invalid sessionDuration" }, { status: 400 });
        }

        if (typeof pageViews !== 'number' || pageViews < 0) {
            return NextResponse.json({ error: "Invalid pageViews" }, { status: 400 });
        }

        if (!Array.isArray(actions) || !Array.isArray(pageVisits)) {
            return NextResponse.json({ error: "Invalid actions or pageVisits" }, { status: 400 });
        }

        const db = await getDatabase();
        const users = db.collection("users");
        const sessions = db.collection("sessions");

        const userId = typeof decoded.userId === 'string' ? new ObjectId(decoded.userId) : decoded.userId;
        const user = await users.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({ success: true, message: "User not found, session not tracked" });
        }

        const clientDuration = clampDuration(sessionDuration);
        const now = new Date();

        const activeSession = await sessions.findOne(
            { userId, status: 'active' },
            { sort: { createdAt: -1 } }
        ).catch(() => null);

        if (activeSession) {
            const serverDuration = clampDuration(
                Math.floor((now.getTime() - new Date(activeSession.startTime).getTime()) / 1000)
            );
            // Prefer the smaller of client/server to avoid inflated idle time
            const duration = clampDuration(Math.min(clientDuration || serverDuration, serverDuration || clientDuration));

            if (!finalize) {
                // Heartbeat: update progress, keep session active (no new activity row spam)
                await sessions.updateOne(
                    { _id: activeSession._id },
                    {
                        $set: {
                            sessionDuration: duration,
                            pageViews,
                            actions,
                            pageVisits,
                            updatedAt: now,
                        },
                    }
                );

                return NextResponse.json({
                    success: true,
                    sessionId: activeSession._id,
                    finalized: false,
                });
            }

            // Finalize once
            if (duration < MIN_COMPLETE_SECONDS) {
                await sessions.deleteOne({ _id: activeSession._id });
                return NextResponse.json({ success: true, message: "Session too short, not tracked" });
            }

            await sessions.updateOne(
                { _id: activeSession._id },
                {
                    $set: {
                        sessionDuration: duration,
                        pageViews,
                        actions,
                        pageVisits,
                        endTime: now,
                        status: 'completed',
                        updatedAt: now,
                    },
                }
            );

            const stats = await refreshUserSessionStats(users, sessions, userId);

            return NextResponse.json({
                success: true,
                sessionId: activeSession._id,
                finalized: true,
                sessionStats: stats,
            });
        }

        // No active session — only create a completed record on finalize
        if (!finalize || clientDuration < MIN_COMPLETE_SECONDS) {
            return NextResponse.json({ success: true, message: "No active session to update" });
        }

        const insertResult = await sessions.insertOne({
            userId,
            userName: user.name || user.adminName || 'User',
            userEmail: user.email,
            sessionDuration: clientDuration,
            pageViews,
            actions,
            pageVisits,
            startTime: new Date(Date.now() - clientDuration * 1000),
            endTime: now,
            status: 'completed',
            createdAt: now,
            updatedAt: now,
        });

        const stats = await refreshUserSessionStats(users, sessions, userId);

        return NextResponse.json({
            success: true,
            sessionId: insertResult.insertedId,
            finalized: true,
            sessionStats: stats,
        });
    } catch (error: any) {
        console.error('Error tracking session:', error);
        return NextResponse.json({ error: 'Failed to track session' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const db = await getDatabase();
        const users = db.collection("users");

        const userId = typeof decoded.userId === 'string' ? new ObjectId(decoded.userId) : decoded.userId;
        const user = await users.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            sessionStats: user.sessionStats || {},
        });
    } catch (error) {
        console.error('Error fetching session stats:', error);
        return NextResponse.json({ error: 'Failed to fetch session stats' }, { status: 500 });
    }
}
