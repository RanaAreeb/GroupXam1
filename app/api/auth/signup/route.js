import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"

export async function POST(request) {
  try {
    const requestData = await request.json()
    // Always store email in lowercase
    const email = requestData.email.toLowerCase()

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
    const hashedPassword = await bcrypt.hash(requestData.password, 12)

    let user;

    // Handle university signup
    if (requestData.role === "university") {
      user = {
        role: "university",
        universityName: requestData.universityName,
        adminName: requestData.adminName,
        name: requestData.adminName, // Use adminName as the display name
        email, // always lowercase
        password: hashedPassword,
        createdAt: new Date(),
        stats: {
          totalExams: 0,
          totalStudents: 0,
          totalSubmissions: 0,
        },
      }
    } else {
      // Handle student signup (default)
      user = {
        role: "student",
        name: requestData.name,
        email, // always lowercase
        password: hashedPassword,
        selectedSubjects: requestData.selectedSubjects || [],
        createdAt: new Date(),
        stats: {
          totalQuestions: 0,
          correctAnswers: 0,
          streak: 0,
          level: "Beginner",
        },
      }
    }

    const result = await users.insertOne(user)
    await client.close()

    return NextResponse.json(
      {
        message: `${requestData.role === "university" ? "University" : "Student"} account created successfully`,
        userId: result.insertedId
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
