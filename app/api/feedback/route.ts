import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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
    try {
        await ensureDir(UPLOADS_DIR);
        const formData = await req.formData();
        
        const name = formData.get('name') as string;
        const rating = parseInt(formData.get('rating') as string) || 5;
        const comment = formData.get('comment') as string;
        const files = formData.getAll('images') as File[];
        
        const imageUrls: string[] = [];
        
        for (const file of files) {
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const extension = path.extname(file.name) || '.jpg';
                const fileName = `${crypto.randomUUID()}${extension}`;
                const filePath = path.join(UPLOADS_DIR, fileName);
                
                await fs.writeFile(filePath, buffer);
                imageUrls.push(`/uploads/feedback/${fileName}`);
            }
        }
        
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
            feedbackList = JSON.parse(data);
        } catch (e) {}
        
        feedbackList.unshift(newFeedback); // Newest first
        await fs.writeFile(FEEDBACK_PATH, JSON.stringify(feedbackList, null, 2));

        // --- Email Notification to Admin ---
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                secure: process.env.EMAIL_PORT === '465',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: 'pawcare376@gmail.com',
                subject: `New Feedback Received: ${name}`,
                text: `
Name: ${name}
Rating: ${rating}/5
Comment: ${comment}
Date: ${new Date().toLocaleString()}
                `,
                html: `
<h3>New Feedback Received from Jyothi Boutique</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Rating:</strong> ${rating}/5</p>
<p><strong>Comment:</strong> ${comment}</p>
<p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                `,
            };

            await transporter.sendMail(mailOptions);
            console.log('Feedback notification sent to admin.');
        } catch (emailError) {
            console.error('Failed to send feedback email notification:', emailError);
            // We don't fail the entire request if email fails, as feedback is already saved
        }
        // ------------------------------------
        
        return NextResponse.json({ success: true, feedback: newFeedback });
    } catch (error) {
        console.error('Feedback submission error:', error);
        return NextResponse.json({ success: false, error: 'Failed to submit feedback' }, { status: 500 });
    }
}
