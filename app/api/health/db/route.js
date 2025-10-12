import { NextResponse } from 'next/server';
import { isConnected, getDatabase } from '../../../../lib/db.js';
import simpleMonitor from '../../../../lib/simple-monitor.js';

export async function GET(request) {
    try {
        const startTime = Date.now();

        // Perform basic health check
        const healthCheck = {
            status: 'healthy',
            timestamp: new Date(),
            checks: {}
        };

        // Check database connectivity
        const dbConnected = await isConnected();
        healthCheck.checks.database = {
            status: dbConnected ? 'healthy' : 'unhealthy',
            responseTime: Date.now() - startTime
        };

        // Check memory usage
        const memUsage = process.memoryUsage();
        healthCheck.checks.memory = {
            status: memUsage.heapUsed < 100 * 1024 * 1024 ? 'healthy' : 'warning',
            usage: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`
        };

        // Add response time
        healthCheck.responseTime = Date.now() - startTime;

        // Add monitoring stats
        healthCheck.monitoring = simpleMonitor.getStats();

        // Overall status
        const allHealthy = Object.values(healthCheck.checks).every(check => check.status === 'healthy');
        healthCheck.status = allHealthy ? 'healthy' : 'degraded';

        // Determine HTTP status code
        const statusCode = healthCheck.status === 'healthy' ? 200 : 503;

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
