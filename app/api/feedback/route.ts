import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { notifyAdmin } from '@/lib/mail';

const FEEDBACK_PATH = path.join(process.cwd(), 'lib', 'feedback.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'feedback');

// Ensure uploads directory exists
async function ensureDir(dir: string) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

export async function GET() {
    try {
        const data = await fs.readFile(FEEDBACK_PATH, 'utf-8');
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    console.log('[Feedback API] New submission request received.');
    try {
        // 1. Ensure folders exist
        try {
            await fs.mkdir(UPLOADS_DIR, { recursive: true });
            const libDir = path.dirname(FEEDBACK_PATH);
            await fs.mkdir(libDir, { recursive: true });
        } catch (dirError: any) {
            console.error('[Feedback API] Folder creation failed:', dirError.message);
        }
        
        // 2. Parse Form Data
        let formData;
        try {
            formData = await req.formData();
        } catch (formError: any) {
            console.error('[Feedback API] Form parsing failed:', formError.message);
            return NextResponse.json({ success: false, error: 'Could not parse form data', details: formError.message }, { status: 400 });
        }
        
        const name = formData.get('name') as string || 'Anonymous';
        const ratingRaw = formData.get('rating') as string;
        const rating = parseInt(ratingRaw) || 5;
        const comment = formData.get('comment') as string || '';
        const files = formData.getAll('images') as File[];
        
        console.log(`[Feedback API] Body: ${name}, Rating: ${rating}, Images: ${files.length}`);
        
        // 3. Process Images
        const imageUrls: string[] = [];
        for (const file of files) {
            if (file && file.size > 0) {
                try {
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const extension = path.extname(file.name) || '.jpg';
                    const fileName = `${crypto.randomUUID()}${extension}`;
                    const filePath = path.join(UPLOADS_DIR, fileName);
                    
                    await fs.writeFile(filePath, buffer);
                    imageUrls.push(`/uploads/feedback/${fileName}`);
                    console.log(`[Feedback API] Saved: ${fileName}`);
                } catch (fileWriteError: any) {
                    console.error('[Feedback API] Image write failed:', fileWriteError.message);
                    // Continue without this image instead of failing everything
                }
            }
        }
        
        // 4. Update JSON Storage
        const newFeedback = {
            id: crypto.randomUUID(),
            name,
            rating,
            comment,
            images: imageUrls,
            date: new Date().toISOString()
        };
        
        let feedbackList = [];
        try {
            const data = await fs.readFile(FEEDBACK_PATH, 'utf-8');
            if (data && data.trim()) {
                feedbackList = JSON.parse(data);
            }
        } catch (readError: any) {
            console.warn('[Feedback API] feedback.json read failed, starting with empty list.');
            feedbackList = [];
        }
        
        feedbackList.unshift(newFeedback);
        
        try {
            await fs.writeFile(FEEDBACK_PATH, JSON.stringify(feedbackList, null, 2));
            console.log('[Feedback API] feedback.json updated successfully.');
        } catch (writeError: any) {
            console.error('[Feedback API] CRITICAL: feedback.json write failed:', writeError.message);
            return NextResponse.json({ success: false, error: 'Storage write failed', details: writeError.message }, { status: 500 });
        }

        // 5. Async Notification (Silent)
        if (process.env.EMAIL_USER) {
            notifyAdmin(
                `New Feedback: ${name}`,
                `Name: ${name}\nRating: ${rating}/5\nComment: ${comment}`,
                `<h3>Feedback from Boutique</h3><p><b>Name:</b> ${name}</p><p><b>Rating:</b> ${rating}/5</p><p><b>Comment:</b> ${comment}</p>`
            ).catch(e => console.error('[Feedback API] Silent Email Error:', e.message));
        } else {
            console.warn('[Feedback API] Skipping email notification: EMAIL_USER not configured.');
        }
        
        return NextResponse.json({ success: true, feedback: newFeedback });
    } catch (globalError: any) {
        console.error('[Feedback API] GLOBAL FAILURE:', globalError);
        return NextResponse.json({ 
            success: false, 
            error: 'Feedback submission failed', 
            details: globalError.message 
        }, { status: 500 });
    }
}
