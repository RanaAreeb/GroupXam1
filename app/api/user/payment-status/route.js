import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/db';

export async function GET(request) {
    try {
        // Get token from cookies
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.email) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const db = await getDatabase();
        const usersCollection = db.collection('users');

        // Find user by email
        const user = await usersCollection.findOne({ email: decoded.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check payment status
        const hasAccess = user.paymentStatus?.hasAccess || false;
        const packageType = user.paymentStatus?.packageType || null;
        const expiryDate = user.paymentStatus?.expiryDate || null;

        // Debug logging
        console.log('Payment status API response:', {
            userEmail: decoded.email,
            paymentStatus: user.paymentStatus,
            hasAccess,
            packageType,
            expiryDate
        });

        return NextResponse.json({
            hasAccess,
            packageType,
            expiryDate,
            userId: user._id
        });

    } catch (error) {
        console.error('Payment status check error:', error);
        return NextResponse.json(
            { error: 'Failed to check payment status' },
            { status: 500 }
        );
    }
}

