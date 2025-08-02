import { getDatabase } from '../lib/db.js';

async function clearActivities() {
    try {
        const db = await getDatabase();

        // Clear all activities
        const result = await db.collection('activities').deleteMany({});

        console.log(`Cleared ${result.deletedCount} activities from database`);
        console.log('Database is now clean and ready for real activities only');

        process.exit(0);
    } catch (error) {
        console.error('Error clearing activities:', error);
        process.exit(1);
    }
}

clearActivities(); 