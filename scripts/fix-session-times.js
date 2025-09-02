// Script to fix excessive session times in the database
// Run this once to clean up the incorrect session data

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'your-mongodb-connection-string';

async function fixSessionTimes() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('groupxam');
        const sessions = db.collection('sessions');
        const users = db.collection('users');

        // Find sessions with unrealistic durations (more than 4 hours = 14400 seconds)
        const longSessions = await sessions.find({
            sessionDuration: { $gt: 14400 } // More than 4 hours
        }).toArray();

        console.log(`Found ${longSessions.length} sessions with excessive duration`);

        if (longSessions.length > 0) {
            // Cap all excessive sessions to maximum 4 hours
            const result = await sessions.updateMany(
                { sessionDuration: { $gt: 14400 } },
                {
                    $set: {
                        sessionDuration: 14400, // Cap at 4 hours
                        updatedAt: new Date(),
                        fixedAt: new Date(),
                        originalDuration: { $sessionDuration: 1 }  // Keep track of original value
                    }
                }
            );

            console.log(`Updated ${result.modifiedCount} sessions`);
        }

        // Recalculate user session statistics
        const allUsers = await users.find({}).toArray();
        console.log(`Recalculating stats for ${allUsers.length} users...`);

        for (const user of allUsers) {
            const userSessions = await sessions.find({ userId: user._id }).toArray();

            if (userSessions.length > 0) {
                const totalSessionTime = userSessions.reduce((sum, session) => sum + (session.sessionDuration || 0), 0);
                const totalPageViews = userSessions.reduce((sum, session) => sum + (session.pageViews || 0), 0);
                const averageSessionTime = totalSessionTime / userSessions.length;
                const lastSessionAt = userSessions.reduce((latest, session) => {
                    const sessionDate = session.endTime || session.createdAt;
                    return sessionDate > latest ? sessionDate : latest;
                }, new Date(0));

                await users.updateOne(
                    { _id: user._id },
                    {
                        $set: {
                            sessionStats: {
                                totalSessions: userSessions.length,
                                totalSessionTime: totalSessionTime,
                                totalPageViews: totalPageViews,
                                averageSessionTime: Math.round(averageSessionTime),
                                lastSessionAt: lastSessionAt
                            },
                            updatedAt: new Date()
                        }
                    }
                );

                console.log(`Updated stats for user: ${user.email} - Total time: ${Math.round(totalSessionTime / 60)} minutes`);
            }
        }

        console.log('Session time fix completed!');

    } catch (error) {
        console.error('Error fixing session times:', error);
    } finally {
        await client.close();
    }
}

// Run the fix
if (require.main === module) {
    fixSessionTimes().catch(console.error);
}

module.exports = { fixSessionTimes };

