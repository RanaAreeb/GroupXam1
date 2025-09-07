import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request) {
    try {
        const { userId, userName, subject, score, totalQuestions, quizType } = await request.json();
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

        // Safely decode subjects that may arrive URL-encoded (e.g., "Pythagorean%20theorem")
        const decodeSubject = (raw) => {
            if (typeof raw !== 'string') return raw;
            try {
                return decodeURIComponent(raw.replace(/\+/g, ' '));
            } catch {
                return raw;
            }
        };

        const displayName = formatDisplayName(userName);
        const normalizedSubject = decodeSubject(subject);

        let message = '';
        if (quizType === 'flashcard') {
            message = `${displayName} completed a ${normalizedSubject} flashcard set!`;
        } else if (quizType === 'mock-exam') {
            message = `${displayName} completed a ${normalizedSubject} mock exam!`;
        } else {
            const percentage = Math.round((score / totalQuestions) * 100);
            if (percentage >= 90) {
                message = `${displayName} aced a ${normalizedSubject} quiz with ${percentage}%!`;
            } else if (percentage >= 70) {
                message = `${displayName} scored ${percentage}% in ${normalizedSubject}!`;
            } else {
                message = `${displayName} completed a ${normalizedSubject} quiz.`;
            }
        }

        const activity = {
            type: 'quiz-completion',
            message,
            userId,
            userName,
            subject: normalizedSubject,
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