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

        // Get active users (users who have logged in or performed activities)
        // For now, we'll use a simpler approach since we might not have lastLoginAt field
        const dailyActiveUsers = await db.collection("users").countDocuments({
            createdAt: { $gte: oneDayAgo }
        });

        const weeklyActiveUsers = await db.collection("users").countDocuments({
            createdAt: { $gte: oneWeekAgo }
        });

        const monthlyActiveUsers = await db.collection("users").countDocuments({
            createdAt: { $gte: oneMonthAgo }
        });

        const yearlyActiveUsers = await db.collection("users").countDocuments({
            createdAt: { $gte: oneYearAgo }
        });

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

        // Get recent activities (show all activities, not filtered by date range)
        const activities = await db.collection("activities")
            .find({})
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        // Fix timestamp formatting for activities
        const formattedActivities = activities.map(activity => ({
            ...activity,
            timestamp: activity.timestamp ? new Date(activity.timestamp).toISOString() : new Date().toISOString(),
            userEmail: activity.userEmail || activity.userName || 'Anonymous'
        }));



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
            countries,
            activities: formattedActivities,
            users
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