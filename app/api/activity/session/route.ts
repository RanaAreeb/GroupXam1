import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: NextRequest) {
    try {
        console.log('Session POST request received');
        const token = request.cookies.get("token")?.value;
        if (!token) {
            console.log('No token found in cookies');
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as any;
            console.log('Token decoded:', { userId: decoded.userId, email: decoded.email });
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError);
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        
        // Check if request body is empty or null
        let requestBody;
        try {
            requestBody = await request.text();
        } catch (readError) {
            console.error('Error reading request body:', readError);
            return NextResponse.json({ error: "Failed to read request body" }, { status: 400 });
        }
        
        if (!requestBody || requestBody.trim() === '') {
            console.log('Empty request body received');
            return NextResponse.json({ error: "Empty request body" }, { status: 400 });
        }
        
        let sessionData;
        try {
            sessionData = JSON.parse(requestBody);
        } catch (error) {
            console.error('Invalid JSON in request body:', error);
            console.error('Request body was:', requestBody.substring(0, 100)); // Log first 100 chars
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
        }
        
        const { sessionDuration, pageViews, actions, pageVisits } = sessionData;
        
        // Validate required fields
        if (typeof sessionDuration !== 'number' || sessionDuration < 0) {
            console.error('Invalid sessionDuration:', sessionDuration);
            return NextResponse.json({ error: "Invalid sessionDuration" }, { status: 400 });
        }
        
        if (typeof pageViews !== 'number' || pageViews < 0) {
            console.error('Invalid pageViews:', pageViews);
            return NextResponse.json({ error: "Invalid pageViews" }, { status: 400 });
        }
        
        if (!Array.isArray(actions)) {
            console.error('Invalid actions:', actions);
            return NextResponse.json({ error: "Invalid actions" }, { status: 400 });
        }

        if (!Array.isArray(pageVisits)) {
            console.error('Invalid pageVisits:', pageVisits);
            return NextResponse.json({ error: "Invalid pageVisits" }, { status: 400 });
        }
        
        console.log('Session data received:', { sessionDuration, pageViews, actionsCount: actions.length, pageVisitsCount: pageVisits.length });

        const db = await getDatabase();
        const users = db.collection("users");
        const sessions = db.collection("sessions"); // Use separate sessions collection

        // Convert string userId to ObjectId if needed
        const userId = typeof decoded.userId === 'string' ? new ObjectId(decoded.userId) : decoded.userId;
        console.log('Looking for user with ID:', userId);

        // Find user
        const user = await users.findOne({ _id: userId });
        if (!user) {
            console.log('User not found in database, userId:', userId);
            return NextResponse.json({ success: true, message: "User not found, session not tracked" });
        }
        console.log('User found:', user.email);

        // Find the most recent active session for this user
        const activeSession = await sessions.findOne(
            { 
                userId: userId, 
                status: 'active' 
            },
            { sort: { createdAt: -1 } }
        ).catch(error => {
            console.error('Error finding active session:', error);
            return null;
        });

        let sessionId;
        
        if (activeSession) {
            // Update existing session with end data
            const actualSessionDuration = Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000);
            
            // Only update if session is longer than 5 seconds
            if (actualSessionDuration >= 5) {
                            await sessions.updateOne(
                { _id: activeSession._id },
                {
                    $set: {
                        sessionDuration: actualSessionDuration,
                        pageViews: pageViews,
                        actions: actions,
                        pageVisits: pageVisits,
                        endTime: new Date(),
                        status: 'completed',
                        updatedAt: new Date()
                    }
                }
            );
                sessionId = activeSession._id;
                console.log('Session updated with ID:', sessionId, 'Duration:', actualSessionDuration, 'seconds');
            } else {
                // Delete very short sessions
                await sessions.deleteOne({ _id: activeSession._id });
                console.log('Short session deleted (duration:', actualSessionDuration, 'seconds)');
                return NextResponse.json({ success: true, message: "Session too short, not tracked" });
            }
        } else {
            // Create new session record if no active session found
            const sessionData = {
                userId: userId,
                userName: user.name,
                userEmail: user.email,
                sessionDuration: sessionDuration,
                pageViews: pageViews,
                actions: actions,
                pageVisits: pageVisits,
                startTime: new Date(Date.now() - sessionDuration * 1000),
                endTime: new Date(),
                status: 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const sessionResult = await sessions.insertOne(sessionData);
            sessionId = sessionResult.insertedId;
            console.log('New session saved with ID:', sessionId);
        }

        // Update user's session statistics (aggregated from sessions collection)
        const userSessionStats = await sessions.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    totalSessionTime: { $sum: "$sessionDuration" },
                    totalPageViews: { $sum: "$pageViews" },
                    averageSessionTime: { $avg: "$sessionDuration" },
                    lastSessionAt: { $max: "$endTime" }
                }
            }
        ]).toArray().catch(error => {
            console.error('Error aggregating session stats:', error);
            return [];
        });

        const stats = userSessionStats[0] || {
            totalSessions: 0,
            totalSessionTime: 0,
            totalPageViews: 0,
            averageSessionTime: 0,
            lastSessionAt: null
        };

        // Update user document with aggregated stats
        await users.updateOne(
            { _id: userId },
            {
                $set: {
                    sessionStats: {
                        totalSessions: stats.totalSessions,
                        totalSessionTime: stats.totalSessionTime,
                        totalPageViews: stats.totalPageViews,
                        averageSessionTime: Math.round(stats.averageSessionTime || 0),
                        lastSessionAt: stats.lastSessionAt || new Date()
                    },
                    updatedAt: new Date()
                }
            }
        ).catch(error => {
            console.error('Error updating user session stats:', error);
        });

        console.log('Session data saved successfully');
        return NextResponse.json({
            success: true,
            sessionId: sessionId,
            sessionStats: stats
        });

    } catch (error) {
        console.error('Error tracking session:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
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

        // Convert string userId to ObjectId if needed
        const userId = typeof decoded.userId === 'string' ? new ObjectId(decoded.userId) : decoded.userId;

        const user = await users.findOne({ _id: userId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            sessionStats: user.sessionStats || {}
        });

    } catch (error) {
        console.error('Error fetching session stats:', error);
        return NextResponse.json({ error: 'Failed to fetch session stats' }, { status: 500 });
    }
}
