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

        // Find user by email - explicitly include all fields
        const user = await usersCollection.findOne(
            { email: decoded.email },
            { projection: {} } // Return all fields
        );
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check payment status - prioritize access.packageType for premium subscriptions
        // Premium subscriptions are stored in access.packageType (subscription-3month, subscription-6month, subscription-12month)
        // Also check root level fields in case they're stored there
        const accessPackageType = user.access?.packageType || user.packageType || null;
        const isPremiumPackage = accessPackageType === 'subscription-3month' || 
                                 accessPackageType === 'subscription-6month' || 
                                 accessPackageType === 'subscription-12month';
        
        // Use access.packageType if it's a premium subscription, otherwise use paymentStatus.packageType
        const packageType = isPremiumPackage ? accessPackageType : (user.paymentStatus?.packageType || null);
        
        // Check access expiration - prioritize access.accessExpiresAt for premium subscriptions
        // Also check root level accessExpiresAt
        const accessExpiryDate = user.access?.accessExpiresAt || user.accessExpiresAt || null;
        const expiryDate = isPremiumPackage && accessExpiryDate 
            ? accessExpiryDate 
            : (user.paymentStatus?.expiryDate || null);
        
        // Check if user has access - for premium, check access.hasPaidAccess and expiry
        // Also check root level hasPaidAccess
        let hasAccess = false;
        if (isPremiumPackage) {
            const accessHasPaidAccess = user.access?.hasPaidAccess || user.hasPaidAccess || false;
            hasAccess = accessHasPaidAccess === true && 
                       accessExpiryDate && 
                       new Date(accessExpiryDate) > new Date();
        } else {
            hasAccess = user.paymentStatus?.hasAccess || false;
        }

        // Debug logging - log full user object to see structure
        console.log('Payment status API - Full Debug:', {
            userEmail: decoded.email,
            paymentStatus: user.paymentStatus,
            access: user.access,
            accessType: typeof user.access,
            accessKeys: user.access ? Object.keys(user.access) : null,
            // Root level fields
            rootPackageType: user.packageType,
            rootHasPaidAccess: user.hasPaidAccess,
            rootAccessExpiresAt: user.accessExpiresAt,
            // Access object fields
            accessPackageType: user.access?.packageType,
            accessHasPaidAccess: user.access?.hasPaidAccess,
            accessAccessExpiresAt: user.access?.accessExpiresAt,
            // Resolved values
            resolvedPackageType: accessPackageType,
            resolvedExpiryDate: accessExpiryDate,
            hasAccess,
            packageType,
            expiryDate,
            isPremiumPackage
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

