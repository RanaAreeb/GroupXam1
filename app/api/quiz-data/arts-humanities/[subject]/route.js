import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { subject } = await params;

        // Decode the subject name from URL
        const decodedSubject = decodeURIComponent(subject);

        // Map subject names to folder names
        const subjectFolderMap = {
            'english': 'english',
            'literature': 'literature',
            'history': 'history',
            'geography': 'geography',
            'philosophy': 'philosophy',
            'sociology': 'sociology',
            'art-history': 'art-history',
            'music-theory': 'music-theory',
            'creative-writing': 'creative-writing',
            'foreign-languages': 'foreign-languages',
            'religious-studies': 'religious-studies',
            'cultural-studies': 'cultural-studies',
            'government': 'government',
            'arabic': 'arabic',
            'islamic-studies': 'islamic-studies',
            'christian-religious-knowledge': 'christian-religious-knowledge',
            'visual-art': 'visual-art',
            'literature-in-english': 'literature-in-english'
        };

        const folderName = subjectFolderMap[decodedSubject.toLowerCase()];

        if (!folderName) {
            return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
        }

        const quizDataPath = path.join(process.cwd(), 'app', 'quiz', 'data', 'arts-humanities', folderName);

        // Check if the directory exists
        if (!fs.existsSync(quizDataPath)) {
            return NextResponse.json({ error: 'Subject directory not found' }, { status: 404 });
        }

        // Read all JSON files in the directory
        const files = fs.readdirSync(quizDataPath);
        const quizFiles = files.filter(file => file.endsWith('.json'));

        const quizzes = [];

        for (const file of quizFiles) {
            try {
                const filePath = path.join(quizDataPath, file);
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