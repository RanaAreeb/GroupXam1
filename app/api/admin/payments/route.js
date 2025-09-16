import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

// GET - Fetch all payments
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('userEmail');

        const db = await getDatabase();

        const query = userEmail ? { userEmail } : {};
        const payments = await db.collection('payments')
            .find(query)
            .sort({ paymentDate: -1 })
            .toArray();

        console.log('Fetched payments:', payments.length, 'payments');

        return NextResponse.json({ success: true, payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
    }
}

// POST - Add manual payment
export async function POST(request) {
    try {
        const {
            userEmail,
            userName,
            amount,
            package: packageType,
            duration,
            paymentMethod,
            transactionId,
            paymentDate,
            notes,
            status = 'approved',
            serviceType = 'ielts'
        } = await request.json();

        // Validate required fields
        if (!userEmail || !userName || !amount || !packageType || !duration || !paymentMethod || !paymentDate) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        const db = await getDatabase();

        // Calculate expiration date
        const expiresAt = new Date(paymentDate);
        expiresAt.setDate(expiresAt.getDate() + parseInt(duration));

        const payment = {
            userEmail,
            userName,
            amount: parseFloat(amount),
            package: packageType,
            duration: parseInt(duration),
            paymentMethod,
            transactionId: transactionId || null,
            paymentDate: new Date(paymentDate),
            expiresAt,
            notes: notes || null,
            status,
            serviceType,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Insert payment record
        const result = await db.collection('payments').insertOne(payment);

        // Update user's access if payment is approved
        if (status === 'approved') {
            // Determine access based on package type
            let access = {};
            let paymentStatus = {};

            switch (packageType) {
                case 'monthly':
                case '6months':
                case 'yearly':
                    access = {
                        ielts: true,
                        proctor: packageType === '6months' || packageType === 'yearly',
                        university: packageType === 'yearly'
                    };
                    paymentStatus = {
                        hasAccess: true,
                        packageType: packageType === 'yearly' ? 'universities' : 'k12',
                        expiryDate: expiresAt.toISOString()
                    };
                    break;
                case 'proctor_students':
                    access = { proctor: true };
                    paymentStatus = {
                        hasAccess: true,
                        packageType: 'students',
                        expiryDate: expiresAt.toISOString()
                    };
                    break;
                case 'proctor_k12':
                    access = { proctor: true };
                    paymentStatus = {
                        hasAccess: true,
                        packageType: 'k12',
                        expiryDate: expiresAt.toISOString()
                    };
                    break;
                case 'proctor_universities':
                    access = { proctor: true };
                    paymentStatus = {
                        hasAccess: true,
                        packageType: 'universities',
                        expiryDate: expiresAt.toISOString()
                    };
                    break;
                default:
                    access = { ielts: true }; // Default to IELTS access
                    paymentStatus = {
                        hasAccess: true,
                        packageType: 'students',
                        expiryDate: expiresAt.toISOString()
                    };
            }

            await db.collection('users').updateOne(
                { email: userEmail },
                {
                    $set: {
                        hasPaidAccess: true,
                        packageType,
                        access,
                        paymentStatus,
                        accessExpiresAt: expiresAt,
                        lastPaymentDate: new Date(paymentDate)
                    }
                }
            );

            console.log(`Updated user access for ${userEmail}:`, { access, paymentStatus });
        }

        console.log('Added payment:', result.insertedId);

        return NextResponse.json({
            success: true,
            payment: { ...payment, _id: result.insertedId }
        });
    } catch (error) {
        console.error('Error adding payment:', error);
        return NextResponse.json({ error: 'Failed to add payment' }, { status: 500 });
    }
}

// PATCH - Approve or reject payment
export async function PATCH(request) {
    try {
        const { paymentId, action } = await request.json();

        if (!paymentId || !action || !['approve', 'reject'].includes(action)) {
            return NextResponse.json({
                error: 'Invalid payment ID or action'
            }, { status: 400 });
        }

        const db = await getDatabase();

        // Get the payment first
        const payment = await db.collection('payments').findOne({ _id: paymentId });
        if (!payment) {
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        const newStatus = action === 'approve' ? 'approved' : 'rejected';

        // Update payment status
        await db.collection('payments').updateOne(
            { _id: paymentId },
            {
                $set: {
                    status: newStatus,
                    updatedAt: new Date()
                }
            }
        );

        // Update user's access if payment is approved
        if (action === 'approve') {
            // Determine access based on package type
            let access = {};
            let paymentStatus = {};

            switch (payment.package) {
                case 'monthly':
                case '6months':
                case 'yearly':
                    access = {
                        ielts: true,
                        proctor: payment.package === '6months' || payment.package === 'yearly',
                        university: payment.package === 'yearly'
                    };
                    paymentStatus = {
                        hasAccess: true,
                        packageType: payment.package === 'yearly' ? 'universities' : 'k12',
                        expiryDate: payment.expiresAt.toISOString()
                    };
                    break;
                case 'proctor_students':
                    access = { proctor: true };
                    paymentStatus = {
                        hasAccess: true,
                        packageType: 'students',
                        expiryDate: payment.expiresAt.toISOString()
                    };
                    break;
                case 'proctor_k12':
                    access = { proctor: true };
                    paymentStatus = {
                        hasAccess: true,
                        packageType: 'k12',
                        expiryDate: payment.expiresAt.toISOString()
                    };
                    break;
                case 'proctor_universities':
                    access = { proctor: true, university: true };
                    paymentStatus = {
                        hasAccess: true,
                        packageType: 'universities',
                        expiryDate: payment.expiresAt.toISOString()
                    };
                    break;
                default:
                    access = { ielts: true }; // Default to IELTS access
                    paymentStatus = {
                        hasAccess: true,
                        packageType: 'students',
                        expiryDate: payment.expiresAt.toISOString()
                    };
            }

            await db.collection('users').updateOne(
                { email: payment.userEmail },
                {
                    $set: {
                        hasPaidAccess: true,
                        packageType: payment.package,
                        access,
                        paymentStatus,
                        accessExpiresAt: payment.expiresAt,
                        lastPaymentDate: payment.paymentDate
                    }
                }
            );

            console.log(`Updated user access for ${payment.userEmail}:`, { access, paymentStatus });
        } else if (action === 'reject') {
            // Remove access if payment is rejected
            await db.collection('users').updateOne(
                { email: payment.userEmail },
                {
                    $unset: {
                        hasPaidAccess: "",
                        packageType: "",
                        access: "",
                        paymentStatus: "",
                        accessExpiresAt: "",
                        lastPaymentDate: ""
                    }
                }
            );
        }

        console.log(`Payment ${action}d:`, paymentId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`Error ${action}ing payment:`, error);
        return NextResponse.json({ error: `Failed to ${action} payment` }, { status: 500 });
    }
}
