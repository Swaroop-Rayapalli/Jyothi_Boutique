import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { id, type, prevType } = await req.json();

        if (!id || !['like', 'dislike', 'none'].includes(type)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const data: any = {};

        // Adjust counts based on current and previous action
        if (type === 'like') {
            data.likes = { increment: 1 };
        } else if (type === 'dislike') {
            data.dislikes = { increment: 1 };
        }

        if (prevType === 'like') {
            data.likes = { ...data.likes, decrement: 1 };
        } else if (prevType === 'dislike') {
            data.dislikes = { ...data.dislikes, decrement: 1 };
        }

        // Optimization: If multiple operations on the same field, Prisma might complain if not careful
        // Actually, we can just calculate the net change
        let likesChange = 0;
        let dislikesChange = 0;

        if (type === 'like') likesChange += 1;
        if (type === 'dislike') dislikesChange += 1;
        if (prevType === 'like') likesChange -= 1;
        if (prevType === 'dislike') dislikesChange -= 1;

        const updatedFeedback = await prisma.feedback.update({
            where: { id },
            data: {
                likes: { increment: likesChange },
                dislikes: { increment: dislikesChange }
            }
        });

        return NextResponse.json({ success: true, likes: updatedFeedback.likes, dislikes: updatedFeedback.dislikes });
    } catch (error: any) {
        console.error('[Feedback React API] Failure:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
