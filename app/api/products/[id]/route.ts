import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { categories } from '@/lib/data';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({ where: { id } });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...product,
            category: categories.find(c => c.id === product.categoryId),
        });
    } catch (error) {
        console.error('GET /api/products/[id] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
