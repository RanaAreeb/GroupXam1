import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

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

    return true;
}

export async function POST(request) {
    try {
        const { oldEmail, newEmail } = await request.json();

        if (!oldEmail || !newEmail) {
            return NextResponse.json({
                error: "Old email and new email are required"
            }, { status: 400 });
        }

        // Validate new email format
        if (!isValidEmail(newEmail)) {
            return NextResponse.json({
                error: "Please enter a valid email address"
            }, { status: 400 });
        }

        // Connect to MongoDB
        const db = await getDatabase();
        const users = db.collection("users");

        // Find user by old email
        const user = await users.findOne({ email: oldEmail.toLowerCase() });

        if (!user) {
            return NextResponse.json({
                error: "User not found"
            }, { status: 404 });
        }

        // Check if new email is already taken
        const existingUser = await users.findOne({ email: newEmail.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({
                error: "Email address is already in use"
            }, { status: 400 });
        }

        // Generate new verification code
        const verificationCode = generateVerificationCode();
        const verificationExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Update user with new email and verification code
        const updateResult = await users.updateOne(
            { email: oldEmail.toLowerCase() },
            {
                $set: {
                    email: newEmail.toLowerCase(),
                    verificationCode: verificationCode,
                    verificationExpiry: verificationExpiry,
                    verificationAttempts: 0,
                    updatedAt: new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({
                error: "Failed to update email address"
            }, { status: 500 });
        }

        // Send verification email to new address
        const emailResult = await sendVerificationEmail(
            newEmail,
            verificationCode,
            user.name
        );

        if (!emailResult.success) {
            // If email fails, revert the email change
            await users.updateOne(
                { email: newEmail.toLowerCase() },
                {
                    $set: {
                        email: oldEmail.toLowerCase(),
                        updatedAt: new Date()
                    }
                }
            );

            return NextResponse.json({
                error: "Failed to send verification email to new address. Please try again."
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "Email updated successfully. New verification code sent."
        });

    } catch (error) {
        console.error("Update email error:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}
