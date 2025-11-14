import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { getDatabase } from '@/lib/db';

export const dynamic = "force-dynamic";

// Track calculator usage
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { calculatorType, action } = await req.json();

    const db = await getDatabase();
    const calculatorUsageCollection = db.collection('calculatorUsage');
    
    // Get user info
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Record calculator usage
    await calculatorUsageCollection.insertOne({
      userId: user._id,
      userEmail: decoded.email,
      userName: user.name || user.email,
      calculatorType: calculatorType || 'general',
      action: action || 'access',
      timestamp: new Date(),
      createdAt: new Date()
    });

    // Update user's calculator usage stats
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $inc: { calculatorUsageCount: 1 },
        $set: { lastCalculatorUsage: new Date() }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Calculator usage tracking error:", error);
    return NextResponse.json(
      { error: "An error occurred while tracking calculator usage." },
      { status: 500 }
    );
  }
}

// Get calculator analytics
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: decoded.email });

    if (!user) {
      console.error("User not found for calculator analytics:", decoded.email);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check admin access - match the logic from admin dashboard
    // Allow both 'admin' role, isAdmin flag, or specific admin emails
    const adminEmails = ["ranaareeb1029@gmail.com", "cliftonmanneh6@gmail.com", "jtdavis@konductcoachlearning.com"];
    const isAdmin = 
      user.role === 'admin' || 
      user.isAdmin === true || 
      adminEmails.includes(decoded.email);
    
    if (!isAdmin) {
      console.error("Unauthorized access attempt to calculator analytics:", {
        email: decoded.email,
        role: user.role,
        isAdmin: user.isAdmin
      });
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const calculatorUsageCollection = db.collection('calculatorUsage');
    
    // Get date range from query params
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: any = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    // Total usage
    const totalUsage = await calculatorUsageCollection.countDocuments(query);

    // Unique users
    const uniqueUsers = await calculatorUsageCollection.distinct('userId', query);

    // Usage by calculator type
    const usageByType = await calculatorUsageCollection.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$calculatorType',
          count: { $sum: 1 },
          users: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          calculatorType: '$_id',
          count: 1,
          uniqueUsers: { $size: '$users' }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    // Usage by date (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const usageByDate = await calculatorUsageCollection.aggregate([
      {
        $match: {
          ...query,
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]).toArray();

    // Most active users
    const mostActiveUsers = await calculatorUsageCollection.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$userId',
          userEmail: { $first: '$userEmail' },
          userName: { $first: '$userName' },
          count: { $sum: 1 },
          lastUsed: { $max: '$timestamp' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    // Recent usage
    const recentUsage = await calculatorUsageCollection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({
      success: true,
      analytics: {
        totalUsage: totalUsage || 0,
        uniqueUsers: uniqueUsers?.length || 0,
        usageByType: usageByType || [],
        usageByDate: usageByDate || [],
        mostActiveUsers: mostActiveUsers || [],
        recentUsage: recentUsage || []
      }
    });
  } catch (error: any) {
    console.error("Calculator analytics error:", error);
    console.error("Error details:", error.message, error.stack);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || "An error occurred while fetching calculator analytics." 
      },
      { status: 500 }
    );
  }
}


