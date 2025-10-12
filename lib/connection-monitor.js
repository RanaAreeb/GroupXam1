const { connectToDatabase, isConnected } = require('./db.js');

class ConnectionMonitor {
    constructor() {
        this.connectionStats = {
            totalConnections: 0,
            activeConnections: 0,
            failedConnections: 0,
            lastCheck: new Date(),
            alerts: []
        };

        // DISABLED: Prevent monitoring errors
        // this.startMonitoring();
    }

    async startMonitoring() {
        // Monitor every 30 seconds
        setInterval(async () => {
            await this.checkConnectionHealth();
        }, 30000);

        // Log connection stats every 5 minutes
        setInterval(() => {
            this.logConnectionStats();
        }, 300000);
    }

    async checkConnectionHealth() {
        try {
            const isHealthy = await isConnected();

            if (!isHealthy) {
                this.connectionStats.failedConnections++;
                this.addAlert('CONNECTION_HEALTH', 'Database connection unhealthy');

                // Attempt to reconnect
                try {
                    await connectToDatabase();
                    this.addAlert('CONNECTION_RECOVERY', 'Database connection recovered');
                } catch (error) {
                    this.addAlert('CONNECTION_FAILURE', `Failed to reconnect: ${error.message}`);
                }
            } else {
                this.connectionStats.activeConnections++;
            }

            this.connectionStats.lastCheck = new Date();
        } catch (error) {
            console.error('Connection monitoring error:', error);
            this.addAlert('MONITORING_ERROR', error.message);
        }
    }

    addAlert(type, message) {
        const alert = {
            type,
            message,
            timestamp: new Date(),
            severity: this.getSeverity(type)
        };

        this.connectionStats.alerts.push(alert);

        // Keep only last 100 alerts
        if (this.connectionStats.alerts.length > 100) {
            this.connectionStats.alerts = this.connectionStats.alerts.slice(-100);
        }

        // Log critical alerts
        if (alert.severity === 'CRITICAL') {
            console.error(`🚨 CRITICAL DB ALERT: ${message}`);
        } else if (alert.severity === 'WARNING') {
            console.warn(`⚠️  DB WARNING: ${message}`);
        }
    }

    getSeverity(type) {
        const severityMap = {
            'CONNECTION_HEALTH': 'WARNING',
            'CONNECTION_FAILURE': 'CRITICAL',
            'CONNECTION_RECOVERY': 'INFO',
            'MONITORING_ERROR': 'WARNING'
        };
        return severityMap[type] || 'INFO';
    }

    logConnectionStats() {
        console.log('📊 Connection Stats:', {
            active: this.connectionStats.activeConnections,
            failed: this.connectionStats.failedConnections,
            lastCheck: this.connectionStats.lastCheck,
            recentAlerts: this.connectionStats.alerts.slice(-5)
        });
    }

    getStats() {
        return {
            ...this.connectionStats,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            timestamp: new Date()
        };
    }

    // Industry-standard connection health check
    async performHealthCheck() {
        const healthCheck = {
            status: 'healthy',
            timestamp: new Date(),
            checks: {}
        };

        try {
            // Check database connectivity
            const dbConnected = await isConnected();
            healthCheck.checks.database = {
                status: dbConnected ? 'healthy' : 'unhealthy',
                responseTime: Date.now()
            };

            // Check memory usage
            const memUsage = process.memoryUsage();
            healthCheck.checks.memory = {
                status: memUsage.heapUsed < 100 * 1024 * 1024 ? 'healthy' : 'warning', // 100MB threshold
                usage: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`
            };

            // Overall status
            const allHealthy = Object.values(healthCheck.checks).every(check => check.status === 'healthy');
            healthCheck.status = allHealthy ? 'healthy' : 'degraded';

            return healthCheck;
        } catch (error) {
            healthCheck.status = 'unhealthy';
            healthCheck.error = error.message;
            return healthCheck;
        }
    }
}

// Singleton instance
const connectionMonitor = new ConnectionMonitor();

module.exports = connectionMonitor;
