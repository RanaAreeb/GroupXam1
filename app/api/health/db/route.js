import { NextResponse } from 'next/server';
import { isConnected } from '../../../../lib/db.js';
import connectionMonitor from '../../../../lib/connection-monitor.js';

export async function GET(request) {
    try {
        const startTime = Date.now();
        
        // Perform comprehensive health check
        const healthCheck = await connectionMonitor.performHealthCheck();
        
        // Add response time
        healthCheck.responseTime = Date.now() - startTime;
        
        // Add connection monitor stats
        healthCheck.connectionStats = connectionMonitor.getStats();
        
        // Determine HTTP status code
        const statusCode = healthCheck.status === 'healthy' ? 200 : 
                          healthCheck.status === 'degraded' ? 206 : 503;
        
        return NextResponse.json(healthCheck, { status: statusCode });
        
    } catch (error) {
        console.error('Health check failed:', error);
        
        return NextResponse.json({
            status: 'unhealthy',
            timestamp: new Date(),
            error: error.message,
            responseTime: Date.now() - Date.now()
        }, { status: 503 });
    }
}

// Simple ping endpoint for basic connectivity
export async function POST(request) {
    try {
        const isHealthy = await isConnected();
        
        return NextResponse.json({
            status: isHealthy ? 'ok' : 'error',
            timestamp: new Date(),
            database: isHealthy ? 'connected' : 'disconnected'
        }, { status: isHealthy ? 200 : 503 });
        
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            timestamp: new Date(),
            error: error.message
        }, { status: 503 });
    }
}
