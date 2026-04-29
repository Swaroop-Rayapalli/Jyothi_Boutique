import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { categories } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category');
    const featuredParam = searchParams.get('featured');

    try {
        const where: any = {};
        if (categoryParam) where.categoryId = categoryParam;
        if (featuredParam === 'true') where.isFeatured = true;

        const dbProducts = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        // Attach category object so existing frontend code keeps working
        const products = dbProducts.map(p => ({
            ...p,
            category: categories.find(c => c.id === p.categoryId),
        }));

        return NextResponse.json(products);
    } catch (err) {
        console.error('GET /api/products error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
