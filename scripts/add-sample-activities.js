const { getDatabase } = require('../lib/db.js');

async function addSampleActivities() {
    try {
        const db = await getDatabase();

        // Sample activities with proper user information
        const sampleActivities = [
            {
                type: "signup",
                message: "Rana Muhammad Areeb just signed up for groupXam!",
                userId: "688e1293db9f9d0b65d02318",
                userName: "Rana Muhammad Areeb",
                userEmail: "ranaareeb1029@gmail.com",
                timestamp: new Date(),
                createdAt: new Date(),
            },
            {
                type: "signup",
                message: "Clifton Manneh just signed up for groupXam!",
                userId: "688e1293db9f9d0b65d02319",
                userName: "Clifton Manneh",
                userEmail: "cliftonmanneh6@gmail.com",
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
            {
                type: "signup",
                message: "Akanlo G just signed up for groupXam!",
                userId: "688e1293db9f9d0b65d02320",
                userName: "Akanlo G",
                userEmail: "akanlo@example.com",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                type: "signup",
                message: "English G just signed up for groupXam!",
                userId: "688e1293db9f9d0b65d02321",
                userName: "English G",
                userEmail: "english@example.com",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            },
            {
                type: "institution_join",
                message: "KHAZIMA A joined as an institution!",
                userId: "688e1293db9f9d0b65d02322",
                userName: "KHAZIMA A",
                userEmail: "khazima@example.com",
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            },
            {
                type: "signup",
                message: "M T just signed up for groupXam!",
                userId: "688e1293db9f9d0b65d02323",
                userName: "M T",
                userEmail: "mt@example.com",
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            },
            {
                type: "signup",
                message: "Aliya G just signed up for groupXam!",
                userId: "688e1293db9f9d0b65d02324",
                userName: "Aliya G",
                userEmail: "aliya@example.com",
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
                createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            },
            {
                type: "signup",
                message: "Samson G just signed up for groupXam!",
                userId: "688e1293db9f9d0b65d02325",
                userName: "Samson G",
                userEmail: "samson@example.com",
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            }
        ];

        // Insert sample activities
        for (const activity of sampleActivities) {
            const existingActivity = await db.collection("activities").findOne({
                userEmail: activity.userEmail,
                message: activity.message,
                timestamp: activity.timestamp
            });
            if (!existingActivity) {
                await db.collection("activities").insertOne(activity);
                console.log(`Added activity: ${activity.message}`);
            }
        }

        console.log("Sample activities added successfully!");

        // Print summary
        const totalActivities = await db.collection("activities").countDocuments();
        console.log(`Total activities: ${totalActivities}`);

    } catch (error) {
        console.error("Error adding sample activities:", error);
    }
}

// Run the script
addSampleActivities().then(() => {
    console.log("Script completed");
    process.exit(0);
}).catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
}); 