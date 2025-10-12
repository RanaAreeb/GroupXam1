/**
 * Simple Connection Monitor
 * Lightweight monitoring without circular dependencies
 */

class SimpleMonitor {
    constructor() {
        this.stats = {
            connectionChecks: 0,
            lastCheck: new Date(),
            errors: []
        };
    }

    async checkConnection(uri) {
        try {
            const { MongoClient } = require('mongodb');
            const client = new MongoClient(uri, {
                maxPoolSize: 1,
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000
            });

            await client.connect();
            await client.db().admin().ping();
            await client.close();

            this.stats.connectionChecks++;
            this.stats.lastCheck = new Date();
            
            return {
                status: 'healthy',
                timestamp: new Date(),
                checks: this.stats.connectionChecks
            };
        } catch (error) {
            this.stats.errors.push({
                error: error.message,
                timestamp: new Date()
            });

            return {
                status: 'unhealthy',
                timestamp: new Date(),
                error: error.message,
                checks: this.stats.connectionChecks
            };
        }
    }

    getStats() {
        return {
            ...this.stats,
            recentErrors: this.stats.errors.slice(-5)
        };
    }
}

// Export singleton
const simpleMonitor = new SimpleMonitor();
module.exports = simpleMonitor;
