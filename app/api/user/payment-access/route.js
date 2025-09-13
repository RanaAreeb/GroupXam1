import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('email');

        if (!userEmail) {
            return NextResponse.json({
                success: true,
                hasAccess: false,
                packageType: null,
                expiresAt: null
            });
        }

        const db = await getDatabase();

        // Get user's payment access info
        const user = await db.collection('users').findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json({
                success: true,
                hasAccess: false,
                packageType: null,
                expiresAt: null
            });
        }

        // Check if user has paid access and if it's still valid
        const hasAccess = user.hasPaidAccess &&
            user.accessExpiresAt &&
            new Date(user.accessExpiresAt) > new Date();

        return NextResponse.json({
            success: true,
            hasAccess,
            packageType: user.packageType || null,
            expiresAt: user.accessExpiresAt || null
        });
    } catch (error) {
        console.error('Error checking payment access:', error);
        return NextResponse.json({
            success: true,
            hasAccess: false,
            packageType: null,
            expiresAt: null
        });
    }
}
