const { getDatabase } = require('../lib/db');

async function fixUserAccess() {
    try {
        console.log('Starting user access fix...');
        const db = await getDatabase();

        // Get all users with payments
        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users`);

        for (const user of users) {
            // Get the latest approved payment for this user
            const latestPayment = await db.collection('payments')
                .findOne(
                    {
                        userEmail: user.email,
                        status: 'approved'
                    },
                    { sort: { paymentDate: -1 } }
                );

            if (latestPayment) {
                console.log(`Processing user: ${user.email} with package: ${latestPayment.package}`);

                // Determine access based on package type
                let access = {};
                switch (latestPayment.package) {
                    case 'monthly':
                    case '6months':
                    case 'yearly':
                        access = {
                            ielts: true,
                            proctor: latestPayment.package === '6months' || latestPayment.package === 'yearly',
                            university: latestPayment.package === 'yearly'
                        };
                        break;
                    default:
                        access = { ielts: true }; // Default to IELTS access
                }

                // Update user access
                await db.collection('users').updateOne(
                    { email: user.email },
                    {
                        $set: {
                            hasPaidAccess: true,
                            packageType: latestPayment.package,
                            access,
                            accessExpiresAt: latestPayment.expiresAt,
                            lastPaymentDate: latestPayment.paymentDate
                        }
                    }
                );

                console.log(`Updated access for ${user.email}:`, access);
            } else {
                console.log(`No approved payment found for ${user.email}`);
            }
        }

        console.log('User access fix completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing user access:', error);
        process.exit(1);
    }
}

fixUserAccess();
