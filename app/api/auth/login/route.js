import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam"
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Connect to MongoDB
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db("groupxam")
    const users = db.collection("users")

    // Find user
    const user = await users.findOne({ email })
    if (!user) {
      await client.close()
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      await client.close()
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    await client.close()

    const response = NextResponse.json(
      { message: "Login successful", user: { id: user._id, name: user.name, email: user.email } },
      { status: 200 },
    )

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
