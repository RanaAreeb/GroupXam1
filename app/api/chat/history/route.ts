import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

const FREE_HISTORY_RETENTION_DAYS = 7;
const PREMIUM_HISTORY_RETENTION_DAYS = 30;

function isUserSubscribed(user: any): boolean {
  if (!user) return false;
  const { hasPaidAccess, accessExpiresAt } = user;
  if (!hasPaidAccess || !accessExpiresAt) {
    return false;
  }

  return new Date(accessExpiresAt) > new Date();
}

async function authenticate(request: NextRequest): Promise<string> {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    throw NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded || typeof decoded !== "object" || typeof decoded.email !== "string") {
      throw NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return decoded.email as string;
  } catch {
    throw NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = await authenticate(request);
    const db = await getDatabase();

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne(
      { email },
      { projection: { hasPaidAccess: 1, accessExpiresAt: 1 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasSubscription = isUserSubscribed(user);
    const retentionDays = hasSubscription ? PREMIUM_HISTORY_RETENTION_DAYS : FREE_HISTORY_RETENTION_DAYS;
    const now = new Date();

    const chatMessagesCollection = db.collection("chatMessages");

    await chatMessagesCollection.deleteMany({
      email,
      retentionExpiresAt: { $lt: now },
    });

    const cutoff = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000);

    const historyDocs = await chatMessagesCollection
      .find(
        {
          email,
          createdAt: { $gte: cutoff },
        },
        {
          projection: {
            _id: 0,
            email: 0,
            hasSubscriptionSnapshot: 0,
            retentionExpiresAt: 0,
            usage: 0,
          },
        }
      )
      .sort({ createdAt: 1 })
      .limit(hasSubscription ? 600 : 300)
      .toArray();

    return NextResponse.json({
      success: true,
      hasSubscription,
      retentionDays,
      history: historyDocs,
    });
  } catch (err: any) {
    if (err instanceof NextResponse) {
      return err;
    }

    console.error("Chat history GET error:", err);
    return NextResponse.json({ error: "Failed to load chat history" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const email = await authenticate(request);
    const db = await getDatabase();
    const chatMessagesCollection = db.collection("chatMessages");

    await chatMessagesCollection.deleteMany({ email });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof NextResponse) {
      return err;
    }

    console.error("Chat history DELETE error:", err);
    return NextResponse.json({ error: "Failed to clear chat history" }, { status: 500 });
  }
}

