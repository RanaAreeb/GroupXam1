import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pdfParse from "pdf-parse";
import { extractRawText } from "mammoth";
import { getDatabase } from "@/lib/db";
import { isMaintenanceActive } from "@/lib/maintenance";
import { MAINTENANCE_SECTIONS } from "@/constants/maintenance";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

interface IncomingDocument {
  name?: string;
  type?: string;
  dataUrl: string;
  size?: number;
}

const DOCUMENT_CHARACTER_LIMIT = 15000;
const FREE_HISTORY_RETENTION_DAYS = 7;
const PREMIUM_HISTORY_RETENTION_DAYS = 30;

function truncateDocumentText(text: string): string {
  if (text.length <= DOCUMENT_CHARACTER_LIMIT) {
    return text;
  }

  return `${text.slice(
    0,
    DOCUMENT_CHARACTER_LIMIT
  )}\n\n[Content truncated after ${DOCUMENT_CHARACTER_LIMIT.toLocaleString()} characters]`;
}

async function extractTextFromDocument(document: IncomingDocument): Promise<string | null> {
  const base64Match = document.dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!base64Match) {
    return null;
  }

  const [, mimeFromDataUrl, base64Data] = base64Match;
  const buffer = Buffer.from(base64Data, "base64");
  const mimeType = (document.type || mimeFromDataUrl || "").toLowerCase();

  try {
    if (mimeType.includes("pdf")) {
      const parsed = await pdfParse(buffer);
      return parsed?.text?.trim() || null;
    }

    if (mimeType.includes("wordprocessingml.document") || mimeType.includes("msword")) {
      const result = await extractRawText({ buffer });
      return result?.value?.trim() || null;
    }

    if (
      mimeType.startsWith("text/") ||
      mimeType.includes("json") ||
      mimeType.includes("csv")
    ) {
      return buffer.toString("utf-8");
    }
  } catch (error) {
    console.error(`Failed to extract text from document "${document.name || "Unnamed"}":`, error);
    return null;
  }

  return null;
}

function isUserSubscribed(user: any): boolean {
  if (!user) return false;
  const { hasPaidAccess, accessExpiresAt } = user;
  if (!hasPaidAccess || !accessExpiresAt) return false;
  return new Date(accessExpiresAt) > new Date();
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check usage before processing
    const db = await getDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hasSubscription = isUserSubscribed(user);
    const retentionDays = hasSubscription ? PREMIUM_HISTORY_RETENTION_DAYS : FREE_HISTORY_RETENTION_DAYS;

    const siteMaintenance = await isMaintenanceActive("whole_site");
    if (siteMaintenance) {
      const siteConfig = MAINTENANCE_SECTIONS.find((section) => section.id === "whole_site");
      return NextResponse.json(
        {
          error:
            siteMaintenance.message ||
            siteConfig?.defaultMessage ||
            "GroupXam is temporarily unavailable while we complete maintenance.",
          maintenance: true,
          section: "whole_site",
        },
        { status: 503 }
      );
    }

    const aiMaintenance = await isMaintenanceActive("ai_chat");
    if (aiMaintenance) {
      const aiConfig = MAINTENANCE_SECTIONS.find((section) => section.id === "ai_chat");
      return NextResponse.json(
        {
          error:
            aiMaintenance.message ||
            aiConfig?.defaultMessage ||
            "sunu-I is currently undergoing maintenance. Please check back soon.",
          maintenance: true,
          section: "ai_chat",
        },
        { status: 503 }
      );
    }

    const { message, images = [], documents = [], conversationHistory = [] } = await req.json();
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (
      (typeof message !== "string" || trimmedMessage.length === 0) &&
      (!images || images.length === 0) &&
      (!documents || documents.length === 0)
    ) {
        return NextResponse.json(
          { error: "Message, images, or documents are required." },
          { status: 400 }
        );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      return NextResponse.json(
        { error: "Chat service is not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Prepare messages for OpenAI API
    const systemMessage = {
      role: "system",
      content: `You are sunu-I, an intelligent and friendly AI assistant for GroupXam, an educational platform helping students prepare for WAEC, WASSCE, JAMB, IELTS, and other exams. Your role is to:

1. Help students with their academic questions, exam preparation, study strategies, and learning resources
2. Create complete practice quizzes, questions, and educational content for any exam (IELTS, WAEC, WASSCE, JAMB, etc.)
3. Provide clear, accurate, and helpful explanations of academic concepts
4. Guide students on how to use GroupXam's features effectively
5. Answer questions about exam formats, subjects, and study materials
6. Generate practice questions, mock exams, and study materials when requested
7. Be encouraging, supportive, and professional

IMPORTANT: When students ask you to create quizzes or practice questions, you should create complete, full quizzes with multiple questions, not just samples or guidance. You have full capability to generate comprehensive quiz content including:
- Multiple choice questions with options (A, B, C, D)
- Reading passages with comprehension questions
- Writing prompts and tasks
- Speaking prompts
- Complete answer explanations

Always maintain a helpful, educational, and encouraging tone.`,
    };

    // Build user message with images/documents if provided
    let userMessageContent: any = { role: "user", content: [] };
    
    // Add text content if exists
    if (message && message.trim().length > 0) {
      userMessageContent.content.push({ type: "text", text: message });
    }
    
    // Add images if provided (convert base64 data URLs to OpenAI format)
    if (images && images.length > 0) {
      for (const imageDataUrl of images) {
        // Extract base64 data from data URL (remove data:image/...;base64, prefix)
        const base64Match = imageDataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
        if (base64Match) {
          userMessageContent.content.push({
            type: "image_url",
            image_url: {
              url: imageDataUrl, // OpenAI accepts data URLs directly
            },
          });
        }
      }
    }

    // Add documents if provided
    if (documents && documents.length > 0) {
      const processedDocuments = await Promise.all(
        documents.map(async (doc: IncomingDocument) => {
          const text = await extractTextFromDocument(doc);
          return { doc, text };
        })
      );

      processedDocuments.forEach(({ doc, text }) => {
        const documentName = doc.name || "Uploaded document";
        if (text) {
          userMessageContent.content.push({
            type: "text",
            text: `Contents of "${documentName}":\n\n${truncateDocumentText(text)}`,
          });
        } else {
          userMessageContent.content.push({
            type: "text",
            text: `A document titled "${documentName}" (type: ${
              doc.type || "unknown"
            }) was provided but could not be automatically read. Please request any specific information from the user.`,
          });
        }
      });
    }

    // If no content, add default text
    if (userMessageContent.content.length === 0) {
      userMessageContent.content.push({ type: "text", text: "Please analyze the provided materials." });
    }

    // Build conversation history - convert text-only messages to OpenAI format
    const formattedHistory = conversationHistory.slice(-10).map((msg: any) => {
      // If it's already in the correct format, return as is
      if (Array.isArray(msg.content)) {
        return msg;
      }
      // Otherwise, convert to text format
      return {
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
      };
    });

    // Build conversation history
    const messages = [
      systemMessage,
      ...formattedHistory, // Keep last 10 messages for context
      userMessageContent,
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // gpt-4o-mini supports vision
        messages: messages,
        temperature: 0.7,
        max_tokens: 1200, // Trim responses to keep answers focused
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to get response from AI. Please try again later.",
          details: errorData.error?.message || "Unknown error",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: "Invalid response from AI service." },
        { status: 500 }
      );
    }

    const aiResponse = data.choices[0].message.content;

    try {
      const chatMessagesCollection = db.collection("chatMessages");
      const now = new Date();
      const retentionExpiresAt = new Date(now.getTime() + retentionDays * 24 * 60 * 60 * 1000);

      await chatMessagesCollection.deleteMany({
        email: decoded.email,
        retentionExpiresAt: { $lt: now },
      });

      const attachmentNotes: string[] = [];

      if (Array.isArray(documents) && documents.length > 0) {
        const docNotes = documents
          .map((doc: IncomingDocument) => {
            const name = doc?.name?.trim() || "Uploaded document";
            const type = doc?.type ? ` (${doc.type})` : "";
            return `Document uploaded: ${name}${type}`;
          })
          .join("\n");
        attachmentNotes.push(docNotes);
      }

      if (Array.isArray(images) && images.length > 0) {
        attachmentNotes.push(`Images attached: ${images.length}`);
      }

      const historyUserContent =
        [trimmedMessage, ...attachmentNotes].filter((segment) => segment && segment.trim().length > 0).join("\n\n") ||
        "Shared study materials with sunu-I.";

      const assistantTimestamp = new Date();

      await chatMessagesCollection.insertMany([
        {
          email: decoded.email,
          role: "user",
          content: historyUserContent,
          createdAt: now,
          retentionExpiresAt,
          hasSubscriptionSnapshot: hasSubscription,
        },
        {
          email: decoded.email,
          role: "assistant",
          content: aiResponse,
          createdAt: assistantTimestamp,
          retentionExpiresAt,
          hasSubscriptionSnapshot: hasSubscription,
          usage: data.usage ?? null,
        },
      ]);
    } catch (historyError) {
      console.error("Failed to persist chat history:", historyError);
    }

    return NextResponse.json({
      success: true,
      message: aiResponse,
      usage: data.usage,
      hasSubscription,
      retentionDays,
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

