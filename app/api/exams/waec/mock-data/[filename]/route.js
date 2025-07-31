import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
    try {
        const { filename } = params;

        // Add .json extension if not present
        const filenameWithExt = filename.endsWith('.json') ? filename : `${filename}.json`;

        // Map filename to the correct file path
        let filePath = "";

        // Check different possible locations for the file
        const possiblePaths = [
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "Computer Studies", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "Economics", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "English Language", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "Further Mathematics", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "General Mathematics", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "Geography", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "History", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "Literature in English", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "Biology", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "Chemistry", filenameWithExt),
            path.join(process.cwd(), "app", "exams", "waec", "data", "mk_exams", "Physics", filenameWithExt),
        ];

        // Find the first existing file
        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath)) {
                filePath = possiblePath;
                console.log("WAEC Mock API: Found file at:", filePath);
                break;
            }
        }

        if (!filePath) {
            console.log("WAEC Mock API: File not found for filename:", filename);
            console.log("WAEC Mock API: Checked paths:", possiblePaths);
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
        console.error("Error loading WAEC mock exam data:", error);
        return NextResponse.json(
            { error: "Failed to load mock exam data" },
            { status: 500 }
        );
    }
} 