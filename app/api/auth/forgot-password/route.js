import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { email, newPassword } = await request.json();

        // Validate input
        if (!email || !newPassword) {
            return NextResponse.json(
                { error: "Email and new password are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const usersCollection = db.collection("users");

        // Check if user exists
        const user = await usersCollection.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { error: "No account found with this email address" },
                { status: 404 }
            );
        }

        // Hash the new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        const result = await usersCollection.updateOne(
            { email: email.toLowerCase() },
            {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date(),
                },
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json(
                { error: "Failed to update password. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Internal server error. Please try again." },
            { status: 500 }
        );
    }
} 