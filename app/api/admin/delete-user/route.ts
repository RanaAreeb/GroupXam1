import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(request: NextRequest) {
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

    // Delete user from users collection
    const deleteResult = await db.collection("users").deleteOne({
      _id: new ObjectId(userId),
      email: userEmail,
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Also delete related data (sessions, activities, etc.)
    await db.collection("sessions").deleteMany({ userEmail });
    await db.collection("activities").deleteMany({ userEmail });
    await db.collection("userSessions").deleteMany({ userEmail });

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
