import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDatabase();
        
        // Filter out test activities (those with test-user-* userIds)
        const activities = await db.collection('activities')
            .find({ 
                userId: { $not: /^test-user-/ } // Exclude test activities
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();

        console.log('Fetched real activities from database:', activities.length, 'activities');
        if (activities.length > 0) {
            console.log('Sample real activity:', activities[0]);
        }

        return NextResponse.json({ activities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { type, message, userId, userName } = await request.json();
        const db = await getDatabase();

        const activity = {
            type,
            message,
            userId,
            userName,
            createdAt: new Date(),
        };

        await db.collection('activities').insertOne(activity);

        return NextResponse.json({ success: true, activity });
    } catch (error) {
        console.error('Error creating activity:', error);
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
} 