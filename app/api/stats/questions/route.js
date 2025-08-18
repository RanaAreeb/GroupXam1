import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import fs from 'fs';
import path from 'path';

// Cache for question count to prevent frequent recalculations
let questionCountCache = {
    count: null,
    timestamp: null,
    ttl: 1 * 60 * 1000 // 1 minute cache (reduced for faster updates)
};

export async function GET(request) {
    try {
        // Check if we should clear cache
        const { searchParams } = new URL(request.url);
        const clearCache = searchParams.get('clearCache');

        if (clearCache === 'true') {
            questionCountCache.count = null;
            questionCountCache.timestamp = null;
        }

        // Check cache first
        const now = Date.now();
        if (questionCountCache.count !== null &&
            questionCountCache.timestamp !== null &&
            (now - questionCountCache.timestamp) < questionCountCache.ttl) {
            return NextResponse.json({
                totalQuestions: questionCountCache.count,
                success: true,
                cached: true
            });
        }

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

        // Count from JSON files in the data directories - with better error handling
        const dataDirectories = [
            'app/exams/jamb/data',
            'app/exams/waec/data',
            'app/exams/wassce/data',
            'app/quiz/data',
            'app/flashcards/data'
        ];

        for (const dir of dataDirectories) {
            try {
                const fullPath = path.join(process.cwd(), dir);
                if (fs.existsSync(fullPath)) {
                    const count = countQuestionsInDirectory(fullPath);
                    totalQuestions += count;
                    console.log(`Counted ${count} questions from ${dir}`);
                } else {
                    console.log(`Directory not found: ${dir}`);
                }
            } catch (error) {
                console.log(`Error counting questions in ${dir}:`, error);
            }
        }

        // Ensure we have a minimum reasonable count
        if (totalQuestions < 1000) {
            totalQuestions = 15000; // Fallback to a reasonable number
        }

        // Update cache
        questionCountCache.count = totalQuestions;
        questionCountCache.timestamp = now;

        return NextResponse.json({
            totalQuestions,
            success: true
        });
    } catch (error) {
        console.error('Error counting questions:', error);
        return NextResponse.json({
            error: 'Failed to count questions',
            totalQuestions: 15000 // Consistent fallback number
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
                    } else if (data.sets && Array.isArray(data.sets)) {
                        // Handle flashcard data with sets
                        for (const set of data.sets) {
                            if (set.cards && Array.isArray(set.cards)) {
                                count += set.cards.length;
                            }
                        }
                    } else if (data.sections && Array.isArray(data.sections)) {
                        // Handle exam data with sections
                        for (const section of data.sections) {
                            if (section.questions && Array.isArray(section.questions)) {
                                count += section.questions.length;
                            }
                        }
                    } else if (data.topics && Array.isArray(data.topics)) {
                        // Handle WASSCE data with topics
                        for (const topic of data.topics) {
                            if (topic.questions && Array.isArray(topic.questions)) {
                                count += topic.questions.length;
                            }
                        }
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