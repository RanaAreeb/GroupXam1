import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const requestData = await request.json()
    // Always store email in lowercase
    const email = requestData.email.toLowerCase()

    // Connect to MongoDB
    const db = await getDatabase()
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(requestData.password, 12)

    let user;

    // Handle institution signup
    if (requestData.role === "university") {
      user = {
        role: "university",
        // Basic institution info
        institutionName: requestData.institutionName,
        institutionType: requestData.institutionType,
        subcategory: requestData.subcategory,
        adminName: requestData.adminName,
        name: requestData.adminName, // Use adminName as the display name
        email, // always lowercase
        password: hashedPassword,
        country: requestData.country || "",

        // Contact information
        phone: requestData.phone || "",
        address: requestData.address || "",
        website: requestData.website || "",

        // Additional information
        description: requestData.description || "",
        studentCount: requestData.studentCount ? parseInt(requestData.studentCount) : 0,
        establishedYear: requestData.establishedYear ? parseInt(requestData.establishedYear) : null,

        // Metadata
        createdAt: new Date(),
        updatedAt: new Date(),

        // Stats
        stats: {
          totalExams: 0,
          totalStudents: 0,
          totalSubmissions: 0,
          totalCourses: 0,
        },

        // Settings
        settings: {
          emailNotifications: true,
          examNotifications: true,
          studentNotifications: true,
          theme: "light",
        },

        // Verification
        isVerified: false,
        verificationCode: verificationCode,
        verificationExpiry: verificationExpiry,
        verificationAttempts: 0,
      }
    } else {
      // Handle student signup (default)
      user = {
        role: "student",
        name: requestData.name,
        email, // always lowercase
        password: hashedPassword,
        selectedSubjects: requestData.selectedSubjects || [],
        country: requestData.country || "",

        // Metadata
        createdAt: new Date(),
        updatedAt: new Date(),

        // Stats
        stats: {
          totalQuestions: 0,
          correctAnswers: 0,
          streak: 0,
          level: "Beginner",
          totalQuizzes: 0,
          totalFlashcards: 0,
          studyTime: 0, // in minutes
        },

        // Settings
        settings: {
          emailNotifications: true,
          quizNotifications: true,
          progressNotifications: true,
          theme: "light",
          studyReminders: true,
        },

        // Progress tracking
        progress: {
          subjects: {},
          lastActive: new Date(),
          currentStreak: 0,
          longestStreak: 0,
        },

        // Verification
        isVerified: false,
        verificationCode: verificationCode,
        verificationExpiry: verificationExpiry,
        verificationAttempts: 0,
      }
    }

    // Save user to database
    const result = await users.insertOne(user)

    // Create activity for new signup
    try {
      const activityMessage = requestData.role === "university"
        ? `${requestData.adminName} joined as an institution!`
        : `${requestData.name} just signed up for groupXam!`;

      // Directly insert activity into database
      const activities = db.collection("activities");
      await activities.insertOne({
        type: 'signup',
        message: activityMessage,
        userId: result.insertedId,
        userName: requestData.role === "university" ? requestData.adminName : requestData.name,
        createdAt: new Date(),
      });

      console.log('Activity created for signup:', activityMessage);
    } catch (activityError) {
      console.error('Failed to create activity:', activityError);
      // Don't fail the signup if activity creation fails
    }

    // Update user stats (this will be reflected in the homepage counter)
    try {
      const stats = db.collection("stats");
      await stats.updateOne(
        { type: "user_count" },
        {
          $inc: { totalUsers: 1 },
          $set: { lastUpdated: new Date() }
        },
        { upsert: true }
      );
    } catch (statsError) {
      console.error('Failed to update user stats:', statsError);
      // Don't fail the signup if stats update fails
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      verificationCode,
      requestData.role === "university" ? requestData.adminName : requestData.name
    );

    if (!emailResult.success) {
      // If email fails, delete the user and return error
      await users.deleteOne({ _id: result.insertedId });
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json({
        error: "Failed to send verification email. Please try again."
      }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: `${requestData.role === "university" ? "Institution" : "Student"} account created successfully. Please check your email for verification code.`,
        userId: result.insertedId,
        userType: requestData.role === "university" ? "institution" : "student",
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
