import { getDatabase } from "@/lib/db";

export async function GET() {
    try {
        const db = await getDatabase();

        // Get total exams
        const examsCollection = db.collection("exams");
        const totalExams = await examsCollection.countDocuments();

        // Get total institutions (universities)
        const institutionsCollection = db.collection("users");
        const totalInstitutions = await institutionsCollection.countDocuments({ role: "university" });

        // Get total students
        const totalStudents = await institutionsCollection.countDocuments({ role: "student" });

        // Get submissions for success rate calculation
        const submissionsCollection = db.collection("submissions");
        const totalSubmissions = await submissionsCollection.countDocuments();
        const completedSubmissions = await submissionsCollection.countDocuments({ status: "submitted" });

        // Calculate success rate (completed submissions / total submissions * 100)
        const successRate = totalSubmissions > 0 ? Math.round((completedSubmissions / totalSubmissions) * 100) : 0;

        return Response.json({
            totalExams,
            totalStudents,
            totalInstitutions,
            successRate,
            totalSubmissions,
            completedSubmissions
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        return Response.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
    // Don't close the connection - reuse it for future requests
}
