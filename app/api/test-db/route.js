import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Testing database connection...")
    console.log("MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not set")

    const db = await getDatabase()
    await db.admin().ping()

    // Get collection counts
    const questionsCount = await db.collection("questions").countDocuments()
    const usersCount = await db.collection("users").countDocuments()
    const flashcardsCount = await db.collection("flashcards").countDocuments()

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      collections: {
        questions: questionsCount,
        users: usersCount,
        flashcards: flashcardsCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
