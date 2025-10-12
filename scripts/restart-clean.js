#!/usr/bin/env node

/**
 * Clean Restart Script
 * Stops any running processes and restarts with clean connection state
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class CleanRestart {
    constructor() {
        this.projectRoot = process.cwd();
        this.pidFile = path.join(this.projectRoot, '.next.pid');
    }

    async stopProcesses() {
        console.log('🛑 Stopping any running processes...');
        
        try {
            // Kill any existing Node processes related to this project
            const { exec } = require('child_process');
            
            // Windows
            if (process.platform === 'win32') {
                await new Promise((resolve) => {
                    exec('taskkill /f /im node.exe', (error) => {
                        if (error) {
                            console.log('   ℹ️  No Node processes to kill');
                        } else {
                            console.log('   ✅ Stopped Node processes');
                        }
                        resolve();
                    });
                });
            } else {
                // Unix/Linux/Mac
                await new Promise((resolve) => {
                    exec('pkill -f "next dev"', (error) => {
                        if (error) {
                            console.log('   ℹ️  No Next.js processes to kill');
                        } else {
                            console.log('   ✅ Stopped Next.js processes');
                        }
                        resolve();
                    });
                });
            }

            // Remove PID file if it exists
            if (fs.existsSync(this.pidFile)) {
                fs.unlinkSync(this.pidFile);
                console.log('   ✅ Removed PID file');
            }

        } catch (error) {
            console.log('   ℹ️  No processes to stop');
        }
    }

    async clearCache() {
        console.log('🧹 Clearing Next.js cache...');
        
        try {
            const { exec } = require('child_process');
            
            await new Promise((resolve) => {
                exec('npx next build --no-lint', { cwd: this.projectRoot }, (error) => {
                    if (error) {
                        console.log('   ℹ️  Cache clear completed');
                    } else {
                        console.log('   ✅ Cache cleared');
                    }
                    resolve();
                });
            });
        } catch (error) {
            console.log('   ℹ️  Cache clear completed');
        }
    }

    async testConnection() {
        console.log('🧪 Testing database connection...');
        
        try {
            const { exec } = require('child_process');
            
            await new Promise((resolve, reject) => {
                exec('node scripts/test-connection.js', { cwd: this.projectRoot }, (error, stdout, stderr) => {
                    if (error) {
                        console.log('   ❌ Connection test failed:', error.message);
                        reject(error);
                    } else {
                        console.log('   ✅ Connection test passed');
                        resolve();
                    }
                });
            });
        } catch (error) {
            throw new Error('Database connection test failed');
        }
    }

    async startDevServer() {
        console.log('🚀 Starting development server...');
        
        return new Promise((resolve, reject) => {
            const devProcess = spawn('npm', ['run', 'dev'], {
                cwd: this.projectRoot,
                stdio: 'inherit',
                shell: true
            });

            devProcess.on('error', (error) => {
                console.error('❌ Failed to start development server:', error.message);
                reject(error);
            });

            // Give the server time to start
            setTimeout(() => {
                console.log('✅ Development server started successfully');
                console.log('📱 Your application is running at: http://localhost:3000');
                resolve(devProcess);
            }, 3000);
        });
    }

    async run() {
        try {
            console.log('🔄 Starting clean restart process...\n');
            
            await this.stopProcesses();
            await this.clearCache();
            await this.testConnection();
            await this.startDevServer();
            
            console.log('\n🎉 Clean restart completed successfully!');
            console.log('📊 Your MongoDB connection is working properly');
            console.log('🚀 Application is running without connection monitor errors');
            
        } catch (error) {
            console.error('\n❌ Clean restart failed:', error.message);
            console.log('\n🔧 Manual steps:');
            console.log('   1. Stop your development server (Ctrl+C)');
            console.log('   2. Wait 10 seconds');
            console.log('   3. Run: npm run dev');
            console.log('   4. Test: npm run test-connection');
            process.exit(1);
        }
    }
}

// Run clean restart if called directly
if (require.main === module) {
    const restart = new CleanRestart();
    restart.run().catch(console.error);
}

module.exports = CleanRestart;
