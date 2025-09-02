import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function GET(request) {
    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return Response.json({ error: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const client = await clientPromise;
        const db = client.db("groupxam");

        // Get user exam submissions
        const examSubmissionsCollection = db.collection("examSubmissions");
        const userExamSubmissions = await examSubmissionsCollection.find({
            studentEmail: decoded.email
        }).toArray();

        // Get user registrations
        const registrationsCollection = db.collection("examRegistrations");
        const userRegistrations = await registrationsCollection.find({
            studentEmail: decoded.email
        }).toArray();

        // Get quiz completions from activities
        const activitiesCollection = db.collection("activities");
        const userQuizActivities = await activitiesCollection.find({
            userId: decoded.email, // Using email as userId in activities
            type: "quiz-completion"
        }).toArray();

        // Get user's general stats from user document
        const usersCollection = db.collection("users");
        const user = await usersCollection.findOne({
            email: decoded.email
        });

        const userStats = user?.stats || {};

        // Calculate comprehensive stats
        const totalExams = userRegistrations.length;
        const completedExams = userExamSubmissions.length;
        const totalQuizzes = userQuizActivities.length;

        // Calculate scores from exam submissions
        const examScores = userExamSubmissions
            .filter(s => s.score !== undefined && s.totalQuestions > 0)
            .map(s => Math.round((s.score / s.totalQuestions) * 100));

        // Calculate scores from quiz activities  
        const quizScores = userQuizActivities
            .filter(q => q.score !== undefined && q.totalQuestions > 0)
            .map(q => Math.round((q.score / q.totalQuestions) * 100));

        // Combine all scores
        const allScores = [...examScores, ...quizScores];

        const averageScore = allScores.length > 0
            ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
            : 0;

        const bestScore = allScores.length > 0 ? Math.max(...allScores) : 0;

        // Calculate study time from time taken in submissions + estimated quiz time
        const examStudyTime = userExamSubmissions.reduce((total, sub) => total + (sub.timeTaken || 0), 0);
        const estimatedQuizTime = totalQuizzes * 15; // Assume 15 min per quiz
        const totalStudyTime = examStudyTime + estimatedQuizTime;

        // Calculate streak based on recent activity
        const currentStreak = userStats.currentStreak || 0;

        // Enhanced achievements
        const achievements = [];
        if (completedExams >= 1) achievements.push("First Exam Completed");
        if (totalQuizzes >= 1) achievements.push("Quiz Explorer");
        if (completedExams >= 5) achievements.push("5 Exams Mastered");
        if (totalQuizzes >= 10) achievements.push("Quiz Champion");
        if (completedExams >= 10) achievements.push("Perfect Ten");
        if (bestScore >= 90) achievements.push("Excellence Award");
        if (bestScore === 100) achievements.push("Perfect Score");
        if (currentStreak >= 7) achievements.push("Weekly Warrior");
        if (currentStreak >= 30) achievements.push("Study Legend");

        // Recent activity from multiple sources
        const examActivities = userExamSubmissions
            .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
            .slice(0, 5)
            .map(submission => ({
                title: "Exam Completed",
                description: `Score: ${Math.round((submission.score / submission.totalQuestions) * 100)}%`,
                date: submission.submittedAt,
                type: "exam_completed"
            }));

        const quizActivities = userQuizActivities
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(activity => ({
                title: activity.quizType === 'flashcard' ? 'Flashcard Set Completed' : 'Quiz Completed',
                description: activity.subject ? `Subject: ${activity.subject}` : activity.message,
                date: activity.createdAt,
                type: activity.type
            }));

        const recentActivity = [...examActivities, ...quizActivities]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);

        return Response.json({
            totalExams,
            completedExams,
            totalQuizzes,
            averageScore,
            totalStudyTime,
            currentStreak,
            bestScore,
            rank: 0, // TODO: Calculate rank
            achievements,
            recentActivity
        });

    } catch (error) {
        console.error("Error fetching user stats:", error);
        return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}

