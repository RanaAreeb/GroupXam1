import { NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" }, { status: 200 })
    response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
        path: "/",
    })
    return response
} 