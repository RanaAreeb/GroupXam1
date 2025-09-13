import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function POST(request) {
    try {
        const { userEmail, access, packageType, accessExpiresAt, lastPaymentDate } = await request.json();

        if (!userEmail || !access) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

        const db = await getDatabase();

        // Update user's access
        await db.collection('users').updateOne(
            { email: userEmail },
            {
                $set: {
                    hasPaidAccess: true,
                    packageType,
                    access,
                    accessExpiresAt: accessExpiresAt ? new Date(accessExpiresAt) : null,
                    lastPaymentDate: lastPaymentDate ? new Date(lastPaymentDate) : null
                }
            }
        );

        console.log(`Fixed access for user: ${userEmail}`, access);

        return NextResponse.json({
            success: true,
            message: 'User access updated successfully'
        });
    } catch (error) {
        console.error('Error fixing user access:', error);
        return NextResponse.json({
            error: 'Failed to fix user access',
            details: error.message
        }, { status: 500 });
    }
}
