import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam";

// Expanded subjects and subcategories
export const SUBJECTS = [
    { name: "Physics" },
    { name: "Chemistry" },
    { name: "Organic Chemistry", parent: "Chemistry" },
    { name: "Microbiology" },
    { name: "Anatomy" },
    { name: "Physiology" },
    { name: "Biology" },
    { name: "Biochemistry" },
    { name: "Pharmacology" },
    { name: "Ecology" },
    { name: "Psychology" },
    { name: "Economic" },
    { name: "Micro economics", parent: "Economic" },
    { name: "Macro economics", parent: "Economic" },
    { name: "Accounting" },
    { name: "Finance" },
    { name: "Political science" },
];

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const subject = searchParams.get("subject");
        const search = searchParams.get("search") || "";
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db("groupxam");
        const discussions = db.collection("discussions");

        const query = {};
        if (subject && subject !== "All") {
            query.subject = subject;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
            ];
        }
        const result = await discussions
            .find(query)
            .sort({ createdAt: -1 })
            .toArray();
        await client.close();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Discussions fetch error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db("groupxam");
        const discussions = db.collection("discussions");
        const discussion = {
            title: data.title,
            subject: data.subject,
            author: data.author || "Anonymous",
            authorInitials: data.authorInitials || "AN",
            content: data.content,
            tags: data.tags || [],
            replies: [],
            likes: 0,
            createdAt: new Date(),
        };
        const result = await discussions.insertOne(discussion);
        await client.close();
        return NextResponse.json({ message: "Discussion created", id: result.insertedId }, { status: 201 });
    } catch (error) {
        console.error("Discussion creation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request) {
    // Add a reply to a discussion
    try {
        const { discussionId, reply } = await request.json();
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db("groupxam");
        const discussions = db.collection("discussions");
        const updateResult = await discussions.updateOne(
            { _id: new ObjectId(discussionId) },
            { $push: { replies: { ...reply, createdAt: new Date() } } }
        );
        await client.close();
        if (updateResult.modifiedCount === 1) {
            return NextResponse.json({ message: "Reply added" });
        } else {
            return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Reply error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 