import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email"

// Enhanced email validation function
function isValidEmail(email) {
  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Check for valid TLDs (common ones)
  const validTLDs = [
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'io', 'co', 'uk', 'us', 'ca', 'au', 'de', 'fr', 'it', 'es', 'nl', 'be', 'ch', 'at', 'se', 'no', 'dk', 'fi', 'pl', 'cz', 'hu', 'ro', 'bg', 'hr', 'si', 'sk', 'lt', 'lv', 'ee', 'ie', 'pt', 'gr', 'cy', 'mt', 'lu', 'is', 'in', 'pk', 'bd', 'lk', 'np', 'bt', 'mv', 'af', 'ir', 'iq', 'sa', 'ae', 'qa', 'kw', 'bh', 'om', 'ye', 'jo', 'lb', 'sy', 'ps', 'il', 'tr', 'ge', 'am', 'az', 'cn', 'jp', 'kr', 'tw', 'hk', 'mo', 'mn', 'kp', 'vn', 'th', 'my', 'sg', 'id', 'ph', 'mm', 'la', 'kh', 'bn', 'tl', 'au', 'nz', 'fj', 'pg', 'sb', 'vu', 'nc', 'pf', 'br', 'ar', 'cl', 'pe', 'co', 've', 'ec', 'bo', 'py', 'uy', 'gy', 'sr', 'fk', 'mx', 'gt', 'bz', 'sv', 'hn', 'ni', 'cr', 'pa', 'cu', 'jm', 'ht', 'do', 'pr', 'tt', 'bb', 'gd', 'lc', 'vc', 'ag', 'kn', 'dm', 'bs', 'ru', 'ua', 'by', 'md', 'kz', 'uz', 'kg', 'tj', 'tm', 'ng', 'gh', 'ke', 'za', 'eg', 'et', 'tz', 'ug', 'dz', 'ma', 'tn', 'ly', 'sd', 'ss', 'cm', 'ci', 'sn', 'ml', 'bf', 'ne', 'td', 'cf', 'cg', 'cd', 'ao', 'zm', 'zw', 'bw', 'na', 'mw', 'mz', 'sz', 'ls', 'mg', 'mu', 'sc', 'dj', 'so', 'er', 'rw', 'bi', 'gw', 'gn', 'sl', 'lr', 'tg', 'bj', 'cv', 'gm', 'mr'
  ];

  const domain = email.split('@')[1];
  const tld = domain.split('.').pop()?.toLowerCase();

  if (!validTLDs.includes(tld || '')) {
    return false;
  }

  // Additional checks for suspicious patterns
  const [localPart, domainPart] = email.split('@');

  // Check for repeated characters (like many 'b's)
  const repeatedCharRegex = /(.)\1{10,}/; // More than 10 repeated characters
  if (repeatedCharRegex.test(localPart) || repeatedCharRegex.test(domainPart)) {
    return false;
  }

  // Check for extremely long local part (Gmail limit is 64 characters)
  if (localPart.length > 64) {
    return false;
  }

  // Check for extremely long domain (255 characters total domain limit)
  if (domainPart.length > 255) {
    return false;
  }

  // Check for suspicious patterns like many numbers or special characters
  const suspiciousPatterns = [
    /\d{20,}/, // 20+ consecutive digits
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{10,}/, // 10+ consecutive special chars
    /[a-zA-Z]{50,}/, // 50+ consecutive letters
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) {
      return false;
    }
  }

  // Additional check for common invalid patterns
  const invalidPatterns = [
    /^\d+@/, // Email starting with only numbers
    /@\d+\./, // Domain starting with only numbers
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // This should be valid, but let's check for specific issues
  ];

  // Check for emails that look like they might be invalid
  if (localPart.length < 2 || domainPart.length < 4) {
    return false;
  }

  // Check for emails with too many numbers in local part (like 12rana00493)
  const numbersInLocal = (localPart.match(/\d/g) || []).length;
  if (numbersInLocal > localPart.length * 0.6) { // If more than 60% are numbers
    return false;
  }

  // Check for emails that start with numbers followed by letters (like 12rana00493)
  if (/^\d+[a-zA-Z]/.test(localPart) && numbersInLocal > 3) {
    return false;
  }

  return true;
}

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const requestData = await request.json()
    // Always store email in lowercase
    const email = requestData.email.toLowerCase()

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({
        error: "Please enter a valid email address"
      }, { status: 400 })
    }

    // Validate required fields
    if (!requestData.name || requestData.name.trim().length < 2) {
      return NextResponse.json({
        error: "Please enter a valid name (at least 2 characters)"
      }, { status: 400 })
    }

    if (!requestData.password || requestData.password.length < 6) {
      return NextResponse.json({
        error: "Password must be at least 6 characters long"
      }, { status: 400 })
    }

    if (!requestData.country || requestData.country.trim() === "") {
      return NextResponse.json({
        error: "Please select your country"
      }, { status: 400 })
    }

    // Additional validation for institution signups
    if (requestData.role === "university") {
      if (!requestData.institutionName || requestData.institutionName.trim().length < 2) {
        return NextResponse.json({
          error: "Please enter a valid institution name (at least 2 characters)"
        }, { status: 400 })
      }

      if (!requestData.institutionType) {
        return NextResponse.json({
          error: "Please select your institution type"
        }, { status: 400 })
      }

      if (!requestData.subcategory) {
        return NextResponse.json({
          error: "Please select your institution subcategory"
        }, { status: 400 })
      }

      if (!requestData.adminName || requestData.adminName.trim().length < 2) {
        return NextResponse.json({
          error: "Please enter a valid admin name (at least 2 characters)"
        }, { status: 400 })
      }
    }

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
        country: requestData.country,

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
        country: requestData.country,

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

      // Check if it's a delivery failure
      if (emailResult.error && (
        emailResult.error.includes("550") ||
        emailResult.error.includes("5.1.1") ||
        emailResult.error.includes("NoSuchUser") ||
        emailResult.error.includes("Address not found") ||
        emailResult.error.includes("does not exist")
      )) {
        return NextResponse.json({
          error: "Email delivery failed. The email address may be invalid or doesn't exist. Please check and correct your email address.",
          emailError: true
        }, { status: 400 });
      }

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
