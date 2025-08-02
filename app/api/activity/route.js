import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDatabase();

        // Helper function to format names (FirstName L) in existing messages
        const formatNamesInMessage = (message) => {
            if (!message || typeof message !== 'string') return message;

            // Pattern to match full names in activity messages
            // This will match patterns like "John Doe just signed up" or "Jane Smith completed"
            return message.replace(/^([A-Z][a-z]+)\s+([A-Z][a-z]+)/g, (match, firstName, lastName) => {
                return `${firstName} ${lastName.charAt(0)}`;
            });
        };

        // Filter out test activities (those with test-user-* userIds)
        const rawActivities = await db.collection('activities')
            .find({
                userId: { $not: /^test-user-/ } // Exclude test activities
            })
            .sort({ createdAt: -1 })
            .limit(10)
            .toArray();

        // Format names in existing activity messages
        const activities = rawActivities.map(activity => ({
            ...activity,
            message: formatNamesInMessage(activity.message)
        }));

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