import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const MAX_SESSION_SECONDS = 4 * 60 * 60; // 4 hours

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const { startTime, userAgent, referrer } = await request.json();

        const db = await getDatabase();
        const users = db.collection("users");
        const sessions = db.collection("sessions");

        const userId = typeof decoded.userId === 'string' ? new ObjectId(decoded.userId) : decoded.userId;
        const user = await users.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({ success: true, message: "User not found, session start not tracked" });
        }

        // Close any leftover active sessions so duration can't grow for days
        const now = new Date();
        const orphaned = await sessions.find({ userId, status: 'active' }).toArray();
        for (const orphan of orphaned) {
            const start = orphan.startTime ? new Date(orphan.startTime).getTime() : now.getTime();
            const durationSec = Math.min(
                Math.max(0, Math.floor((now.getTime() - start) / 1000)),
                MAX_SESSION_SECONDS
            );

            if (durationSec < 60) {
                await sessions.deleteOne({ _id: orphan._id });
            } else {
                await sessions.updateOne(
                    { _id: orphan._id },
                    {
                        $set: {
                            sessionDuration: durationSec,
                            endTime: now,
                            status: 'completed',
                            closedReason: 'superseded',
                            updatedAt: now,
                        },
                    }
                );
            }
        }

        const sessionStartData = {
            userId,
            userName: user.name || user.adminName || 'User',
            userEmail: user.email,
            startTime: startTime ? new Date(startTime) : now,
            userAgent: userAgent || '',
            referrer: referrer || '',
            sessionDuration: 0,
            pageViews: 0,
            actions: [],
            pageVisits: [],
            status: 'active',
            createdAt: now,
            updatedAt: now,
        };

        const sessionResult = await sessions.insertOne(sessionStartData);

        return NextResponse.json({
            success: true,
            sessionId: sessionResult.insertedId,
        });
    } catch (error) {
        console.error('Error tracking session start:', error);
        return NextResponse.json({ error: 'Failed to track session start' }, { status: 500 });
    }
}
