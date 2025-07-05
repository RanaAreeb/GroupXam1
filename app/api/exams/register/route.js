import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/groupxam";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

function getUserFromRequest(request) {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch {
        return null;
    }
}

export async function POST(request) {
    const user = getUserFromRequest(request);
    const body = await request.json();
    const { examId, regNo, name, email, phone, address, dateOfBirth, gender, parentName, parentPhone } = body;

    if (!examId || !name) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("groupxam");

    try {
        // Check if exam exists
        const exam = await db.collection("exams").findOne({ _id: new ObjectId(examId) });
        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        // Check registration deadline
        if (exam.registrationDeadline) {
            const regDeadlineDateTime = exam.registrationTime
                ? new Date(`${exam.registrationDeadline}T${exam.registrationTime}`)
                : new Date(`${exam.registrationDeadline}T23:59`);
            if (regDeadlineDateTime < new Date()) {
                return NextResponse.json({ error: "Registration deadline has passed" }, { status: 400 });
            }
        }

        let studentEmail, studentName, registrationData;

        if (user && user.role === "student") {
            // Authenticated student registration
            studentEmail = user.email;
            studentName = name;

            // Check if already registered
            const existing = await db.collection("submissions").findOne({
                examId,
                studentEmail: user.email
            });
            if (existing) {
                return NextResponse.json({ error: "You are already registered for this exam." }, { status: 409 });
            }

            registrationData = {
                examId,
                studentEmail,
                studentName,
                regNo: regNo || "",
                registeredAt: new Date(),
                status: "registered",
                registrationType: "authenticated"
            };
        } else {
            // Guest registration
            if (!email || !phone || !address || !dateOfBirth || !gender || !parentName || !parentPhone) {
                return NextResponse.json({
                    error: "Guest registration requires: email, phone, address, dateOfBirth, gender, parentName, parentPhone"
                }, { status: 400 });
            }

            studentEmail = email.toLowerCase();
            studentName = name;

            // Check if already registered with this email
            const existing = await db.collection("submissions").findOne({
                examId,
                studentEmail
            });
            if (existing) {
                return NextResponse.json({ error: "This email is already registered for this exam." }, { status: 409 });
            }

            registrationData = {
                examId,
                studentEmail,
                studentName,
                regNo: regNo || "",
                phone,
                address,
                dateOfBirth,
                gender,
                parentName,
                parentPhone,
                registeredAt: new Date(),
                status: "registered",
                registrationType: "guest"
            };
        }

        // Add registration
        await db.collection("submissions").insertOne(registrationData);

        return NextResponse.json({
            message: "Registered successfully",
            registrationType: user ? "authenticated" : "guest"
        });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    } finally {
        await client.close();
    }
} 