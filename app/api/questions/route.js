import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")
    const limit = Number.parseInt(searchParams.get("limit")) || 10

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db("groupxam")
    const questions = db.collection("questions")

    const query = {}
    if (subject && subject !== "all") {
      query.subject = subject
    }

    const result = await questions.find(query).limit(limit).toArray()

    await client.close()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Questions fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const questionData = await request.json()

    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db("groupxam")
    const questions = db.collection("questions")

    const question = {
      ...questionData,
      createdAt: new Date(),
      difficulty: questionData.difficulty || "medium",
      examType: questionData.examType || "WAEC",
    }

    const result = await questions.insertOne(question)
    await client.close()

    return NextResponse.json(
      { message: "Question created successfully", questionId: result.insertedId },
      { status: 201 },
    )
  } catch (error) {
    console.error("Question creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
