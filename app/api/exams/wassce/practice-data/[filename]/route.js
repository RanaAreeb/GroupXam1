import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { filename } = await params;

        // Add .json extension if not present
        const filenameWithExt = filename.endsWith('.json') ? filename : `${filename}.json`;

        // Define possible paths to search for the file
        const basePath = path.join(process.cwd(), 'app', 'exams', 'wassce', 'data', 'Practice');
        const possiblePaths = [
            path.join(basePath, filenameWithExt),
            path.join(basePath, 'Biology', filenameWithExt),
            path.join(basePath, 'Chemistry', filenameWithExt),
            path.join(basePath, 'Computer Studies', filenameWithExt),
            path.join(basePath, 'Economics', filenameWithExt),
            path.join(basePath, 'English Language', filenameWithExt),
            path.join(basePath, 'Further Mathematics', filenameWithExt),
            path.join(basePath, 'General Mathematics', filenameWithExt),
            path.join(basePath, 'Geography', filenameWithExt),
            path.join(basePath, 'History', filenameWithExt),
            path.join(basePath, 'Literature in English', filenameWithExt),
            path.join(basePath, 'Physics', filenameWithExt),
        ];

        console.log('WASSCE Practice API: Looking for file:', filenameWithExt);
        console.log('WASSCE Practice API: Checked paths:', possiblePaths);

        let filePath = null;
        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                filePath = possiblePath;
                console.log('WASSCE Practice API: Found file at:', filePath);
                break;
            }
        }

        if (!filePath) {
            console.log('WASSCE Practice API: File not found for filename:', filename);
            console.log('WASSCE Practice API: Checked paths:', possiblePaths);
            return NextResponse.json(
                { error: 'Practice data file not found' },
                { status: 404 }
            );
        }

        // Read and parse the JSON file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const practiceData = JSON.parse(fileContent);

        return NextResponse.json(practiceData);
    } catch (error) {
        console.error('WASSCE Practice API Error:', error);
        return NextResponse.json(
            { error: 'Failed to load practice data' },
            { status: 500 }
        );
    }
} 