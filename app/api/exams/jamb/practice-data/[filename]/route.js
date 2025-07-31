import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
    try {
        const { filename } = params;

        // Construct the file path to the practice data
        const filePath = path.join(
            process.cwd(),
            "app",
            "exams",
            "jamb",
            "data",
            "Practice",
            filename
        );

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { error: "Practice file not found" },
                { status: 404 }
            );
        }

        // Read the practice file
        const fileContent = fs.readFileSync(filePath, "utf8");
        const practiceData = JSON.parse(fileContent);

        // Transform the practice data to match the expected exam format
        const transformedData = {
            id: practiceData.id,
            title: practiceData.title,
            subject: practiceData.subject,
            examType: practiceData.examType,
            practiceType: practiceData.practiceType,
            totalQuestions: practiceData.totalQuestions,
            questions: [],
        };

        // Flatten all questions from all sections into a single array
        if (practiceData.sections) {
            practiceData.sections.forEach((section) => {
                if (section.questions) {
                    section.questions.forEach((question) => {
                        transformedData.questions.push({
                            id: question.id,
                            question: question.question,
                            options: question.options,
                            correctAnswer: question.correctAnswer,
                            explanation: question.explanation,
                            topic: question.topic,
                        });
                    });
                }
            });
        }

        return NextResponse.json(transformedData);
    } catch (error) {
        console.error("Error loading practice data:", error);
        return NextResponse.json(
            { error: "Failed to load practice data" },
            { status: 500 }
        );
    }
} 