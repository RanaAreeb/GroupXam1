export async function GET() {
    // Return environment variables (only non-sensitive ones)
    const env = {
        MONGODB_URI: process.env.MONGODB_URI ? "***configured***" : null,
        JWT_SECRET: process.env.JWT_SECRET ? "***configured***" : null,
        GMAIL_ADDRESS: process.env.GMAIL_ADDRESS ? "***configured***" : null,
        GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD ? "***configured***" : null,
        CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL ? "***configured***" : null,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || null,
    };

    return new Response(JSON.stringify({
        message: "DevTools endpoint",
        env: env
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
} 