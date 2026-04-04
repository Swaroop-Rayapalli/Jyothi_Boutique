import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const feedbackFilePath = path.join(process.cwd(), 'lib', 'feedback.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'feedback');

async function getFeedback() {
    try {
        const fileContent = await fs.readFile(feedbackFilePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

async function saveFeedback(feedback: any[]) {
    await fs.writeFile(feedbackFilePath, JSON.stringify(feedback, null, 4), 'utf8');
}

async function ensureDir(dir: string) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

export async function GET() {
    try {
        const feedback = await getFeedback();
        return NextResponse.json(feedback);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ensureDir(UPLOADS_DIR);
        const formData = await request.formData();
        
        const name = formData.get('name') as string;
        const comment = formData.get('comment') as string;
        const rating = parseInt(formData.get('rating') as string) || 5;
        const isPublic = formData.get('isPublic') === 'true';
        
        const files = formData.getAll('images') as File[];
        const imageUrls: string[] = [];
        
        for (const file of files) {
            if (file && typeof file !== 'string' && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const extension = path.extname(file.name) || '.jpg';
                const fileName = `${crypto.randomUUID()}${extension}`;
                const filePath = path.join(UPLOADS_DIR, fileName);
                
                await fs.writeFile(filePath, buffer);
                imageUrls.push(`/uploads/feedback/${fileName}`);
            }
        }
        
        const feedback = await getFeedback();
        const newFeedback = {
            id: crypto.randomUUID(),
            name,
            comment,
            rating,
            images: imageUrls,
            isPublic,
            date: new Date().toISOString()
        };
        
        feedback.unshift(newFeedback);
        await saveFeedback(feedback);
        
        return NextResponse.json(newFeedback, { status: 201 });
    } catch (error) {
        console.error('Failed to create feedback:', error);
        return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, isPublic } = await request.json();
        const feedback = await getFeedback();
        
        const index = feedback.findIndex((f: any) => f.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
        }
        
        feedback[index].isPublic = isPublic;
        await saveFeedback(feedback);
        
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
        
        const feedback = await getFeedback();
        const filteredFeedback = feedback.filter((f: any) => f.id !== id);
        
        if (feedback.length === filteredFeedback.length) {
            return NextResponse.json({ error: 'Feedback not found' }, { status: 400 });
        }
        
        await saveFeedback(filteredFeedback);
        return NextResponse.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
    }
}

