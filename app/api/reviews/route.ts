import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();
    const reviews = await db
      .collection("reviews")
      .find({ isApproved: true }) // Only return approved reviews
      .sort({ createdAt: -1 })
      .toArray();
    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch reviews." }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, quote, details, rating } = await req.json();
    if (!name || !quote || !details || !rating) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }
    const db = await getDatabase();
    const review = {
      name,
      initial: name.charAt(0).toUpperCase(),
      quote,
      details,
      rating: Math.max(1, Math.min(5, Number(rating))),
      isApproved: false, // Reviews start as unapproved
      createdAt: new Date(),
    };
    await db.collection("reviews").insertOne(review);
    return new Response(JSON.stringify({ success: true, message: "Review submitted successfully! It will be reviewed by our team before being published." }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to submit review." }), {
      status: 500,
    });
  }
}
