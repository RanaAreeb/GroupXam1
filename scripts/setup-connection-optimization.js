#!/usr/bin/env node

/**
 * Setup script for MongoDB connection optimization
 * This script helps configure the application for optimal database performance
 */

const fs = require('fs');
const path = require('path');

class ConnectionSetup {
    constructor() {
        this.projectRoot = process.cwd();
        this.envPath = path.join(this.projectRoot, '.env.local');
    }

    async setupEnvironment() {
        console.log('🔧 Setting up MongoDB connection optimization...\n');

        // Check if .env.local exists
        if (!fs.existsSync(this.envPath)) {
            console.log('📝 Creating .env.local file...');
            await this.createEnvFile();
        } else {
            console.log('✅ .env.local already exists');
        }

        // Update package.json scripts
        await this.updatePackageScripts();

        // Create monitoring configuration
        await this.createMonitoringConfig();

        console.log('\n✅ Connection optimization setup completed!');
        console.log('\n📋 Next steps:');
        console.log('   1. Update your MONGODB_URI in .env.local');
        console.log('   2. Run: npm run optimize-connections');
        console.log('   3. Monitor with: npm run health-check');
        console.log('   4. Set up alerts for connection usage');
    }

    async createEnvFile() {
        const envContent = `# MongoDB Configuration - OPTIMIZED FOR ATLAS
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groupxam?retryWrites=true&w=majority

# Database Name
DB_NAME=groupxam

# JWT Secret - Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Connection Optimization (automatically applied)
# maxPoolSize=10
# minPoolSize=2
# maxIdleTimeMS=60000

# Monitoring
ENABLE_DB_MONITORING=true
HEALTH_CHECK_INTERVAL=30000

# Performance
ENABLE_QUERY_CACHING=true
CACHE_TIMEOUT=30000
SLOW_QUERY_THRESHOLD=1000
`;

        fs.writeFileSync(this.envPath, envContent);
        console.log('   ✅ Created .env.local with optimized configuration');
    }

    async updatePackageScripts() {
        const packagePath = path.join(this.projectRoot, 'package.json');
        
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            // Add optimization scripts
            packageJson.scripts = {
                ...packageJson.scripts,
                'optimize-connections': 'node scripts/connection-optimizer.js',
                'health-check': 'node -e "fetch(\'http://localhost:3000/api/health/db\').then(r=>r.json()).then(console.log).catch(console.error)"',
                'db-stats': 'node -e "const {getDatabase} = require(\'./lib/db.js\'); getDatabase().then(db => db.admin().serverStatus()).then(s => console.log(\'Connections:\', s.connections)).catch(console.error)"'
            };

            fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
            console.log('   ✅ Updated package.json with optimization scripts');
        }
    }

    async createMonitoringConfig() {
        const monitoringConfig = {
            enabled: true,
            intervals: {
                healthCheck: 30000,    // 30 seconds
                statsLogging: 300000,  // 5 minutes
                connectionCheck: 10000 // 10 seconds
            },
            thresholds: {
                maxConnections: 50,
                slowQueryMs: 1000,
                memoryWarningMB: 100
            },
            alerts: {
                email: null, // Configure email alerts if needed
                webhook: null // Configure webhook alerts if needed
            }
        };

        const configPath = path.join(this.projectRoot, 'monitoring-config.json');
        fs.writeFileSync(configPath, JSON.stringify(monitoringConfig, null, 2));
        console.log('   ✅ Created monitoring configuration');
    }

    async generateJWTSecret() {
        const crypto = require('crypto');
        const secret = crypto.randomBytes(64).toString('hex');
        console.log('\n🔑 Generated JWT Secret:');
        console.log(`JWT_SECRET=${secret}`);
        console.log('\n📝 Add this to your .env.local file');
        return secret;
    }

    async run() {
        try {
            await this.setupEnvironment();
            await this.generateJWTSecret();
        } catch (error) {
            console.error('❌ Setup failed:', error.message);
            process.exit(1);
        }
    }
}

// Run setup if called directly
if (require.main === module) {
    const setup = new ConnectionSetup();
    setup.run().catch(console.error);
}

module.exports = ConnectionSetup;
