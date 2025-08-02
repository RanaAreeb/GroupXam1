import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request) {
    try {
        const { userId, userName, action, subject, groupName } = await request.json();
        const db = await getDatabase();

        // Helper function to format names (FirstName L)
        const formatDisplayName = (fullName) => {
            if (!fullName || typeof fullName !== 'string') return fullName;
            const nameParts = fullName.trim().split(' ');
            if (nameParts.length < 2) return fullName; // Return as-is if only one name
            const firstName = nameParts[0];
            const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
            return `${firstName} ${lastInitial}`;
        };

        const displayName = formatDisplayName(userName);

        let message = '';
        if (action === 'joined') {
            message = `${displayName} joined the ${subject} study group.`;
        } else if (action === 'posted') {
            message = `${displayName} posted a question in ${subject} discussions.`;
        } else if (action === 'answered') {
            message = `${displayName} answered a question in ${subject}.`;
        } else if (action === 'created') {
            message = `${displayName} created a new ${subject} study group.`;
        }

        const activity = {
            type: 'study-group',
            message,
            userId,
            userName,
            action,
            subject,
            groupName,
            createdAt: new Date(),
        };

        await db.collection('activities').insertOne(activity);

        return NextResponse.json({ success: true, activity });
    } catch (error) {
        console.error('Error creating study group activity:', error);
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
} 