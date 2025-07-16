import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
    try {
        const { filename } = params;
        const filePath = path.join(process.cwd(), 'app', 'exams', 'wassce', 'data', `${filename}.json`);

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Mock exam data not found' }, { status: 404 });
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error loading mock exam data:', error);
        return NextResponse.json({ error: 'Failed to load mock exam data' }, { status: 500 });
    }
} 