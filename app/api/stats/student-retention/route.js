const { getDatabase } = require('@/lib/db');

export async function GET() {
    try {
        const db = await getDatabase();

        // Get total number of users
        const totalUsers = await db.collection('users').countDocuments();

        // Get users who have been active in the last 30 days (retained users)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Count users who have activities in the last 30 days
        const activeUsers = await db.collection('activities').distinct('userId', {
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Calculate retention rate
        let studentRetention = 0;
        if (totalUsers > 0) {
            studentRetention = Math.round((activeUsers.length / totalUsers) * 100);
        }

        return Response.json({
            success: true,
            studentRetention: studentRetention
        });

    } catch (error) {
        console.error('Error fetching student retention:', error);
        return Response.json({
            success: false,
            error: 'Failed to fetch student retention',
            studentRetention: 0
        }, { status: 500 });
    }
}
