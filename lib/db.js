const { MongoClient } = require("mongodb")

// Increase max listeners to prevent warnings
process.setMaxListeners(20)

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"

// Global connection instance
let client = null
let isConnecting = false
let listenersAdded = false

async function connectToDatabase() {
    // Check if client exists and is connected
    if (client && client.topology && client.topology.isConnected()) {
        return client
    }

    // If already connecting, wait for the connection attempt to complete
    if (isConnecting) {
        let waitTime = 0;
        while (isConnecting && waitTime < 10000) { // Wait max 10 seconds
            await new Promise(resolve => setTimeout(resolve, 100))
            waitTime += 100;
        }
        if (client && client.topology && client.topology.isConnected()) {
            return client
        }
    }

    isConnecting = true
    try {
        // Close existing client if it exists but is not connected
        if (client) {
            try {
                await client.close()
            } catch (closeError) {
                console.log("Error closing existing client:", closeError.message)
            }
            client = null
        }

        client = new MongoClient(uri, {
            maxPoolSize: 10, // Increased pool size
            minPoolSize: 2, // Increased minimum connections
            maxIdleTimeMS: 60000, // Increased idle time to 60 seconds
            serverSelectionTimeoutMS: 10000, // Increased server selection timeout
            socketTimeoutMS: 60000, // Increased socket timeout
            connectTimeoutMS: 15000, // Increased connection timeout
            retryWrites: true,
            retryReads: true,
            waitQueueTimeoutMS: 15000, // Increased wait queue timeout to 15 seconds
            maxConnecting: 5, // Limit concurrent connection attempts
            heartbeatFrequencyMS: 10000, // Heartbeat every 10 seconds
        })

        await client.connect()
        console.log("MongoDB connected successfully")

        // Test the connection
        await client.db("groupxam").admin().ping()
        console.log("MongoDB connection verified")

    } catch (error) {
        console.error("MongoDB connection error:", error)
        if (client) {
            try {
                await client.close()
            } catch (closeError) {
                console.log("Error closing failed client:", closeError.message)
            }
            client = null
        }
    } finally {
        isConnecting = false
    }

    return client
}

async function getDatabase() {
    let currentClient = await connectToDatabase()
    if (!currentClient) {
        throw new Error("Failed to connect to database")
    }

    // Check if connection is still healthy
    try {
        await currentClient.db("groupxam").admin().ping()
    } catch (pingError) {
        console.log("Database ping failed, reconnecting...", pingError.message)
        // Force reconnection by setting global client to null
        client = null
        currentClient = await connectToDatabase()
        if (!currentClient) {
            throw new Error("Failed to reconnect to database")
        }
        return currentClient.db("groupxam")
    }

    return currentClient.db("groupxam")
}

async function closeConnection() {
    if (client) {
        await client.close()
        client = null
    }
}

// Graceful shutdown - only add listeners once
if (!listenersAdded) {
    process.on('SIGINT', async () => {
        await closeConnection()
        process.exit(0)
    })

    process.on('SIGTERM', async () => {
        await closeConnection()
        process.exit(0)
    })

    listenersAdded = true
}

module.exports = {
    connectToDatabase,
    getDatabase,
    closeConnection
} 