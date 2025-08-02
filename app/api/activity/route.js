import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDatabase();
        const activities = await db.collection('activities')
            .find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();

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