import { getDatabase, isConnected } from "@/lib/db";

export async function GET() {
    try {
        const connected = await isConnected();
        
        if (!connected) {
            return Response.json(
                { 
                    status: "error", 
                    message: "Database connection failed",
                    timestamp: new Date().toISOString()
                },
                { status: 503 }
            );
        }

        // Test database operations
        const db = await getDatabase();
        await db.admin().ping();

        return Response.json({
            status: "healthy",
            database: "connected",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Health check error:", error);
        return Response.json(
            { 
                status: "error", 
                message: error.message,
                timestamp: new Date().toISOString()
            },
            { status: 503 }
        );
    }
}
