import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { notifyAdmin } from '@/lib/mail';

export async function GET() {
    try {
        const feedbacks = await prisma.feedback.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(feedbacks);
    } catch (error) {
        console.error('[Feedback API] GET Failure:', error);
        return NextResponse.json([]);
    }
}

export async function POST(req: Request) {
    console.log('[Feedback API] New submission request received.');
    try {
        const formData = await req.formData();
        
        const name = formData.get('name') as string || 'Anonymous';
        const rating = parseInt(formData.get('rating') as string) || 5;
        const comment = formData.get('comment') as string || '';
        const files = formData.getAll('images') as File[];
        
        console.log(`[Feedback API] Payload: Name="${name}", Rating=${rating}, ImagesCount=${files.length}`);
        
        // 1. Process Images with Cloudinary
        const imageUrls: string[] = [];
        console.log(`[Feedback API] Starting image processing for ${files.length} files.`);
        
        for (const file of files) {
            if (file && typeof file !== 'string' && file.size > 0) {
                try {
                    // Fallback check for Cloudinary config
                    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
                    if (!cloudName || cloudName === 'your_cloud_name') {
                        console.error('[Feedback API] IMAGE SKIPPED: Cloudinary not configured (placeholder credentials found).');
                        continue;
                    }
                    
                    console.log(`[Feedback API] Uploading ${file.name} to Cloudinary...`);
                    const url = await uploadToCloudinary(file) as string;
                    imageUrls.push(url);
                    console.log(`[Feedback API] Upload SUCCESS: ${url}`);
                } catch (fileWriteError: any) {
                    console.error(`[Feedback API] Upload FAILED for ${file.name}:`, fileWriteError.message);
                }
            } else {
                console.log(`[Feedback API] Skipping empty or invalid file object.`, { type: typeof file, size: (file as any)?.size });
            }
        }
        
        // 2. Save to Database using Prisma
        const newFeedback = await prisma.feedback.create({
            data: {
                name,
                rating,
                comment,
                images: imageUrls,
            }
        });
        
        console.log('[Feedback API] Record saved to database.');

        // 3. Async Notification (Silent)
        if (process.env.EMAIL_USER) {
            notifyAdmin(
                `New Feedback: ${name}`,
                `Name: ${name}\nRating: ${rating}/5\nComment: ${comment}`,
                `<h3>Feedback from Boutique</h3><p><b>Name:</b> ${name}</p><p><b>Rating:</b> ${rating}/5</p><p><b>Comment:</b> ${comment}</p>`
            ).catch(e => console.error('[Feedback API] Silent Email Error:', e.message));
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
