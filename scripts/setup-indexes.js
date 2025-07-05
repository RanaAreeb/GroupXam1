// Script to add indexes for better performance
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/groupxam';

async function setupIndexes() {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('groupxam');

    // Exams collection indexes
    await db.collection('exams').createIndex({ date: 1 });
    await db.collection('exams').createIndex({ universityId: 1 });

    // Submissions collection indexes
    await db.collection('submissions').createIndex({ examId: 1 });
    await db.collection('submissions').createIndex({ studentEmail: 1 });

    console.log('Indexes created successfully!');
    await client.close();
}

setupIndexes().catch((err) => {
    console.error('Error setting up indexes:', err);
    process.exit(1);
}); 