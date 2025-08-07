import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('userEmail');

        const db = await getDatabase();
        const sessions = db.collection("sessions");

        // Build query based on whether userEmail is provided
        let query = { pageVisits: { $exists: true, $ne: [] } };
        if (userEmail) {
            query.userEmail = userEmail;
        }

        // Get sessions with page visits data
        const allSessions = await sessions
            .find(query)
            .toArray();

        console.log(`Found ${allSessions.length} sessions with page visits data${userEmail ? ` for user: ${userEmail}` : ''}`);

        // Aggregate page analytics
        const pageAnalyticsMap = new Map();

        allSessions.forEach(session => {
            if (session.pageVisits && Array.isArray(session.pageVisits)) {
                session.pageVisits.forEach(visit => {
                    const pageKey = visit.page || visit.url || 'unknown';
                    const pageName = getPageName(pageKey);

                    if (!pageAnalyticsMap.has(pageKey)) {
                        pageAnalyticsMap.set(pageKey, {
                            page: pageKey,
                            pageName: pageName,
                            url: visit.url || pageKey,
                            totalTime: 0,
                            visits: 0,
                            totalActions: 0
                        });
                    }

                    const pageData = pageAnalyticsMap.get(pageKey);
                    // Page visits store duration in milliseconds, convert to seconds to match session data
                    const durationInSeconds = Math.floor((visit.duration || 0) / 1000);
                    pageData.totalTime += durationInSeconds;
                    pageData.visits += 1;
                    pageData.totalActions += (visit.actions && Array.isArray(visit.actions)) ? visit.actions.length : 0;
                });
            }
        });

        // Convert map to array and sort by total time
        const pageAnalytics = Array.from(pageAnalyticsMap.values())
            .sort((a, b) => b.totalTime - a.totalTime);

        console.log(`Generated analytics for ${pageAnalytics.length} pages`);

        return NextResponse.json({
            success: true,
            pageAnalytics: pageAnalytics,
            totalPages: pageAnalytics.length
        });

    } catch (error) {
        console.error("Error fetching page analytics:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch page analytics" },
            { status: 500 }
        );
    }
}

// Helper function to get readable page names
function getPageName(pagePath) {
    const pageNames = {
        '/': 'Home',
        '/dashboard': 'Dashboard',
        '/login': 'Login',
        '/signup': 'Sign Up',
        '/quiz': 'Quiz',
        '/exams': 'Exams',
        '/flashcards': 'Flashcards',
        '/discussions': 'Discussions',
        '/about': 'About',
        '/contact': 'Contact',
        '/faq': 'FAQ',
        '/privacy-policy': 'Privacy Policy',
        '/terms-of-use': 'Terms of Use',
        '/admin/dashboard': 'Admin Dashboard',
        '/admin/test': 'Admin Test',
        '/university/dashboard': 'University Dashboard',
        '/university/exams': 'University Exams',
        '/university/exams/create': 'Create Exam',
        '/university/exams/results': 'Exam Results',
        '/assessments': 'Assessments',
        '/services': 'Services',
        '/testimonials': 'Testimonials',
        '/whiteboard': 'Whiteboard',
        '/env-setup': 'Environment Setup',
        '/setup': 'Setup',
        '/verify': 'Verify Account',
        '/forgot-password': 'Forgot Password'
    };

    // Check for quiz pages
    if (pagePath.startsWith('/quiz/')) {
        const parts = pagePath.split('/');
        if (parts.length >= 3) {
            const subject = parts[2].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `Quiz - ${subject}`;
        }
    }

    // Check for exam pages
    if (pagePath.startsWith('/exams/')) {
        const parts = pagePath.split('/');
        if (parts.length >= 3) {
            const examType = parts[2].toUpperCase();
            return `Exams - ${examType}`;
        }
    }

    // Check for flashcard pages
    if (pagePath.startsWith('/flashcards/')) {
        return 'Flashcards';
    }

    // Return mapped name or generate from path
    return pageNames[pagePath] || pagePath.replace(/\//g, ' ').replace(/\b\w/g, l => l.toUpperCase()).trim();
}
