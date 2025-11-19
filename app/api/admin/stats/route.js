import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const period = searchParams.get('period');

        const db = await getDatabase();

        // Calculate date ranges based on parameters
        const now = new Date();
        let startDateObj, endDateObj;

        console.log('Received params:', { startDate, endDate, period });

        if (period === 'custom' && startDate && endDate) {
            // Handle custom date range
            startDateObj = new Date(startDate);
            endDateObj = new Date(endDate);
            console.log('Using custom date range:', { startDateObj, endDateObj });
        } else if (period && period !== 'custom') {
            // Handle predefined periods
            switch (period) {
                case 'today':
                    startDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    endDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                    break;
                case 'week':
                    startDateObj = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    endDateObj = now;
                    break;
                case 'month':
                    startDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDateObj = now;
                    break;
                case 'quarter':
                    startDateObj = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                    endDateObj = now;
                    break;
                case 'year':
                    startDateObj = new Date(now.getFullYear(), 0, 1);
                    endDateObj = now;
                    break;
                case '5years':
                    startDateObj = new Date(now.getFullYear() - 5, 0, 1);
                    endDateObj = now;
                    break;
                default:
                    startDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
                    endDateObj = now;
            }
            console.log('Using predefined period:', period, { startDateObj, endDateObj });
        } else {
            // Default to current month
            startDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
            endDateObj = now;
            console.log('Using default date range:', { startDateObj, endDateObj });
        }

        // Get current date and calculate time ranges for comparison
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Get 24 hours ago for daily active users
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

        // Get total users for the selected period
        const totalUsers = await db.collection("users").countDocuments({
            createdAt: { $gte: startDateObj, $lte: endDateObj }
        });

        // Get signup statistics for the selected period
        const periodSignups = await db.collection("users").countDocuments({
            createdAt: { $gte: startDateObj, $lte: endDateObj }
        });

        // Get comparison statistics (always use standard periods for comparison)
        const dailySignups = await db.collection("users").countDocuments({
            createdAt: { $gte: startOfDay }
        });

        const weeklySignups = await db.collection("users").countDocuments({
            createdAt: { $gte: startOfWeek }
        });

        const monthlySignups = await db.collection("users").countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        const yearlySignups = await db.collection("users").countDocuments({
            createdAt: { $gte: startOfYear }
        });

        console.log('Signup stats:', {
            periodSignups,
            dailySignups,
            weeklySignups,
            monthlySignups,
            yearlySignups,
            dateRange: { startDateObj, endDateObj }
        });

        // Get active users (users who have logged in recently)
        const dailyActiveUsers = await db.collection("users").countDocuments({
            lastLoginAt: { $gte: oneDayAgo }
        });

        const weeklyActiveUsers = await db.collection("users").countDocuments({
            lastLoginAt: { $gte: oneWeekAgo }
        });

        const monthlyActiveUsers = await db.collection("users").countDocuments({
            lastLoginAt: { $gte: oneMonthAgo }
        });

        const yearlyActiveUsers = await db.collection("users").countDocuments({
            lastLoginAt: { $gte: oneYearAgo }
        });

        // Get session statistics from sessions collection for the selected period
        const sessionStats = await db.collection("sessions").aggregate([
            {
                $match: {
                    endTime: { $gte: startDateObj, $lte: endDateObj }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    totalSessionTime: { $sum: "$sessionDuration" },
                    totalPageViews: { $sum: "$pageViews" },
                    averageSessionTime: { $avg: "$sessionDuration" },
                    activeUsers: { $addToSet: "$userId" }
                }
            }
        ]).toArray();

        const sessionData = sessionStats[0] || {
            totalSessions: 0,
            totalSessionTime: 0,
            totalPageViews: 0,
            averageSessionTime: 0,
            activeUsers: 0
        };

        // Convert activeUsers from array to count
        if (sessionData.activeUsers && Array.isArray(sessionData.activeUsers)) {
            sessionData.activeUsers = sessionData.activeUsers.length;
        }

        // AI assistant analytics
        const aiMatchStage = {
            createdAt: { $gte: startDateObj, $lte: endDateObj }
        };

        const aiUserSummary = await db.collection("chatMessages").aggregate([
            { $match: aiMatchStage },
            {
                $group: {
                    _id: "$email",
                    totalMessages: { $sum: 1 },
                    userMessages: {
                        $sum: {
                            $cond: [{ $eq: ["$role", "user"] }, 1, 0]
                        }
                    },
                    assistantMessages: {
                        $sum: {
                            $cond: [{ $eq: ["$role", "assistant"] }, 1, 0]
                        }
                    },
                    firstMessageAt: { $min: "$createdAt" },
                    lastMessageAt: { $max: "$createdAt" }
                }
            }
        ]).toArray();

        const aiSessionsRaw = await db.collection("chatMessages").aggregate([
            { $match: aiMatchStage },
            {
                $addFields: {
                    sessionDate: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { email: "$email", sessionDate: "$sessionDate" },
                    email: { $first: "$email" },
                    sessionDate: { $first: "$sessionDate" },
                    firstMessageAt: { $min: "$createdAt" },
                    lastMessageAt: { $max: "$createdAt" },
                    totalMessages: { $sum: 1 },
                    userMessages: {
                        $sum: {
                            $cond: [{ $eq: ["$role", "user"] }, 1, 0]
                        }
                    },
                    assistantMessages: {
                        $sum: {
                            $cond: [{ $eq: ["$role", "assistant"] }, 1, 0]
                        }
                    }
                }
            }
        ]).toArray();

        const recentAiMessages = await db.collection("chatMessages")
            .find(aiMatchStage)
            .project({
                email: 1,
                role: 1,
                content: 1,
                createdAt: 1
            })
            .sort({ createdAt: -1 })
            .limit(25)
            .toArray();

        let totalSessionMinutes = 0;
        const sessionSummaryByUser = {};
        const aiSessions = aiSessionsRaw.map((session) => {
            const first = session.firstMessageAt ? new Date(session.firstMessageAt) : null;
            const last = session.lastMessageAt ? new Date(session.lastMessageAt) : null;
            const durationMinutes = first && last ? Math.max(0, (last.getTime() - first.getTime()) / (1000 * 60)) : 0;
            totalSessionMinutes += durationMinutes;

            if (!sessionSummaryByUser[session.email]) {
                sessionSummaryByUser[session.email] = {
                    totalSessions: 0,
                    totalSessionMinutes: 0,
                    totalAssistantMessages: 0,
                    totalUserMessages: 0
                };
            }
            sessionSummaryByUser[session.email].totalSessions += 1;
            sessionSummaryByUser[session.email].totalSessionMinutes += durationMinutes;
            sessionSummaryByUser[session.email].totalAssistantMessages += session.assistantMessages || 0;
            sessionSummaryByUser[session.email].totalUserMessages += session.userMessages || 0;

            return {
                email: session.email,
                sessionDate: session.sessionDate,
                totalMessages: session.totalMessages || 0,
                userMessages: session.userMessages || 0,
                assistantMessages: session.assistantMessages || 0,
                firstMessageAt: session.firstMessageAt,
                lastMessageAt: session.lastMessageAt,
                sessionDurationMinutes: durationMinutes
            };
        });

        const totalSessions = aiSessions.length;
        const totalAIUsers = aiUserSummary.length;
        const totalUserPrompts = aiUserSummary.reduce((sum, user) => sum + (user.userMessages || 0), 0);
        const totalAssistantResponses = aiUserSummary.reduce((sum, user) => sum + (user.assistantMessages || 0), 0);
        const totalAimessages = aiUserSummary.reduce((sum, user) => sum + (user.totalMessages || 0), 0);
        const averageSessionMinutes = totalSessions > 0 ? totalSessionMinutes / totalSessions : 0;
        const averageResponsesPerSession = totalSessions > 0 ? totalAssistantResponses / totalSessions : 0;
        const averagePromptsPerUser = totalAIUsers > 0 ? totalUserPrompts / totalAIUsers : 0;

        const topUsers = aiUserSummary
            .map((user) => {
                const sessionInfo = sessionSummaryByUser[user._id] || {
                    totalSessions: 0,
                    totalSessionMinutes: 0
                };
                const averageSessionForUser =
                    sessionInfo.totalSessions > 0
                        ? sessionInfo.totalSessionMinutes / sessionInfo.totalSessions
                        : 0;

                return {
                    email: user._id,
                    totalMessages: user.totalMessages || 0,
                    userMessages: user.userMessages || 0,
                    assistantMessages: user.assistantMessages || 0,
                    totalSessions: sessionInfo.totalSessions,
                    totalSessionMinutes: Number(sessionInfo.totalSessionMinutes.toFixed(2)),
                    averageSessionMinutes: Number(averageSessionForUser.toFixed(2)),
                    firstMessageAt: user.firstMessageAt ? new Date(user.firstMessageAt).toISOString() : null,
                    lastMessageAt: user.lastMessageAt ? new Date(user.lastMessageAt).toISOString() : null
                };
            })
            .sort((a, b) => b.totalMessages - a.totalMessages)
            .slice(0, 10);

        const recentActivity = recentAiMessages.map((message) => ({
            id: message._id ? message._id.toString() : undefined,
            email: message.email,
            role: message.role,
            content: typeof message.content === "string" ? message.content.slice(0, 500) : "",
            createdAt: message.createdAt ? new Date(message.createdAt).toISOString() : null
        }));

        // AI Quiz analytics
        const aiQuizMatchStage = {
            createdAt: { $gte: startDateObj, $lte: endDateObj }
        };

        const aiQuizStats = await db.collection("aiQuizUsage").aggregate([
            { $match: aiQuizMatchStage },
            {
                $group: {
                    _id: null,
                    totalQuizzes: { $sum: 1 },
                    totalQuestions: { $sum: "$numQuestions" },
                    uniqueUsers: { $addToSet: "$userEmail" }
                }
            }
        ]).toArray();

        const aiQuizUserSummary = await db.collection("aiQuizUsage").aggregate([
            { $match: aiQuizMatchStage },
            {
                $group: {
                    _id: "$userEmail",
                    totalQuizzes: { $sum: 1 },
                    totalQuestions: { $sum: "$numQuestions" },
                    firstQuizAt: { $min: "$createdAt" },
                    lastQuizAt: { $max: "$createdAt" }
                }
            }
        ]).toArray();

        const recentAiQuizzes = await db.collection("aiQuizUsage")
            .find(aiQuizMatchStage)
            .project({
                userEmail: 1,
                userName: 1,
                subject: 1,
                topic: 1,
                difficulty: 1,
                numQuestions: 1,
                createdAt: 1
            })
            .sort({ createdAt: -1 })
            .limit(25)
            .toArray();

        const aiQuizData = aiQuizStats[0] || {
            totalQuizzes: 0,
            totalQuestions: 0,
            uniqueUsers: []
        };

        const totalAiQuizUsers = Array.isArray(aiQuizData.uniqueUsers) ? aiQuizData.uniqueUsers.length : 0;
        const totalAiQuizzes = aiQuizData.totalQuizzes || 0;
        const totalAiQuizQuestions = aiQuizData.totalQuestions || 0;
        const averageQuestionsPerQuiz = totalAiQuizzes > 0 ? totalAiQuizQuestions / totalAiQuizzes : 0;
        const averageQuizzesPerUser = totalAiQuizUsers > 0 ? totalAiQuizzes / totalAiQuizUsers : 0;

        const topAiQuizUsers = aiQuizUserSummary
            .map((user) => ({
                email: user._id,
                totalQuizzes: user.totalQuizzes || 0,
                totalQuestions: user.totalQuestions || 0,
                firstQuizAt: user.firstQuizAt ? new Date(user.firstQuizAt).toISOString() : null,
                lastQuizAt: user.lastQuizAt ? new Date(user.lastQuizAt).toISOString() : null
            }))
            .sort((a, b) => b.totalQuizzes - a.totalQuizzes)
            .slice(0, 10);

        const recentAiQuizActivity = recentAiQuizzes.map((quiz) => {
            const questionText = quiz.numQuestions === 1 ? 'question' : 'questions';
            const topicText = quiz.topic && quiz.topic !== quiz.subject ? ` - ${quiz.topic}` : '';
            // Truncate content if too long for large question counts
            const content = `Generated AI quiz: ${quiz.subject}${topicText} (${quiz.numQuestions} ${questionText}, ${quiz.difficulty})`;
            return {
                id: quiz._id ? quiz._id.toString() : undefined,
                email: quiz.userEmail,
                role: "user",
                content: content.length > 150 ? content.substring(0, 147) + '...' : content,
                createdAt: quiz.createdAt ? new Date(quiz.createdAt).toISOString() : null
            };
        });

        // Combine chat and quiz analytics
        const combinedTotalUsers = new Set([
            ...aiUserSummary.map(u => u._id),
            ...aiQuizUserSummary.map(u => u._id)
        ]).size;

        const combinedRecentActivity = [
            ...recentActivity,
            ...recentAiQuizActivity
        ]
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 25);

        const aiAnalytics = {
            totalUsers: combinedTotalUsers,
            totalMessages: totalAimessages,
            totalUserPrompts,
            totalAssistantResponses,
            totalSessions,
            totalSessionMinutes: Number(totalSessionMinutes.toFixed(2)),
            averageSessionMinutes: Number(averageSessionMinutes.toFixed(2)),
            averageResponsesPerSession: Number(averageResponsesPerSession.toFixed(2)),
            averagePromptsPerUser: Number(averagePromptsPerUser.toFixed(2)),
            topUsers,
            recentActivity: combinedRecentActivity,
            // AI Quiz specific metrics
            aiQuiz: {
                totalQuizzes: totalAiQuizzes,
                totalQuestions: totalAiQuizQuestions,
                uniqueUsers: totalAiQuizUsers,
                averageQuestionsPerQuiz: Number(averageQuestionsPerQuiz.toFixed(2)),
                averageQuizzesPerUser: Number(averageQuizzesPerUser.toFixed(2)),
                topUsers: topAiQuizUsers,
                recentQuizzes: recentAiQuizzes.map((quiz) => ({
                    id: quiz._id ? quiz._id.toString() : undefined,
                    email: quiz.userEmail,
                    userName: quiz.userName,
                    subject: quiz.subject,
                    topic: quiz.topic,
                    difficulty: quiz.difficulty,
                    numQuestions: quiz.numQuestions,
                    createdAt: quiz.createdAt ? new Date(quiz.createdAt).toISOString() : null
                }))
            }
        };

        // Get country distribution with full names for the selected period
        const countryStats = await db.collection("users").aggregate([
            {
                $match: {
                    country: { $exists: true, $ne: null, $ne: "" },
                    createdAt: { $gte: startDateObj, $lte: endDateObj }
                }
            },
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 20
            }
        ]).toArray();

        // Country name mapping for full names
        const countryNameMap = {
            'NG': 'Nigeria',
            'GH': 'Ghana',
            'KE': 'Kenya',
            'ZA': 'South Africa',
            'EG': 'Egypt',
            'ET': 'Ethiopia',
            'UG': 'Uganda',
            'TZ': 'Tanzania',
            'RW': 'Rwanda',
            'BW': 'Botswana',
            'ZM': 'Zambia',
            'ZW': 'Zimbabwe',
            'MW': 'Malawi',
            'MZ': 'Mozambique',
            'AO': 'Angola',
            'NA': 'Namibia',
            'LS': 'Lesotho',
            'SZ': 'Eswatini',
            'MG': 'Madagascar',
            'MU': 'Mauritius',
            'SC': 'Seychelles',
            'KM': 'Comoros',
            'DJ': 'Djibouti',
            'SO': 'Somalia',
            'SD': 'Sudan',
            'SS': 'South Sudan',
            'CF': 'Central African Republic',
            'TD': 'Chad',
            'CM': 'Cameroon',
            'GQ': 'Equatorial Guinea',
            'GA': 'Gabon',
            'CG': 'Republic of the Congo',
            'CD': 'Democratic Republic of the Congo',
            'ST': 'São Tomé and Príncipe',
            'CV': 'Cape Verde',
            'GM': 'Gambia',
            'GN': 'Guinea',
            'GW': 'Guinea-Bissau',
            'SL': 'Sierra Leone',
            'LR': 'Liberia',
            'CI': 'Ivory Coast',
            'BF': 'Burkina Faso',
            'ML': 'Mali',
            'NE': 'Niger',
            'TD': 'Chad',
            'SN': 'Senegal',
            'MR': 'Mauritania',
            'TN': 'Tunisia',
            'DZ': 'Algeria',
            'MA': 'Morocco',
            'LY': 'Libya',
            'US': 'United States',
            'CA': 'Canada',
            'GB': 'United Kingdom',
            'DE': 'Germany',
            'FR': 'France',
            'IT': 'Italy',
            'ES': 'Spain',
            'NL': 'Netherlands',
            'BE': 'Belgium',
            'CH': 'Switzerland',
            'AT': 'Austria',
            'SE': 'Sweden',
            'NO': 'Norway',
            'DK': 'Denmark',
            'FI': 'Finland',
            'PL': 'Poland',
            'CZ': 'Czech Republic',
            'HU': 'Hungary',
            'RO': 'Romania',
            'BG': 'Bulgaria',
            'HR': 'Croatia',
            'SI': 'Slovenia',
            'SK': 'Slovakia',
            'LT': 'Lithuania',
            'LV': 'Latvia',
            'EE': 'Estonia',
            'IE': 'Ireland',
            'PT': 'Portugal',
            'GR': 'Greece',
            'CY': 'Cyprus',
            'MT': 'Malta',
            'LU': 'Luxembourg',
            'IS': 'Iceland',
            'AD': 'Andorra',
            'MC': 'Monaco',
            'LI': 'Liechtenstein',
            'SM': 'San Marino',
            'VA': 'Vatican City',
            'AU': 'Australia',
            'NZ': 'New Zealand',
            'JP': 'Japan',
            'KR': 'South Korea',
            'CN': 'China',
            'IN': 'India',
            'BR': 'Brazil',
            'AR': 'Argentina',
            'MX': 'Mexico',
            'CL': 'Chile',
            'PE': 'Peru',
            'CO': 'Colombia',
            'VE': 'Venezuela',
            'EC': 'Ecuador',
            'BO': 'Bolivia',
            'PY': 'Paraguay',
            'UY': 'Uruguay',
            'GY': 'Guyana',
            'SR': 'Suriname',
            'GF': 'French Guiana',
            'FK': 'Falkland Islands',
            'GS': 'South Georgia and the South Sandwich Islands',
            'AQ': 'Antarctica'
        };

        const countries = countryStats.map(stat => ({
            country: stat._id,
            count: stat.count,
            fullName: countryNameMap[stat._id] || stat._id
        }));

        // Get recent activities and sessions
        const activities = await db.collection("activities")
            .find({})
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();

        // Get recent sessions
        const sessions = await db.collection("sessions")
            .find({})
            .sort({ endTime: -1 })
            .limit(50)
            .toArray();

        // Get user session statistics (users with their total sessions)
        const userSessionStats = await db.collection("sessions").aggregate([
            {
                $group: {
                    _id: "$userId",
                    userName: { $first: "$userName" },
                    userEmail: { $first: "$userEmail" },
                    totalSessions: { $sum: 1 },
                    totalSessionTime: { $sum: "$sessionDuration" },
                    totalPageViews: { $sum: "$pageViews" },
                    averageSessionTime: { $avg: "$sessionDuration" },
                    lastSessionAt: { $max: "$endTime" },
                    firstSessionAt: { $min: "$startTime" }
                }
            },
            {
                $sort: { totalSessions: -1 }
            }
        ]).toArray();

        // Format activities
        const formattedActivities = activities.map(activity => ({
            ...activity,
            timestamp: activity.timestamp ? new Date(activity.timestamp).toISOString() : new Date().toISOString(),
            userEmail: activity.userEmail || activity.userName || 'Anonymous',
            type: activity.type || 'activity'
        }));

        // Format sessions as activities
        const formattedSessions = sessions.map(session => ({
            _id: session._id,
            type: 'session',
            message: `${session.userName} spent ${Math.round(session.sessionDuration / 60)} minutes on the platform`,
            userId: session.userId,
            userName: session.userName,
            userEmail: session.userEmail,
            sessionDuration: session.sessionDuration,
            pageViews: session.pageViews,
            actions: session.actions,
            timestamp: session.endTime,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt
        }));

        // Combine and sort all activities
        const allActivities = [...formattedActivities, ...formattedSessions]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 100);



        // Get users for the selected period
        const users = await db.collection("users")
            .find({
                createdAt: { $gte: startDateObj, $lte: endDateObj }
            })
            .project({
                _id: 1,
                name: 1,
                email: 1,
                role: 1,
                country: 1,
                createdAt: 1,
                isVerified: 1,
                status: 1
            })
            .toArray();

        // Get all reviews (approved and pending)
        const reviews = await db.collection("reviews")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Get payment statistics
        const totalPayments = await db.collection('payments').countDocuments();
        const approvedPayments = await db.collection('payments').countDocuments({ status: 'approved' });
        const pendingPayments = await db.collection('payments').countDocuments({ status: 'pending' });
        const rejectedPayments = await db.collection('payments').countDocuments({ status: 'rejected' });

        // Get revenue data
        const revenueData = await db.collection('payments').aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, totalRevenue: { $sum: '$amount' } } }
        ]).toArray();

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // Get recent payments
        const recentPayments = await db.collection('payments')
            .find({})
            .sort({ paymentDate: -1 })
            .limit(20)
            .toArray();

        console.log('Fetched payment stats:', { totalPayments, approvedPayments, pendingPayments, totalRevenue });

        const stats = {
            totalUsers,
            dailySignups,
            weeklySignups,
            monthlySignups,
            yearlySignups,
            dailyActiveUsers,
            weeklyActiveUsers,
            monthlyActiveUsers,
            yearlyActiveUsers,
            sessionData,
            countries,
            activities: allActivities,
            users,
            userSessionStats,
            reviews,
            aiAnalytics,
            paymentStats: {
                totalPayments,
                approvedPayments,
                pendingPayments,
                rejectedPayments,
                totalRevenue,
                recentPayments
            }
        };

        return NextResponse.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error("Admin stats error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch admin statistics" },
            { status: 500 }
        );
    }
} 