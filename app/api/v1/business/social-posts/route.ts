import { NextResponse } from 'next/server';

// Simple in-memory storage for demonstration
let posts: any[] = [];

export async function GET() {
    return NextResponse.json({
        success: true,
        data: posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, mediaUrl, type } = body;

        // Validation
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const newPost = {
            id: Date.now().toString(),
            content,
            mediaUrl,
            type: type || 'post',
            createdAt: new Date().toISOString()
        };

        // Save to in-memory store
        posts.push(newPost);
        console.log(`[API] Creating Social Post: ${type} - "${content}"`);

        return NextResponse.json({
            success: true,
            message: "Social post created successfully",
            data: newPost
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
