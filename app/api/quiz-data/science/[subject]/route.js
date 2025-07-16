import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { subject } = params;
        console.log('API called for subject:', subject);
        const subjectPath = path.join(process.cwd(), 'app', 'quiz', 'data', 'science', subject);
        console.log('Subject path:', subjectPath);

        // Check if the subject directory exists
        if (!fs.existsSync(subjectPath)) {
            console.log('Subject directory not found:', subjectPath);
            return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
        }

        // Read all JSON files in the subject directory
        const files = fs.readdirSync(subjectPath);
        console.log('Files in directory:', files);
        const quizFiles = files.filter(file => file.endsWith('.json'));
        console.log('Quiz files:', quizFiles);

        const quizzes = [];

        for (const file of quizFiles) {
            try {
                const filePath = path.join(subjectPath, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const quizData = JSON.parse(fileContent);
                console.log('Loaded quiz data for', file, ':', quizData);
                quizzes.push(quizData);
            } catch (error) {
                console.error(`Error reading quiz file ${file}:`, error);
            }
        }

        console.log('Returning quizzes:', quizzes);
        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Error loading quiz data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 