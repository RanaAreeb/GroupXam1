import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, verificationCode } = await request.json();

        if (!email || !verificationCode) {
            return NextResponse.json({
                error: "Email and verification code are required"
            }, { status: 400 });
        }

        // Connect to MongoDB
        const db = await getDatabase();
        const users = db.collection("users");

        // Find user by email
        const user = await users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        // Check if already verified
        if (user.isVerified) {
            return NextResponse.json({
                error: "Email is already verified"
            }, { status: 400 });
        }

        // Check if verification code is expired
        if (new Date() > user.verificationExpiry) {
            return NextResponse.json({
                error: "Verification code has expired. Please request a new one."
            }, { status: 400 });
        }

        // Check verification attempts
        if (user.verificationAttempts >= 5) {
            return NextResponse.json({
                error: "Too many verification attempts. Please request a new code."
            }, { status: 400 });
        }

        // Verify the code
        if (user.verificationCode !== verificationCode) {
            // Increment verification attempts
            await users.updateOne(
                { email: email.toLowerCase() },
                { $inc: { verificationAttempts: 1 } }
            );

            return NextResponse.json({
                error: "Invalid verification code"
            }, { status: 400 });
        }

        // Mark user as verified
        const updateResult = await users.updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    isVerified: true,
                    status: "active",
                    updatedAt: new Date()
                },
                $unset: {
                    verificationCode: "",
                    verificationExpiry: "",
                    verificationAttempts: ""
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({
                error: "Failed to verify account"
            }, { status: 500 });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                email: user.email,
                role: user.role,
                name: user.name,
                isVerified: true
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.name, user.role);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the verification if welcome email fails
        }

        // Set HTTP-only cookie
        const response = NextResponse.json({
            success: true,
            message: "Email verified successfully! Welcome to groupXam!",
            user: {
                email: user.email,
                role: user.role,
                name: user.name,
                isVerified: true
            }
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return response;

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}

// Resend verification code
export async function PUT(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({
                error: "Email is required"
            }, { status: 400 });
        }

        // Connect to MongoDB
        const db = await getDatabase();
        const users = db.collection("users");

        // Find user by email
        const user = await users.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        // Check if already verified
        if (user.isVerified) {
            return NextResponse.json({
                error: "Email is already verified"
            }, { status: 400 });
        }

        // Generate new verification code
        const { generateVerificationCode, sendVerificationEmail } = await import("@/lib/email");
        const newVerificationCode = generateVerificationCode();
        const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with new verification code
        await users.updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    verificationCode: newVerificationCode,
                    verificationExpiry: verificationExpiry,
                    verificationAttempts: 0,
                    updatedAt: new Date()
                }
            }
        );

        // Send new verification email
        const emailResult = await sendVerificationEmail(
            email,
            newVerificationCode,
            user.name
        );

        if (!emailResult.success) {
            console.error('Email sending failed:', emailResult.error);
            return NextResponse.json({
                error: "Failed to send verification email. Please try again."
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "New verification code sent to your email"
        });

    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
} 