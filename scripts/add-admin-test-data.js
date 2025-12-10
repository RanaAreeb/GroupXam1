const { getDatabase } = require('../lib/db.js');

async function addAdminTestData() {
    try {
        const db = await getDatabase();

        // Add sample users with different countries and creation dates
        const sampleUsers = [
            {
                name: "John Doe",
                email: "john@example.com",
                role: "student",
                country: "NGI",
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                role: "student",
                country: "GH",
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            },
            {
                name: "Bob Johnson",
                email: "bob@example.com",
                role: "student",
                country: "KE",
                createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
            },
            {
                name: "Alice Brown",
                email: "alice@example.com",
                role: "student",
                country: "ZA",
                createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 2 weeks ago
            },
            {
                name: "Charlie Wilson",
                email: "charlie@example.com",
                role: "student",
                country: "NG",
                createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
            },
            {
                name: "Diana Davis",
                email: "diana@example.com",
                role: "student",
                country: "GH",
                createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
            },
            {
                name: "Eve Miller",
                email: "eve@example.com",
                role: "student",
                country: "KE",
                createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
            },
            {
                name: "Frank Garcia",
                email: "frank@example.com",
                role: "student",
                country: "ZA",
                createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
            },
            {
                name: "Grace Lee",
                email: "grace@example.com",
                role: "student",
                country: "NG",
                createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
            },
            {
                name: "Henry Taylor",
                email: "henry@example.com",
                role: "student",
                country: "GH",
                createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
            },
            {
                name: "Ibrahim Ahmed",
                email: "ibrahim@example.com",
                role: "student",
                country: "EG",
                createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
            },
            {
                name: "Fatima Hassan",
                email: "fatima@example.com",
                role: "student",
                country: "ET",
                createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), // 75 days ago
            },
            {
                name: "David Ochieng",
                email: "david@example.com",
                role: "student",
                country: "UG",
                createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 100 days ago
            },
            {
                name: "Sarah Mwangi",
                email: "sarah@example.com",
                role: "student",
                country: "TZ",
                createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 150 days ago
            },
            {
                name: "Michael Nkosi",
                email: "michael@example.com",
                role: "student",
                country: "RW",
                createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000), // 200 days ago
            }
        ];

        // Add sample activities
        const sampleActivities = [
            {
                type: "signup",
                message: "John Doe just signed up",
                userId: "user1",
                userName: "John Doe",
                userEmail: "john@example.com",
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
            {
                type: "quiz_completed",
                message: "Jane Smith completed a Biology quiz",
                userId: "user2",
                userName: "Jane Smith",
                userEmail: "jane@example.com",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
            {
                type: "exam_started",
                message: "Bob Johnson started a WAEC mock exam",
                userId: "user3",
                userName: "Bob Johnson",
                userEmail: "bob@example.com",
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            },
            {
                type: "flashcard_studied",
                message: "Alice Brown studied Chemistry flashcards",
                userId: "user4",
                userName: "Alice Brown",
                userEmail: "alice@example.com",
                timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            },
            {
                type: "discussion_posted",
                message: "Charlie Wilson posted in Study Groups",
                userId: "user5",
                userName: "Charlie Wilson",
                userEmail: "charlie@example.com",
                timestamp: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
                createdAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
            }
        ];

        // Insert sample users
        for (const user of sampleUsers) {
            const existingUser = await db.collection("users").findOne({ email: user.email });
            if (!existingUser) {
                await db.collection("users").insertOne(user);
                console.log(`Added user: ${user.name}`);
            }
        }

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

        console.log("Admin test data added successfully!");

        // Print summary
        const totalUsers = await db.collection("users").countDocuments();
        const totalActivities = await db.collection("activities").countDocuments();

        console.log(`Total users: ${totalUsers}`);
        console.log(`Total activities: ${totalActivities}`);

    } catch (error) {
        console.error("Error adding admin test data:", error);
    }
}

// Run the script
addAdminTestData().then(() => {
    console.log("Script completed");
    process.exit(0);
}).catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
}); 