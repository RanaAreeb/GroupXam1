import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        if (!type) {
            return NextResponse.json(
                { success: false, error: "Export type is required" },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        let csvData = '';
        let filename = '';

        switch (type) {
            case 'users':
                const users = await db.collection("users")
                    .find({})
                    .project({
                        name: 1,
                        email: 1,
                        role: 1,
                        country: 1,
                        createdAt: 1,
                        lastLoginAt: 1
                    })
                    .toArray();

                csvData = 'Name,Email,Role,Country,Created At,Last Login\n';
                users.forEach(user => {
                    csvData += `"${user.name || ''}","${user.email || ''}","${user.role || ''}","${user.country || ''}","${user.createdAt ? new Date(user.createdAt).toISOString() : ''}","${user.lastLoginAt ? new Date(user.lastLoginAt).toISOString() : ''}"\n`;
                });
                filename = 'users-export';
                break;

            case 'activity':
                const activities = await db.collection("activities")
                    .find({})
                    .sort({ timestamp: -1 })
                    .limit(1000)
                    .toArray();

                csvData = 'Timestamp,User Email,Activity\n';
                activities.forEach(activity => {
                    csvData += `"${new Date(activity.timestamp).toISOString()}","${activity.userEmail || ''}","${activity.message || ''}"\n`;
                });
                filename = 'activity-export';
                break;

            case 'countries':
                const countryStats = await db.collection("users").aggregate([
                    {
                        $match: {
                            country: { $exists: true, $ne: null, $ne: "" }
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
                    }
                ]).toArray();

                // Country name mapping for full names
                const countryNameMap = {
                    'NG': 'Nigeria', 'GH': 'Ghana', 'KE': 'Kenya', 'ZA': 'South Africa',
                    'EG': 'Egypt', 'ET': 'Ethiopia', 'UG': 'Uganda', 'TZ': 'Tanzania',
                    'RW': 'Rwanda', 'BW': 'Botswana', 'ZM': 'Zambia', 'ZW': 'Zimbabwe',
                    'MW': 'Malawi', 'MZ': 'Mozambique', 'AO': 'Angola', 'NA': 'Namibia',
                    'LS': 'Lesotho', 'SZ': 'Eswatini', 'MG': 'Madagascar', 'MU': 'Mauritius',
                    'SC': 'Seychelles', 'KM': 'Comoros', 'DJ': 'Djibouti', 'SO': 'Somalia',
                    'SD': 'Sudan', 'SS': 'South Sudan', 'CF': 'Central African Republic',
                    'TD': 'Chad', 'CM': 'Cameroon', 'GQ': 'Equatorial Guinea', 'GA': 'Gabon',
                    'CG': 'Republic of the Congo', 'CD': 'Democratic Republic of the Congo',
                    'ST': 'São Tomé and Príncipe', 'CV': 'Cape Verde', 'GM': 'Gambia',
                    'GN': 'Guinea', 'GW': 'Guinea-Bissau', 'SL': 'Sierra Leone', 'LR': 'Liberia',
                    'CI': 'Ivory Coast', 'BF': 'Burkina Faso', 'ML': 'Mali', 'NE': 'Niger',
                    'SN': 'Senegal', 'MR': 'Mauritania', 'TN': 'Tunisia', 'DZ': 'Algeria',
                    'MA': 'Morocco', 'LY': 'Libya', 'US': 'United States', 'CA': 'Canada',
                    'GB': 'United Kingdom', 'DE': 'Germany', 'FR': 'France', 'IT': 'Italy',
                    'ES': 'Spain', 'NL': 'Netherlands', 'BE': 'Belgium', 'CH': 'Switzerland',
                    'AT': 'Austria', 'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark',
                    'FI': 'Finland', 'PL': 'Poland', 'CZ': 'Czech Republic', 'HU': 'Hungary',
                    'RO': 'Romania', 'BG': 'Bulgaria', 'HR': 'Croatia', 'SI': 'Slovenia',
                    'SK': 'Slovakia', 'LT': 'Lithuania', 'LV': 'Latvia', 'EE': 'Estonia',
                    'IE': 'Ireland', 'PT': 'Portugal', 'GR': 'Greece', 'CY': 'Cyprus',
                    'MT': 'Malta', 'LU': 'Luxembourg', 'IS': 'Iceland', 'AD': 'Andorra',
                    'MC': 'Monaco', 'LI': 'Liechtenstein', 'SM': 'San Marino', 'VA': 'Vatican City',
                    'AU': 'Australia', 'NZ': 'New Zealand', 'JP': 'Japan', 'KR': 'South Korea',
                    'CN': 'China', 'IN': 'India', 'BR': 'Brazil', 'AR': 'Argentina',
                    'MX': 'Mexico', 'CL': 'Chile', 'PE': 'Peru', 'CO': 'Colombia',
                    'VE': 'Venezuela', 'EC': 'Ecuador', 'BO': 'Bolivia', 'PY': 'Paraguay',
                    'UY': 'Uruguay', 'GY': 'Guyana', 'SR': 'Suriname', 'GF': 'French Guiana',
                    'FK': 'Falkland Islands', 'GS': 'South Georgia and the South Sandwich Islands',
                    'AQ': 'Antarctica'
                };

                csvData = 'Country Code,Full Country Name,User Count\n';
                countryStats.forEach(stat => {
                    const fullName = countryNameMap[stat._id] || stat._id;
                    csvData += `"${stat._id}","${fullName}","${stat.count}"\n`;
                });
                filename = 'countries-export';
                break;

            default:
                return NextResponse.json(
                    { success: false, error: "Invalid export type" },
                    { status: 400 }
                );
        }

        const response = new NextResponse(csvData);
        response.headers.set('Content-Type', 'text/csv');
        response.headers.set('Content-Disposition', `attachment; filename="${filename}-${new Date().toISOString().split('T')[0]}.csv"`);

        return response;

    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to export data" },
            { status: 500 }
        );
    }
} 