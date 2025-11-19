import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { jsonrepair } from "jsonrepair";

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
    const defaultOptionIds = ["A", "B", "C", "D", "E"];
    const options = (question.options || [])
      .slice(0, 4)
      .map((option, optIndex) => ({
        id: ensureOptionId(option.id, defaultOptionIds[optIndex] || `opt-${optIndex}`),
        text: sanitizeText(
          option.text || `Optimistic insight ${optIndex + 1}`,
          `Optimistic insight ${optIndex + 1}`
        ),
      }));

    if (options.length === 0) {
      options.push({
        id: "A",
        text: `Optimistic insight 1 about ${defaults.topic}`,
      });
      options.push({
        id: "B",
        text: `Optimistic insight 2 about ${defaults.topic}`,
      });
    }

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

  try {
    jwt.verify(token, process.env.JWT_SECRET || "");
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
- Number of questions: ${questionCount}
- Answer options: 4 per question (use cheerful, academically accurate reasoning)
- Provide an optimistic explanation that motivates the learner after each question

IMPORTANT: Return ONLY valid JSON. Each option object MUST have the structure: {"id": "a", "text": "option text here"}

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

CRITICAL: Ensure all option objects use "text" as the key name, not the option content itself.
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
        max_tokens: 1800,
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

    // Ensure each question has at most 4 options
    normalizedQuiz.questions = normalizedQuiz.questions.map((question) => ({
      ...question,
      options: question.options.slice(0, 4),
    }));

    return NextResponse.json({ quiz: normalizedQuiz });
  } catch (error) {
    console.error("AI quiz route error:", error);
    return NextResponse.json(
      { error: "Unexpected error while generating the quiz." },
      { status: 500 }
    );
  }
}




