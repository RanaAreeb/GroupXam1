import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getDatabase } from "@/lib/db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request) {
  const startTime = Date.now()

  try {
    const { email, password } = await request.json()

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Get database
    const db = await getDatabase()
    const users = db.collection("users")

    // Find user with projection to only get needed fields
    const user = await users.findOne(
      { email: email.toLowerCase() },
      { projection: { _id: 1, email: 1, password: 1, name: 1 } }
    )

    if (!user) {
      console.log(`Login failed: User not found for email ${email}`)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      console.log(`Login failed: Invalid password for email ${email}`)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate JWT token with name
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    const responseTime = Date.now() - startTime
    console.log(`Login successful for ${email} in ${responseTime}ms`)

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        responseTime: `${responseTime}ms`
      },
      { status: 200 }
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
    const responseTime = Date.now() - startTime
    console.error(`Login error after ${responseTime}ms:`, error)

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
