import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
    try {
        console.log('Session start request received');
        const token = request.cookies.get("token")?.value;
        if (!token) {
            console.log('No token found in cookies');
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;
        console.log('Token decoded for session start:', { userId: decoded.userId, email: decoded.email });
        
        const { startTime, userAgent, referrer } = await request.json();
        console.log('Session start data received:', { startTime, userAgent, referrer });

        const db = await getDatabase();
        const users = db.collection("users");
        const sessions = db.collection("sessions");

        // Convert string userId to ObjectId if needed
        const userId = typeof decoded.userId === 'string' ? new ObjectId(decoded.userId) : decoded.userId;
        console.log('Looking for user with ID:', userId);

        // Find user
        const user = await users.findOne({ _id: userId });
        if (!user) {
            console.log('User not found in database, userId:', userId);
            return NextResponse.json({ success: true, message: "User not found, session start not tracked" });
        }
        console.log('User found for session start:', user.email);

        // Create session start record
        const sessionStartData = {
            userId: userId,
            userName: user.name,
            userEmail: user.email,
            startTime: new Date(startTime),
            userAgent: userAgent,
            referrer: referrer,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert session start record
        const sessionResult = await sessions.insertOne(sessionStartData);
        console.log('Session start saved with ID:', sessionResult.insertedId);

        return NextResponse.json({
            success: true,
            sessionId: sessionResult.insertedId
        });

    } catch (error) {
        console.error('Error tracking session start:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        return NextResponse.json({ error: 'Failed to track session start' }, { status: 500 });
    }
}
