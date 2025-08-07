const { MongoClient } = require('mongodb');

async function optimizeSessionsDatabase() {
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('groupxam');
        const sessions = db.collection('sessions');

        console.log('Creating indexes for sessions collection...');

        // Create compound index for efficient querying by user and time
        await sessions.createIndex(
            { userId: 1, endTime: -1 },
            { name: 'userId_endTime_desc' }
        );

        // Create index for status-based queries
        await sessions.createIndex(
            { status: 1, endTime: -1 },
            { name: 'status_endTime_desc' }
        );

        // Create index for time-based aggregations
        await sessions.createIndex(
            { endTime: -1 },
            { name: 'endTime_desc' }
        );

        // Create index for user activity queries
        await sessions.createIndex(
            { userId: 1, status: 1, endTime: -1 },
            { name: 'userId_status_endTime_desc' }
        );

        // Create TTL index to automatically delete old sessions (optional)
        // Uncomment if you want to automatically delete sessions older than 1 year
        // await sessions.createIndex(
        //     { endTime: 1 },
        //     { expireAfterSeconds: 365 * 24 * 60 * 60, name: 'ttl_endTime' }
        // );

        console.log('✅ All indexes created successfully');

        // Get index information
        const indexes = await sessions.indexes();
        console.log('\n📊 Current indexes:');
        indexes.forEach(index => {
            console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
        });

        // Create a view for session statistics (optional)
        try {
            await db.createCollection('sessionStats');
            console.log('✅ Created sessionStats collection');
        } catch (error) {
            if (error.code === 48) { // Collection already exists
                console.log('ℹ️ sessionStats collection already exists');
            } else {
                console.error('Error creating sessionStats collection:', error);
            }
        }

        console.log('\n🚀 Sessions database optimized for industrial scale!');
        console.log('\n📈 Performance optimizations:');
        console.log('- Compound indexes for efficient user-based queries');
        console.log('- Time-based indexes for date range queries');
        console.log('- Status-based indexes for active/completed session filtering');
        console.log('- Optimized for high-volume session tracking');

    } catch (error) {
        console.error('❌ Error optimizing sessions database:', error);
    } finally {
        await client.close();
    }
}

// Run the optimization
optimizeSessionsDatabase().catch(console.error);
