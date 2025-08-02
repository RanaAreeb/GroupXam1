import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request) {
    try {
        const { userId, userName, action, subject, groupName } = await request.json();
        const db = await getDatabase();

        let message = '';
        if (action === 'joined') {
            message = `${userName} joined the ${subject} study group.`;
        } else if (action === 'posted') {
            message = `${userName} posted a question in ${subject} discussions.`;
        } else if (action === 'answered') {
            message = `${userName} answered a question in ${subject}.`;
        } else if (action === 'created') {
            message = `${userName} created a new ${subject} study group.`;
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