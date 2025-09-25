import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
        try {
            const db = await getDatabase();

            // Use Promise.all to run queries in parallel for better performance
            const [totalUsers, studentCount, institutionCount] = await Promise.all([
                db.collection('users').countDocuments({
                    isVerified: true
                }),
                db.collection('users').countDocuments({
                    role: 'student',
                    isVerified: true
                }),
                db.collection('users').countDocuments({
                    role: 'university',
                    isVerified: true
                })
            ]);

            return NextResponse.json({
                totalUsers,
                studentCount,
                institutionCount,
                success: true
            });
        } catch (error) {
            retryCount++;
            console.error(`Error fetching user stats (attempt ${retryCount}):`, error);

            // If it's a connection timeout error and we haven't exceeded max retries, wait and retry
            if (error.name === 'MongoWaitQueueTimeoutError' && retryCount < maxRetries) {
                console.log(`Retrying in ${retryCount * 1000}ms...`);
                await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
                continue;
            }

            // If it's the last attempt or a different error, return error response
            return NextResponse.json({
                error: 'Failed to fetch user stats',
                totalUsers: 0,
                studentCount: 0,
                institutionCount: 0,
                retryAttempts: retryCount
            }, { status: 500 });
        }
    }
} 