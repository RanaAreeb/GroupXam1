export async function GET() {
    return new Response(JSON.stringify({ message: "DevTools endpoint" }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
} 