import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/db';

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has subscription
    const hasSubscription = user.hasPaidAccess &&
      user.accessExpiresAt &&
      new Date(user.accessExpiresAt) > new Date();

    // Get chat usage count
    const chatUsageCount = user.chatUsageCount || 0;
    const freeTriesLimit = 3;
    const remainingTries = Math.max(0, freeTriesLimit - chatUsageCount);

    return NextResponse.json({
      hasSubscription,
      chatUsageCount,
      remainingTries,
      canUseChat: hasSubscription || remainingTries > 0
    });
  } catch (error) {
    console.error('Error checking chat usage:', error);
    return NextResponse.json(
      { error: 'Failed to check chat usage' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const db = await getDatabase();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has subscription
    const hasSubscription = user.hasPaidAccess &&
      user.accessExpiresAt &&
      new Date(user.accessExpiresAt) > new Date();

    // If user has subscription, don't increment count
    if (hasSubscription) {
      return NextResponse.json({
        success: true,
        hasSubscription: true,
        canUseChat: true
      });
    }

    // Increment chat usage count
    const currentCount = user.chatUsageCount || 0;
    const newCount = currentCount + 1;

    await usersCollection.updateOne(
      { email: decoded.email },
      { $set: { chatUsageCount: newCount } }
    );

    const freeTriesLimit = 3;
    const remainingTries = Math.max(0, freeTriesLimit - newCount);
    const canUseChat = remainingTries > 0;

    return NextResponse.json({
      success: true,
      hasSubscription: false,
      chatUsageCount: newCount,
      remainingTries,
      canUseChat
    });
  } catch (error) {
    console.error('Error incrementing chat usage:', error);
    return NextResponse.json(
      { error: 'Failed to increment chat usage' },
      { status: 500 }
    );
  }
}



