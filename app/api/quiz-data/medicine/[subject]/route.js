import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { subject } = await params;
        const subjectPath = path.join(process.cwd(), 'app', 'quiz', 'data', 'medicine', subject);

        // Check if the subject directory exists
        if (!fs.existsSync(subjectPath)) {
            return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
        }

        // Read all JSON files in the subject directory
        const files = fs.readdirSync(subjectPath);
        const quizFiles = files.filter(file => file.endsWith('.json'));

        const quizzes = [];

        for (const file of quizFiles) {
            try {
                const filePath = path.join(subjectPath, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const quizData = JSON.parse(fileContent);
                quizzes.push(quizData);
            } catch (error) {
                console.error(`Error reading quiz file ${file}:`, error);
            }
        }

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Error loading quiz data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

