import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"

export async function POST(request) {
  try {
    const { name, email, password, selectedSubjects } = await request.json()

    // Connect to MongoDB
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db("groupxam")
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      await client.close()
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = {
      name,
      email,
      password: hashedPassword,
      selectedSubjects,
      createdAt: new Date(),
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        streak: 0,
        level: "Beginner",
      },
    }

    const result = await users.insertOne(user)
    await client.close()

    return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
