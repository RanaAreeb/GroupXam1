import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(request) {
    try {
        // Get token from cookies
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return Response.json({ loggedIn: false, user: null });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user details from database
        const db = await getDatabase();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne(
            { email: decoded.email },
            { projection: { password: 0 } } // Exclude password
        );

        if (!user) {
            return Response.json({ loggedIn: false, user: null });
        }

        return Response.json({
            loggedIn: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                universityName: user.universityName,
                country: user.country,
                profilePicture: user.profilePicture,
                phone: user.phone,
                city: user.city,
                school: user.school,
                grade: user.grade,
                bio: user.bio,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt,
                access: user.access,
                packageType: user.packageType,
                accessExpiresAt: user.accessExpiresAt,
                hasPaidAccess: user.hasPaidAccess,
                lastPaymentDate: user.lastPaymentDate
            }
        });

    } catch (error) {
        console.error("Auth check error:", error);
        return Response.json({ loggedIn: false, user: null });
    }
}