const { MongoClient } = require("mongodb")

// Increase max listeners to prevent warnings
process.setMaxListeners(20)

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"

// Global connection instance
let client = null
let isConnecting = false
let listenersAdded = false

async function connectToDatabase(retryCount = 0) {
    const maxRetries = 3;
    
    // Check if client exists and is connected
    if (client && client.topology && client.topology.isConnected()) {
        try {
            // Quick ping to verify connection is still alive
            await client.db("groupxam").admin().ping();
            return client;
        } catch (pingError) {
            console.log("Connection ping failed, reconnecting...");
            client = null;
        }
    }

    // If already connecting, wait for the connection attempt to complete
    if (isConnecting) {
        let waitTime = 0;
        while (isConnecting && waitTime < 15000) { // Wait max 15 seconds
            await new Promise(resolve => setTimeout(resolve, 200))
            waitTime += 200;
        }
        if (client && client.topology && client.topology.isConnected()) {
            try {
                await client.db("groupxam").admin().ping();
                return client;
            } catch (pingError) {
                console.log("Waited connection ping failed, reconnecting...");
                client = null;
            }
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
            maxPoolSize: 5, // Reduced pool size to prevent connection issues
            minPoolSize: 1, // Reduced minimum connections
            maxIdleTimeMS: 30000, // Reduced idle time to 30 seconds
            serverSelectionTimeoutMS: 15000, // Increased server selection timeout
            socketTimeoutMS: 45000, // Reduced socket timeout
            connectTimeoutMS: 20000, // Increased connection timeout
            retryWrites: true,
            retryReads: true,
            waitQueueTimeoutMS: 20000, // Increased wait queue timeout to 20 seconds
            maxConnecting: 3, // Reduced concurrent connection attempts
            heartbeatFrequencyMS: 15000, // Heartbeat every 15 seconds
            // SSL/TLS configuration fixes
            tls: true,
            tlsAllowInvalidCertificates: false,
            tlsAllowInvalidHostnames: false,
            // Connection pool fixes
            compressors: ['zlib'],
            zlibCompressionLevel: 6,
            // Additional stability options
            directConnection: false,
            appName: 'groupxam-app'
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
        
        // Retry logic for connection failures
        if (retryCount < maxRetries) {
            console.log(`Retrying connection (attempt ${retryCount + 1}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1))); // Exponential backoff
            isConnecting = false;
            return await connectToDatabase(retryCount + 1);
        }
    } finally {
        isConnecting = false
    }

    return client
}

async function getDatabase() {
    try {
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
        }

        return currentClient.db("groupxam")
    } catch (error) {
        console.error("getDatabase error:", error.message)
        throw new Error("Failed to connect to database")
    }
}

async function closeConnection() {
    if (client) {
        try {
            await client.close()
            console.log("MongoDB connection closed successfully")
        } catch (error) {
            console.log("Error closing MongoDB connection:", error.message)
        } finally {
            client = null
            isConnecting = false
        }
    }
}

async function isConnected() {
    try {
        if (client && client.topology && client.topology.isConnected()) {
            await client.db("groupxam").admin().ping()
            return true
        }
        return false
    } catch (error) {
        return false
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
    closeConnection,
    isConnected
} 