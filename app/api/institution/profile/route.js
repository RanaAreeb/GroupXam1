import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// GET - Fetch institution profile
export async function GET(request) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "university") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const db = await getDatabase();
        const users = db.collection("users");

        const user = await users.findOne({ email: decoded.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return institution profile data (excluding sensitive info)
        const profileData = {
            institutionName: user.institutionName,
            institutionType: user.institutionType,
            subcategory: user.subcategory,
            adminName: user.adminName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            website: user.website,
            description: user.description,
            studentCount: user.studentCount,
            establishedYear: user.establishedYear,
            stats: user.stats,
            settings: user.settings,
            status: user.status,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        };

        return NextResponse.json({ profile: profileData });
    } catch (error) {
        console.error("Error fetching institution profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// PUT - Update institution profile
export async function PUT(request) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== "university") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const body = await request.json();
        const db = await getDatabase();
        const users = db.collection("users");

        // Fields that can be updated
        const updateData = {
            updatedAt: new Date(),
        };

        // Basic institution info
        if (body.institutionName) updateData.institutionName = body.institutionName;
        if (body.institutionType) updateData.institutionType = body.institutionType;
        if (body.subcategory) updateData.subcategory = body.subcategory;
        if (body.adminName) updateData.adminName = body.adminName;

        // Contact information
        if (body.phone !== undefined) updateData.phone = body.phone;
        if (body.address !== undefined) updateData.address = body.address;
        if (body.website !== undefined) updateData.website = body.website;

        // Additional information
        if (body.description !== undefined) updateData.description = body.description;
        if (body.studentCount !== undefined) updateData.studentCount = parseInt(body.studentCount) || 0;
        if (body.establishedYear !== undefined) updateData.establishedYear = parseInt(body.establishedYear) || null;

        // Settings
        if (body.settings) {
            updateData.settings = { ...body.settings };
        }

        const result = await users.updateOne(
            { email: decoded.email },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Error updating institution profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 