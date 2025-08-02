import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const db = await getDatabase();
        let totalQuestions = 0;

        // Count questions from database collections
        try {
            // Count from quiz submissions (if you have a submissions collection)
            const quizQuestions = await db.collection('quiz_submissions').countDocuments();
            totalQuestions += quizQuestions;
        } catch (error) {
            console.log('No quiz_submissions collection found');
        }

        // Count from exam submissions
        try {
            const examQuestions = await db.collection('exam_submissions').countDocuments();
            totalQuestions += examQuestions;
        } catch (error) {
            console.log('No exam_submissions collection found');
        }

        // Count from flashcard completions
        try {
            const flashcardQuestions = await db.collection('flashcard_completions').countDocuments();
            totalQuestions += flashcardQuestions;
        } catch (error) {
            console.log('No flashcard_completions collection found');
        }

        // Count from JSON files in the data directories
        const dataDirectories = [
            'app/exams/jamb/data',
            'app/exams/waec/data',
            'app/exams/wasse/data',
            'app/quiz/data',
            'app/flashcards/data'
        ];

        for (const dir of dataDirectories) {
            try {
                const fullPath = path.join(process.cwd(), dir);
                if (fs.existsSync(fullPath)) {
                    const count = countQuestionsInDirectory(fullPath);
                    totalQuestions += count;
                }
            } catch (error) {
                console.log(`Error counting questions in ${dir}:`, error);
            }
        }

        return NextResponse.json({
            totalQuestions,
            success: true
        });
    } catch (error) {
        console.error('Error counting questions:', error);
        return NextResponse.json({
            error: 'Failed to count questions',
            totalQuestions: 50000 // Fallback to original number
        }, { status: 500 });
    }
}

function countQuestionsInDirectory(dirPath) {
    let count = 0;

    try {
        const items = fs.readdirSync(dirPath);

        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                count += countQuestionsInDirectory(fullPath);
            } else if (item.endsWith('.json')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const data = JSON.parse(content);

                    // Count questions based on common structures
                    if (data.questions && Array.isArray(data.questions)) {
                        count += data.questions.length;
                    } else if (data.quiz && Array.isArray(data.quiz)) {
                        count += data.quiz.length;
                    } else if (data.flashcards && Array.isArray(data.flashcards)) {
                        count += data.flashcards.length;
                    } else if (Array.isArray(data)) {
                        count += data.length;
                    }
                } catch (parseError) {
                    console.log(`Error parsing ${fullPath}:`, parseError);
                }
            }
        }
    } catch (error) {
        console.log(`Error reading directory ${dirPath}:`, error);
    }

    return count;
} 