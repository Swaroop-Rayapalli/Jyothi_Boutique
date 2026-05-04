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

        let dbProducts = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        // Fallback: If featured products requested but none found, return latest 4 products
        if (featuredParam === 'true' && dbProducts.length === 0) {
            dbProducts = await prisma.product.findMany({
                orderBy: { createdAt: 'desc' },
                take: 4
            });
        }

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
