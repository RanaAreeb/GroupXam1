const { getDatabase } = require('@/lib/db');

export async function GET() {
    try {
        const db = await getDatabase();

        // Count total quiz completions from activities collection
        const quizCompletions = await db.collection('activities').countDocuments({
            type: 'quiz-completion'
        });

        // Count total exam submissions from examSubmissions collection
        const examSubmissions = await db.collection('examSubmissions').countDocuments();

        // Count total submissions from submissions collection
        const submissions = await db.collection('submissions').countDocuments();

        // Total quizzes and tests completed
        const totalQuizzesCompleted = quizCompletions + examSubmissions + submissions;

        return Response.json({
            success: true,
            totalQuizzesCompleted: totalQuizzesCompleted
        });

    } catch (error) {
        console.error('Error fetching total quizzes completed:', error);
        return Response.json({
            success: false,
            error: 'Failed to fetch total quizzes completed',
            totalQuizzesCompleted: 0
        }, { status: 500 });
    }
}
