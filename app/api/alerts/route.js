import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/db.js';

async function connectDB() {
    return await getDatabase();
}

// GET - Get active alerts for a user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('userEmail');

        if (!userEmail) {
            return NextResponse.json(
                { success: false, error: 'User email is required' },
                { status: 400 }
            );
        }

        const db = await connectDB();

        // Get active alerts for all users
        const alerts = await db.collection('alerts').find({
            isActive: true,
            $or: [
                { expiresAt: null }, // No expiration
                { expiresAt: { $gt: new Date() } } // Not expired
            ]
        }).sort({ createdAt: -1 }).toArray();

        // Filter out alerts that have already been shown to this user (if showOnce is true)
        const alertHistory = await db.collection('alertHistory').find({
            userEmail: userEmail,
            alertId: { $in: alerts.map(alert => alert._id.toString()) }
        }).toArray();

        const shownAlertIds = new Set(alertHistory.map(h => h.alertId));
        const filteredAlerts = alerts.filter(alert => {
            if (!alert.showOnce) return true;
            return !shownAlertIds.has(alert._id.toString());
        });

        return NextResponse.json({
            success: true,
            alerts: filteredAlerts
        });
    } catch (error) {
        console.error('Error fetching user alerts:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch alerts' },
            { status: 500 }
        );
    }
}

// POST - Record that an alert was shown to a user
export async function POST(request) {
    try {
        const body = await request.json();
        const { alertId, userEmail } = body;

        if (!alertId || !userEmail) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const db = await connectDB();

        // Record that this alert was shown to this user
        const alertHistory = {
            alertId,
            userEmail,
            shownAt: new Date()
        };

        await db.collection('alertHistory').insertOne(alertHistory);

        return NextResponse.json({
            success: true,
            message: 'Alert history recorded'
        });
    } catch (error) {
        console.error('Error recording alert history:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to record alert history' },
            { status: 500 }
        );
    }
}
