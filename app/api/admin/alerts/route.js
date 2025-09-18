import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'groupxam';

let client;
let db;

async function connectDB() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);
    }
    return db;
}

// GET - Fetch all alerts
export async function GET(request) {
    try {
        await connectDB();

        const alerts = await db.collection('alerts').find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
            success: true,
            alerts: alerts
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch alerts' },
            { status: 500 }
        );
    }
}

// POST - Create new alert
export async function POST(request) {
    try {
        const body = await request.json();
        const { type, title, message, isActive, showOnce, expiresAt, buttonText, buttonAction } = body;

        // Validate required fields
        if (!type || !title || !message || !buttonText || !buttonAction) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await connectDB();

        const alert = {
            type,
            title,
            message,
            // null means all users
            isActive: isActive || false,
            showOnce: showOnce || false,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            buttonText,
            buttonAction,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('alerts').insertOne(alert);

        return NextResponse.json({
            success: true,
            alert: { ...alert, _id: result.insertedId }
        });
    } catch (error) {
        console.error('Error creating alert:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create alert' },
            { status: 500 }
        );
    }
}

// PATCH - Update alert (toggle active status)
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { alertId, isActive } = body;

        if (!alertId || typeof isActive !== 'boolean') {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid parameters' },
                { status: 400 }
            );
        }

        await connectDB();

        const result = await db.collection('alerts').updateOne(
            { _id: new ObjectId(alertId) },
            { $set: { isActive, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Alert not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Alert updated successfully'
        });
    } catch (error) {
        console.error('Error updating alert:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update alert' },
            { status: 500 }
        );
    }
}

// DELETE - Delete alert
export async function DELETE(request) {
    try {
        const body = await request.json();
        const { alertId } = body;

        if (!alertId) {
            return NextResponse.json(
                { success: false, error: 'Missing alert ID' },
                { status: 400 }
            );
        }

        await connectDB();

        const result = await db.collection('alerts').deleteOne({ _id: new ObjectId(alertId) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Alert not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Alert deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting alert:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete alert' },
            { status: 500 }
        );
    }
}
