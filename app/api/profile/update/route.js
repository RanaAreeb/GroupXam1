import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function PUT(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const data = await request.json();

        const client = await clientPromise;
        const db = client.db("groupxam");
        const usersCollection = db.collection("users");

        // Validate and sanitize data
        const updateData = {
            name: data.name?.trim(),
            phone: data.phone?.trim(),
            country: data.country?.trim(),
            city: data.city?.trim(),
            school: data.school?.trim(),
            grade: data.grade?.trim(),
            bio: data.bio?.trim(),
            updatedAt: new Date()
        };

        // Remove empty fields
        Object.keys(updateData).forEach(key => {
            if (!updateData[key] && updateData[key] !== false) {
                delete updateData[key];
            }
        });

        // Update user profile
        const result = await usersCollection.updateOne(
            { email: decoded.email },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return Response.json({ error: "Failed to update profile" }, { status: 500 });
    }
}

