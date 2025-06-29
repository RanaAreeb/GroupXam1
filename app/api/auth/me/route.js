import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ loggedIn: false });
    }
    try {
        const user = jwt.verify(token, JWT_SECRET);
        return NextResponse.json({ loggedIn: true, user });
    } catch {
        return NextResponse.json({ loggedIn: false });
    }
} 