import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
    try {
        const db = await getDatabase();

        // Get total count of verified users (students and institutions)
        const totalUsers = await db.collection('users').countDocuments({
            isVerified: true
        });

        // Get count by role
        const studentCount = await db.collection('users').countDocuments({
            role: 'student',
            isVerified: true
        });

        const institutionCount = await db.collection('users').countDocuments({
            role: 'university',
            isVerified: true
        });

        return NextResponse.json({
            totalUsers,
            studentCount,
            institutionCount,
            success: true
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json({
            error: 'Failed to fetch user stats',
            totalUsers: 0,
            studentCount: 0,
            institutionCount: 0
        }, { status: 500 });
    }
} 