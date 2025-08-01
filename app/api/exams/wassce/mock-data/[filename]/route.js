import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
    try {
        const { filename } = await params;

        // Add .json extension if not present
        const filenameWithExt = filename.endsWith('.json') ? filename : `${filename}.json`;

        // Map filename to the correct file path
        let filePath = "";

        // Check different possible locations for the file
        const possiblePaths = [
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "Computer Studies", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "Economics", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "English Language", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "Further Mathematics", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "General Mathematics", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "Geography", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "History", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "Literature in English", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "Biology", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "Chemistry", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "wassce", "data", "mk-exams", "Physics", filenameWithExt),
        ];

        // Find the first existing file
        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                filePath = possiblePath;
                console.log("WASSCE Mock API: Found file at:", filePath);
                break;
            }
        }

        if (!filePath) {
            console.log("WASSCE Mock API: File not found for filename:", filename);
            console.log("WASSCE Mock API: Checked paths:", possiblePaths);
            return NextResponse.json(
                { error: "Mock exam file not found", filename: filename, checkedPaths: possiblePaths },
                { status: 404 }
            );
        }

        // Read the mock exam file
        const fileContent = fs.readFileSync(filePath, "utf8");
        const mockData = JSON.parse(fileContent);

        return NextResponse.json(mockData);
    } catch (error) {
        console.error("Error loading WASSCE mock exam data:", error);
        return NextResponse.json(
            { error: "Failed to load mock exam data" },
            { status: 500 }
        );
    }
} 