import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const feedbackFilePath = path.join(process.cwd(), 'lib', 'feedback.json');

function getFeedback() {
    const fileContent = fs.readFileSync(feedbackFilePath, 'utf8');
    return JSON.parse(fileContent);
}

function saveFeedback(feedback: any[]) {
    fs.writeFileSync(feedbackFilePath, JSON.stringify(feedback, null, 4), 'utf8');
}

export async function GET() {
    try {
        const feedback = getFeedback();
        return NextResponse.json(feedback);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, isPublic } = await request.json();
        const feedback = getFeedback();
        
        const index = feedback.findIndex((f: any) => f.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }
        
        feedback[index].isPublic = isPublic;
        saveFeedback(feedback);
        
        return NextResponse.json(feedback[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update feedback' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
        }
        
        const feedback = getFeedback();
        const filteredFeedback = feedback.filter((f: any) => f.id !== id);
        
        if (feedback.length === filteredFeedback.length) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 400 });
        }
        
        saveFeedback(filteredFeedback);
        return NextResponse.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
    }
}
