const { getDatabase } = require('../lib/db.js');

async function checkActivities() {
    try {
        const db = await getDatabase();

        // Check total activities
        const totalActivities = await db.collection("activities").countDocuments();
        console.log(`Total activities in database: ${totalActivities}`);

        if (totalActivities > 0) {
            // Get a few sample activities
            const sampleActivities = await db.collection("activities")
                .find({})
                .sort({ timestamp: -1 })
                .limit(5)
                .toArray();

            console.log('\nSample activities:');
            sampleActivities.forEach((activity, index) => {
                console.log(`${index + 1}. ${activity.message} - ${activity.userEmail || 'Anonymous'} - ${activity.timestamp}`);
            });
        } else {
            console.log('No activities found in database.');
        }

        // Check if activities collection exists
        const collections = await db.listCollections().toArray();
        const hasActivitiesCollection = collections.some(col => col.name === 'activities');
        console.log(`\nActivities collection exists: ${hasActivitiesCollection}`);

    } catch (error) {
        console.error("Error checking activities:", error);
    }
}

// Run the script
checkActivities().then(() => {
    console.log("Script completed");
    process.exit(0);
}).catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
}); 