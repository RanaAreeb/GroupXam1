import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ discussionId: string; replyId: string }> }
) {
  try {
    const { discussionId, replyId } = await params;

    if (!discussionId || !replyId) {
      return NextResponse.json(
        { success: false, error: "Discussion ID and Reply ID are required" },
        { status: 400 }
      );
    }

    const client = await connectToDatabase();
    const db = client.db("groupxam");

    // First, find the discussion to get the current replies
    const discussion = await db.collection("discussions").findOne({
      _id: new ObjectId(discussionId),
    });

    if (!discussion) {
      return NextResponse.json(
        { success: false, error: "Discussion not found" },
        { status: 404 }
      );
    }

    // Function to recursively remove a reply and all its nested replies
    function removeReplyFromTree(replies: any[], targetReplyId: string): any[] {
      return replies.filter(reply => {
        if (reply._id === targetReplyId) {
          return false; // Remove this reply
        }
        if (reply.replies && reply.replies.length > 0) {
          reply.replies = removeReplyFromTree(reply.replies, targetReplyId);
        }
        return true;
      });
    }

    // Remove the reply from the replies array
    const updatedReplies = removeReplyFromTree(discussion.replies || [], replyId);

    // Update the discussion with the new replies array
    const updateResult = await db.collection("discussions").updateOne(
      { _id: new ObjectId(discussionId) },
      { $set: { replies: updatedReplies } }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Discussion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Reply deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting reply:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete reply" },
      { status: 500 }
    );
  }
}
