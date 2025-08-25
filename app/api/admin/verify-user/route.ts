import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail } = await request.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { success: false, error: "User ID and email are required" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("groupxam");

    // Update user verification status
    const updateResult = await db.collection("users").updateOne(
      {
        _id: new ObjectId(userId),
        email: userEmail,
      },
      {
        $set: {
          isVerified: true,
          verifiedAt: new Date(),
          status: "active",
          verificationAttempts: 0,
        },
        $unset: {
          verificationCode: "",
          verificationExpiry: "",
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Log the verification activity
    await db.collection("activities").insertOne({
      message: `User ${userEmail} manually verified by admin`,
      timestamp: new Date().toISOString(),
      userEmail: userEmail,
      type: "admin_verification",
    });

    return NextResponse.json(
      { success: true, message: "User verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify user" },
      { status: 500 }
    );
  }
}
