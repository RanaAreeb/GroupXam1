import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';

export async function GET(request) {
    try {
        // Get the token from the Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.email) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const db = await connectDB();
        const usersCollection = db.collection('users');

        // Find user by email
        const user = await usersCollection.findOne({ email: decoded.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check proctoring access - available for K-12 and Universities packages
        const hasProctoringAccess = user.paymentStatus?.hasAccess &&
            (user.paymentStatus?.packageType === 'k12' ||
                user.paymentStatus?.packageType === 'universities');

        return NextResponse.json({
            hasAccess: hasProctoringAccess,
            packageType: user.paymentStatus?.packageType || null
        });

    } catch (error) {
        console.error('Proctoring access check error:', error);
        return NextResponse.json(
            { error: 'Failed to check proctoring access' },
            { status: 500 }
        );
    }
}

