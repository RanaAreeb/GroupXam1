import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET() {
    try {
        console.log('Fetching users from database...');
        const db = await getDatabase();
        const users = await db.collection('users').find({}, {
            projection: {
                _id: 1,
                email: 1,
                name: 1,
                createdAt: 1,
                lastLogin: 1,
                access: 1
            }
        }).sort({ createdAt: -1 }).toArray();

        console.log(`Found ${users.length} users in database`);

        return NextResponse.json({
            success: true,
            users: users.map(user => ({
                ...user,
                _id: user._id.toString()
            }))
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch users', details: error.message },
            { status: 500 }
        );
    }
}
