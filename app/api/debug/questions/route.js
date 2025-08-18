import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
    try {
        const cwd = process.cwd();
        const debugInfo = {
            currentWorkingDirectory: cwd,
            directories: {},
            totalQuestions: 0,
            errors: []
        };

        // Test directories that should exist
        const testDirectories = [
            'app/exams/jamb/data',
            'app/exams/waec/data',
            'app/exams/wassce/data',
            'app/quiz/data',
            'app/flashcards/data'
        ];

        for (const dir of testDirectories) {
            const fullPath = path.join(cwd, dir);
            const exists = fs.existsSync(fullPath);

            debugInfo.directories[dir] = {
                fullPath,
                exists,
                questionCount: 0
            };

            if (exists) {
                try {
                    const count = countQuestionsInDirectory(fullPath);
                    debugInfo.directories[dir].questionCount = count;
                    debugInfo.totalQuestions += count;
                } catch (error) {
                    debugInfo.directories[dir].error = error.message;
                    debugInfo.errors.push(`Error counting ${dir}: ${error.message}`);
                }
            } else {
                debugInfo.errors.push(`Directory not found: ${dir}`);
            }
        }

        // Try alternative paths
        const altPaths = [
            path.join(cwd, '..', 'app'),
            path.join(cwd, '..', '..', 'app'),
            path.join(cwd, 'app'),
            path.join(cwd, '..', 'GroupXam1', 'app')
        ];

        debugInfo.alternativePaths = {};
        for (const altPath of altPaths) {
            const exists = fs.existsSync(altPath);
            debugInfo.alternativePaths[altPath] = {
                exists,
                contents: exists ? fs.readdirSync(altPath) : []
            };
        }

        return NextResponse.json(debugInfo);
    } catch (error) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
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
