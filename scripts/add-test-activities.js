const { getDatabase } = require('../lib/db.js');

async function addTestActivities() {
    try {
        const db = await getDatabase();

        // Check if activities exist
        const existingActivities = await db.collection("activities").countDocuments();

        if (existingActivities === 0) {
            console.log('No activities found. Adding test activities...');

            const testActivities = [
                {
                    type: "signup",
                    message: "Test User 1 just signed up for groupXam!",
                    userId: "test-user-1",
                    userName: "Test User 1",
                    userEmail: "test1@example.com",
                    timestamp: new Date(),
                    createdAt: new Date(),
                },
                {
                    type: "signup",
                    message: "Test User 2 just signed up for groupXam!",
                    userId: "test-user-2",
                    userName: "Test User 2",
                    userEmail: "test2@example.com",
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
                {
                    type: "quiz_completion",
                    message: "Test User 1 completed a quiz!",
                    userId: "test-user-1",
                    userName: "Test User 1",
                    userEmail: "test1@example.com",
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                },
                {
                    type: "institution_join",
                    message: "Test University joined as an institution!",
                    userId: "test-university-1",
                    userName: "Test University",
                    userEmail: "university@example.com",
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                },
                {
                    type: "exam_attempt",
                    message: "Test User 2 attempted an exam!",
                    userId: "test-user-2",
                    userName: "Test User 2",
                    userEmail: "test2@example.com",
                    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                }
            ];

            // Insert test activities
            for (const activity of testActivities) {
                await db.collection("activities").insertOne(activity);
                console.log(`Added activity: ${activity.message}`);
            }

            console.log('Test activities added successfully!');
        } else {
            console.log(`Found ${existingActivities} existing activities. Skipping test data.`);
        }

        // Print summary
        const totalActivities = await db.collection("activities").countDocuments();
        console.log(`Total activities: ${totalActivities}`);

    } catch (error) {
        console.error("Error adding test activities:", error);
    }
}

// Run the script
addTestActivities().then(() => {
    console.log("Script completed");
    process.exit(0);
}).catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
}); 