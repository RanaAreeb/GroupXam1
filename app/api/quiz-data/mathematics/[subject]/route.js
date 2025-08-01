import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { subject } = await params;

        // Define the base path for mathematics quiz data
        const basePath = path.join(process.cwd(), 'app', 'quiz', 'data', 'mathematics');

        // Map subject names to folder names
        let folderName = decodeURIComponent(subject).toLowerCase();

        // Handle special cases for subject names
        if (decodeURIComponent(subject).toLowerCase() === 'pythagorean theorem') {
            folderName = 'pythagorean-theorem';
        }

        const subjectPath = path.join(basePath, folderName);

        // Check if the directory exists
        if (!fs.existsSync(subjectPath)) {
            return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
        }

        // Read all JSON files in the subject directory
        const files = fs.readdirSync(subjectPath);
        const quizFiles = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(subjectPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(content);
            });

        return NextResponse.json(quizFiles);
    } catch (error) {
        console.error('Error loading mathematics quiz data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 