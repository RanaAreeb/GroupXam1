import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jsonrepair } from "jsonrepair";
import { getDatabase } from "@/lib/db";

const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 15;
const MIN_TIME_PER_QUESTION = 1;
const MAX_TIME_PER_QUESTION = 5;
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

type RawOption = {
  id?: string;
  text?: string;
};

type RawQuestion = {
  id?: string;
  prompt?: string;
  options?: RawOption[];
  answerId?: string;
  explanation?: string;
};

type RawQuizPayload = {
  quiz?: {
    id?: string;
    subject?: string;
    topic?: string;
    difficulty?: string;
    timeLimit?: number;
    questions?: RawQuestion[];
  };
};

const sanitizeText = (value: string, fallback: string) =>
  (value || "").toString().trim() || fallback;

const ensureOptionId = (id: string | undefined, fallback: string) =>
  sanitizeText(id ?? "", fallback);

const normalizeQuiz = (
  raw: RawQuizPayload["quiz"],
  defaults: {
    subject: string;
    topic: string;
    difficulty: string;
    timeLimit: number;
  }
) => {
  if (!raw) {
    return null;
  }

  const normalizedQuestions = (raw.questions || []).map((question, index) => {
    const defaultOptionIds = ["a", "b", "c", "d"];
    let options = (question.options || [])
      .slice(0, 4)
      .map((option, optIndex) => ({
        id: ensureOptionId(option.id, defaultOptionIds[optIndex] || `opt-${optIndex}`),
        text: sanitizeText(
          option.text || `Optimistic insight ${optIndex + 1}`,
          `Optimistic insight ${optIndex + 1}`
        ),
      }));

    // Ensure exactly 4 options - add missing ones if needed
    while (options.length < 4) {
      const missingIndex = options.length;
      options.push({
        id: defaultOptionIds[missingIndex] || `opt-${missingIndex}`,
        text: `Option ${String.fromCharCode(65 + missingIndex)} - Please review this option`,
      });
    }

    // Ensure we have exactly 4 options (remove extras if any)
    options = options.slice(0, 4);

    const fallbackAnswerId = options[0].id;
    const cleanedAnswerId = ensureOptionId(question.answerId, fallbackAnswerId);
    const answerId = options.some((opt) => opt.id === cleanedAnswerId)
      ? cleanedAnswerId
      : fallbackAnswerId;

    return {
      id: question.id?.toString().trim() || `ai-q-${Date.now()}-${index}`,
      prompt: sanitizeText(
        question.prompt,
        `What is an uplifting fact about ${defaults.topic}?`
      ),
      options,
      answerId,
      explanation: sanitizeText(
        question.explanation,
        `This answer best captures how ${defaults.topic} empowers learners in ${defaults.subject}.`
      ),
    };
  });

  if (normalizedQuestions.length === 0) {
    return null;
  }

  return {
    id: raw.id?.toString().trim() || `ai-quiz-${Date.now()}`,
    subject: sanitizeText(raw.subject, defaults.subject),
    topic: sanitizeText(raw.topic, defaults.topic),
    difficulty: DIFFICULTIES.includes(raw.difficulty || "")
      ? raw.difficulty
      : defaults.difficulty,
    timeLimit: Number(raw.timeLimit) > 0 ? Number(raw.timeLimit) : defaults.timeLimit,
    createdAt: Date.now(),
    questions: normalizedQuestions,
  };
};

export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      subject,
      topic = "",
      difficulty = "Intermediate",
      numQuestions = 5,
      timePerQuestion = 2,
    } = body || {};

    if (!subject || typeof subject !== "string") {
      return NextResponse.json(
        { error: "Subject is required to generate a quiz." },
        { status: 400 }
      );
    }

    const questionCount = Math.max(
      MIN_QUESTIONS,
      Math.min(MAX_QUESTIONS, Number(numQuestions) || 5)
    );
    const minutesPerQuestion = Math.max(
      MIN_TIME_PER_QUESTION,
      Math.min(MAX_TIME_PER_QUESTION, Number(timePerQuestion) || 2)
    );
    const safeDifficulty = DIFFICULTIES.includes(difficulty)
      ? difficulty
      : "Intermediate";

    const optimisticSystemMessage = `
You are an upbeat quiz author who loves inspiring students.
Generate multiple-choice quizzes with a positive, encouraging tone.
Always provide helpful explanations that highlight why the correct answer matters.
Respond ONLY in JSON format when asked for quiz data.
`;

    const optimisticUserMessage = `
Create a quiz for the following request:
- Subject: "${subject}"
- Focus topic: "${topic || subject}"
- Difficulty: "${safeDifficulty}"
- Number of questions: ${questionCount} (YOU MUST GENERATE EXACTLY ${questionCount} QUESTIONS, NO MORE, NO LESS)
- Answer options: EXACTLY 4 options per question (ALL questions must have exactly 4 options: A, B, C, D)
- Provide an optimistic explanation that motivates the learner after each question

CRITICAL REQUIREMENTS:
1. Generate EXACTLY ${questionCount} questions - count them carefully
2. EVERY question MUST have EXACTLY 4 options with ids: "a", "b", "c", "d"
3. Return ONLY valid JSON. Each option object MUST have the structure: {"id": "a", "text": "option text here"}

Return a JSON object that matches this exact schema:
{
  "quiz": {
    "subject": "${subject}",
    "topic": "${topic || subject}",
    "difficulty": "${safeDifficulty}",
    "timeLimit": ${questionCount * minutesPerQuestion},
    "questions": [
      {
        "id": "q1",
        "prompt": "Question text here?",
        "options": [
          { "id": "a", "text": "Option A text" },
          { "id": "b", "text": "Option B text" },
          { "id": "c", "text": "Option C text" },
          { "id": "d", "text": "Option D text" }
        ],
        "answerId": "a",
        "explanation": "Explanation text here"
      }
    ]
  }
}

VERY IMPORTANT: 
- Generate exactly ${questionCount} questions in the "questions" array
- Every single question must have exactly 4 options (a, b, c, d)
- Ensure all option objects use "text" as the key name, not the option content itself.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: optimisticSystemMessage.trim() },
            { role: "user", content: optimisticUserMessage.trim() },
          ],
          max_tokens: Math.max(3000, questionCount * 200), // Increase tokens based on question count (200 tokens per question minimum)
        }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate quiz with AI. Please try again later." },
        { status: response.status }
      );
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "AI response was empty. Please try again." },
        { status: 500 }
      );
    }

    let parsed: RawQuizPayload | null = null;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.warn("Strict JSON parse failed. Attempting repair.", error);
      try {
        const repairedContent = jsonrepair(content);
        parsed = JSON.parse(repairedContent);
        console.info("AI quiz JSON repaired successfully.");
      } catch (repairError) {
        console.error("Failed to parse AI quiz JSON after repair:", repairError, content);
        return NextResponse.json(
          { error: "AI response was not valid JSON. Please try again." },
          { status: 500 }
        );
      }
    }

    const normalizedQuiz = normalizeQuiz(parsed.quiz, {
      subject,
      topic: topic || subject,
      difficulty: safeDifficulty,
      timeLimit: questionCount * minutesPerQuestion,
    });

    if (!normalizedQuiz) {
      return NextResponse.json(
        { error: "AI response did not include quiz questions. Please try again." },
        { status: 500 }
      );
    }

    // Validate and ensure correct number of questions
    if (normalizedQuiz.questions.length !== questionCount) {
      console.warn(`AI generated ${normalizedQuiz.questions.length} questions but ${questionCount} were requested.`);
      // If we got fewer questions, we can't generate more, so return what we have
      // If we got more, trim to requested amount
      if (normalizedQuiz.questions.length > questionCount) {
        normalizedQuiz.questions = normalizedQuiz.questions.slice(0, questionCount);
      }
    }

    // Ensure each question has exactly 4 options
    normalizedQuiz.questions = normalizedQuiz.questions.map((question) => {
      let options = question.options || [];
      
      // Ensure exactly 4 options
      while (options.length < 4) {
        const missingIndex = options.length;
        options.push({
          id: ["a", "b", "c", "d"][missingIndex] || `opt-${missingIndex}`,
          text: `Option ${String.fromCharCode(65 + missingIndex)} - Please review`,
        });
      }
      
      // Trim to exactly 4 if more than 4
      options = options.slice(0, 4);
      
      return {
        ...question,
        options,
      };
    });

    // Track AI quiz generation for analytics
    try {
      const db = await getDatabase();
      const aiQuizUsageCollection = db.collection("aiQuizUsage");
      const usersCollection = db.collection("users");
      
      const user = await usersCollection.findOne({ email: decoded.email });
      
      if (user) {
        await aiQuizUsageCollection.insertOne({
          userId: user._id,
          userEmail: decoded.email,
          userName: user.name || user.email,
          subject: normalizedQuiz.subject,
          topic: normalizedQuiz.topic || normalizedQuiz.subject,
          difficulty: normalizedQuiz.difficulty,
          numQuestions: normalizedQuiz.questions.length,
          timeLimit: normalizedQuiz.timeLimit,
          quizId: normalizedQuiz.id,
          createdAt: new Date(),
          timestamp: new Date(),
        });
      }
    } catch (trackingError) {
      // Don't fail the request if tracking fails
      console.error("Failed to track AI quiz usage:", trackingError);
    }

    return NextResponse.json({ quiz: normalizedQuiz });
  } catch (error) {
    console.error("AI quiz route error:", error);
    return NextResponse.json(
      { error: "Unexpected error while generating the quiz." },
      { status: 500 }
    );
  }
}




