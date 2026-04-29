import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
    try {
        const feedbacks = await prisma.feedback.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(feedbacks);
    } catch (error) {
        console.error('[Admin Feedback API] GET Failure:', error);
        return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        
        const name = formData.get('name') as string || 'Anonymous';
        const comment = formData.get('comment') as string || '';
        const rating = parseInt(formData.get('rating') as string) || 5;
        
        const files = formData.getAll('images') as File[];
        const imageUrls: string[] = [];
        
        for (const file of files) {
            if (file && typeof file !== 'string' && file.size > 0) {
                try {
                    const url = await uploadToCloudinary(file) as string;
                    imageUrls.push(url);
                } catch (imgErr) {
                    console.error('[Admin Feedback API] Image upload failed:', imgErr);
                }
            }
        }
        
        const newFeedback = await prisma.feedback.create({
            data: {
                name,
                comment,
                rating,
                images: imageUrls,
            }
        });
        
        return NextResponse.json(newFeedback, { status: 201 });
    } catch (error: any) {
        console.error('[Admin Feedback API] POST Failure:', error);
        return NextResponse.json({ error: 'Failed to create feedback', details: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { id, rating, comment, name } = await request.json();
        
        if (!id) {
            return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
        }
        
        const updatedFeedback = await prisma.feedback.update({
            where: { id },
            data: {
                rating,
                comment,
                name
            }
        });
        
        return NextResponse.json(updatedFeedback);
    } catch (error) {
        console.error('[Admin Feedback API] PUT Failure:', error);
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
        
        await prisma.feedback.delete({
            where: { id }
        });
        
        return NextResponse.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        console.error('[Admin Feedback API] DELETE Failure:', error);
        return NextResponse.json({ error: 'Failed to delete feedback' }, { status: 500 });
    }
}
