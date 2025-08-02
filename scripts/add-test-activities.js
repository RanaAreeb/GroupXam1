const { getDatabase } = require('../lib/db.js');

async function addTestActivities() {
    try {
        const db = await getDatabase();

        const testActivities = [
            {
                type: 'signup',
                message: 'John just signed up for groupXam!',
                userId: 'test-user-1',
                userName: 'John',
                createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
            },
            {
                type: 'quiz-completion',
                message: 'Sarah aced a Chemistry quiz with 95%!',
                userId: 'test-user-2',
                userName: 'Sarah',
                subject: 'Chemistry',
                score: 19,
                totalQuestions: 20,
                quizType: 'quiz',
                createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
            },
            {
                type: 'flashcard-completion',
                message: 'Tunde finished a Biology flashcard set.',
                userId: 'test-user-3',
                userName: 'Tunde',
                subject: 'Biology',
                quizType: 'flashcard',
                createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
            },
            {
                type: 'study-group',
                message: 'Kemi joined the Math study group.',
                userId: 'test-user-4',
                userName: 'Kemi',
                action: 'joined',
                subject: 'Mathematics',
                createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
            },
            {
                type: 'mock-exam',
                message: 'David completed a WAEC mock exam!',
                userId: 'test-user-5',
                userName: 'David',
                subject: 'Physics',
                quizType: 'mock-exam',
                createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
            },
            {
                type: 'signup',
                message: 'Maria just joined groupXam and started learning!',
                userId: 'test-user-6',
                userName: 'Maria',
                createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            },
            {
                type: 'quiz-completion',
                message: 'Ayo scored 100% in Mathematics!',
                userId: 'test-user-7',
                userName: 'Ayo',
                subject: 'Mathematics',
                score: 20,
                totalQuestions: 20,
                quizType: 'quiz',
                createdAt: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
            },
            {
                type: 'achievement',
                message: 'Fatima unlocked the "Perfect Score" achievement!',
                userId: 'test-user-8',
                userName: 'Fatima',
                createdAt: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
            },
        ];

        // Clear existing activities first
        await db.collection('activities').deleteMany({});

        // Insert test activities
        const result = await db.collection('activities').insertMany(testActivities);

        console.log(`Added ${result.insertedCount} test activities to the database`);
        console.log('Test activities added successfully!');

        process.exit(0);
    } catch (error) {
        console.error('Error adding test activities:', error);
        process.exit(1);
    }
}

addTestActivities(); 