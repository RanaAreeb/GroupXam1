import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function DELETE(request, { params }) {
    try {
        const { discussionId } = await params;

        if (!discussionId || !ObjectId.isValid(discussionId)) {
            return NextResponse.json({ error: "Invalid discussion ID" }, { status: 400 });
        }

        const db = await getDatabase();
        const discussions = db.collection("discussions");

        // Delete the discussion
        const deleteResult = await discussions.deleteOne({
            _id: new ObjectId(discussionId)
        });

        if (deleteResult.deletedCount === 1) {
            return NextResponse.json({ message: "Discussion deleted successfully" });
        } else {
            return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Discussion deletion error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}