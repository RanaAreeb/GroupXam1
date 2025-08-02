import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request) {
    try {
        const { userId, userName, subject, score, totalQuestions, quizType } = await request.json();
        const db = await getDatabase();

        let message = '';
        if (quizType === 'flashcard') {
            message = `${userName} completed a ${subject} flashcard set!`;
        } else if (quizType === 'mock-exam') {
            message = `${userName} completed a ${subject} mock exam!`;
        } else {
            const percentage = Math.round((score / totalQuestions) * 100);
            if (percentage >= 90) {
                message = `${userName} aced a ${subject} quiz with ${percentage}%!`;
            } else if (percentage >= 70) {
                message = `${userName} scored ${percentage}% in ${subject}!`;
            } else {
                message = `${userName} completed a ${subject} quiz.`;
            }
        }

        const activity = {
            type: 'quiz-completion',
            message,
            userId,
            userName,
            subject,
            score,
            totalQuestions,
            quizType,
            createdAt: new Date(),
        };

        await db.collection('activities').insertOne(activity);

        return NextResponse.json({ success: true, activity });
    } catch (error) {
        console.error('Error creating quiz activity:', error);
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
    }
} 