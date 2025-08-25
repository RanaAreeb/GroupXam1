import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// Get all reviews (for admin dashboard)
export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db("groupxam");
    
    const reviews = await db
      .collection("reviews")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// Approve or reject a review
export async function PATCH(request: NextRequest) {
  try {
    const { reviewId, action } = await request.json();
    
    if (!reviewId || !action) {
      return NextResponse.json(
        { success: false, error: "Review ID and action are required" },
        { status: 400 }
      );
    }
    
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }
    
    const client = await connectToDatabase();
    const db = client.db("groupxam");
    
    if (action === "approve") {
      const result = await db.collection("reviews").updateOne(
        { _id: new ObjectId(reviewId) },
        { 
          $set: { 
            isApproved: true,
            approvedAt: new Date()
          }
        }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: "Review not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: "Review approved successfully" 
      });
    } else {
      // Delete the review if rejected
      const result = await db.collection("reviews").deleteOne({
        _id: new ObjectId(reviewId)
      });
      
      if (result.deletedCount === 0) {
        return NextResponse.json(
          { success: false, error: "Review not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: "Review rejected and deleted successfully" 
      });
    }
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update review" },
      { status: 500 }
    );
  }
}
