const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"

// Global connection instance
let client = null
let isConnecting = false

async function connectToDatabase() {
    if (client && client.topology && client.topology.isConnected()) {
        return client
    }

    if (isConnecting) {
        // Wait for existing connection attempt
        while (isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        return client
    }

    isConnecting = true
    try {
        client = new MongoClient(uri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            retryWrites: true,
            retryReads: true,
        })
        await client.connect()
        console.log("MongoDB connected successfully")
    } catch (error) {
        console.error("MongoDB connection error:", error)
        client = null
    } finally {
        isConnecting = false
    }

    return client
}

async function getDatabase() {
    const client = await connectToDatabase()
    if (!client) {
        throw new Error("Failed to connect to database")
    }
    return client.db("groupxam")
}

async function closeConnection() {
    if (client) {
        await client.close()
        client = null
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await closeConnection()
    process.exit(0)
})

process.on('SIGTERM', async () => {
    await closeConnection()
    process.exit(0)
})

module.exports = {
    connectToDatabase,
    getDatabase,
    closeConnection
} 