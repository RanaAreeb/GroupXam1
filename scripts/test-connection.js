#!/usr/bin/env node

/**
 * Simple MongoDB Connection Test
 * Tests the fixed connection configuration
 */

require('dotenv').config({ path: '.env.local' });
const { getDatabase, isConnected, closeConnection } = require('../lib/db.js');

async function testConnection() {
    console.log('🧪 Testing MongoDB Connection...\n');

    try {
        // Test basic connection
        console.log('1. Testing basic connection...');
        const db = await getDatabase();
        console.log('   ✅ Database connection successful');

        // Test ping
        console.log('2. Testing database ping...');
        await db.admin().ping();
        console.log('   ✅ Database ping successful');

        // Test connection status
        console.log('3. Testing connection status...');
        const connected = await isConnected();
        console.log(`   ✅ Connection status: ${connected ? 'Connected' : 'Disconnected'}`);

        // Test basic query
        console.log('4. Testing basic query...');
        const collections = await db.listCollections().toArray();
        console.log(`   ✅ Found ${collections.length} collections`);

        console.log('\n🎉 All connection tests passed!');
        console.log('✅ Your MongoDB connection is working properly');

    } catch (error) {
        console.error('\n❌ Connection test failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    } finally {
        // Clean up
        try {
            await closeConnection();
            console.log('\n🔌 Connection closed successfully');
        } catch (closeError) {
            console.log('⚠️  Error closing connection:', closeError.message);
        }
    }
}

// Run test if called directly
if (require.main === module) {
    testConnection().catch(console.error);
}

module.exports = testConnection;
