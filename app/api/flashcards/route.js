import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// GET - Fetch user's flashcard sets
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const subject = searchParams.get("subject");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const db = await getDatabase();
        const collection = db.collection("userFlashcards");

        let query = { userId };
        if (subject) {
            query.subject = subject;
        }

        const flashcardSets = await collection.find(query).toArray();

        return NextResponse.json({ flashcardSets });
    } catch (error) {
        console.error("Error fetching flashcard sets:", error);
        return NextResponse.json({ error: "Failed to fetch flashcard sets" }, { status: 500 });
    }
}

// POST - Create a new flashcard set
export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, title, subject, cards, difficulty = "Custom" } = body;

        if (!userId || !title || !subject || !cards || !Array.isArray(cards)) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (cards.length === 0) {
            return NextResponse.json({ error: "At least one card is required" }, { status: 400 });
        }

        const db = await getDatabase();
        const collection = db.collection("userFlashcards");

        const newFlashcardSet = {
            id: `${subject.toLowerCase()}-user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            userId,
            title,
            subject,
            cardCount: cards.length,
            difficulty,
            cards,
            progress: 0,
            isUserCreated: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(newFlashcardSet);

        return NextResponse.json({
            success: true,
            flashcardSet: { ...newFlashcardSet, _id: result.insertedId }
        });
    } catch (error) {
        console.error("Error creating flashcard set:", error);
        return NextResponse.json({ error: "Failed to create flashcard set" }, { status: 500 });
    }
}

// PUT - Update a flashcard set
export async function PUT(request) {
    try {
        const body = await request.json();
        const { id, userId, title, cards, difficulty } = body;

        if (!id || !userId) {
            return NextResponse.json({ error: "Flashcard set ID and user ID are required" }, { status: 400 });
        }

        const db = await getDatabase();
        const collection = db.collection("userFlashcards");

        const updateData = {
            updatedAt: new Date(),
        };

        if (title) updateData.title = title;
        if (cards && Array.isArray(cards)) {
            updateData.cards = cards;
            updateData.cardCount = cards.length;
        }
        if (difficulty) updateData.difficulty = difficulty;

        const result = await collection.updateOne(
            { id, userId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating flashcard set:", error);
        return NextResponse.json({ error: "Failed to update flashcard set" }, { status: 500 });
    }
}

// DELETE - Delete a flashcard set
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const userId = searchParams.get("userId");

        if (!id || !userId) {
            return NextResponse.json({ error: "Flashcard set ID and user ID are required" }, { status: 400 });
        }

        const db = await getDatabase();
        const collection = db.collection("userFlashcards");

        const result = await collection.deleteOne({ id, userId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Flashcard set not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting flashcard set:", error);
        return NextResponse.json({ error: "Failed to delete flashcard set" }, { status: 500 });
    }
} 