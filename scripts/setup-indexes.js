const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"

async function setupIndexes() {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        console.log("Connected to MongoDB")

        const db = client.db("groupxam")

        // Users collection indexes
        const users = db.collection("users")

        // Email index for fast login queries
        await users.createIndex({ email: 1 }, { unique: true })
        console.log("✅ Created email index on users collection")

        // Questions collection indexes
        const questions = db.collection("questions")

        // Subject and category indexes for fast filtering
        await questions.createIndex({ subject: 1 })
        await questions.createIndex({ category: 1 })
        await questions.createIndex({ difficulty: 1 })
        await questions.createIndex({ examType: 1 })
        console.log("✅ Created indexes on questions collection")

        // Flashcards collection indexes
        const flashcards = db.collection("flashcards")

        await flashcards.createIndex({ subject: 1 })
        await flashcards.createIndex({ category: 1 })
        console.log("✅ Created indexes on flashcards collection")

        // Discussions collection indexes
        const discussions = db.collection("discussions")

        await discussions.createIndex({ subject: 1 })
        await discussions.createIndex({ createdAt: -1 })
        console.log("✅ Created indexes on discussions collection")

        console.log("🎉 All database indexes created successfully!")

    } catch (error) {
        console.error("Error setting up indexes:", error)
    } finally {
        await client.close()
    }
}

setupIndexes() 