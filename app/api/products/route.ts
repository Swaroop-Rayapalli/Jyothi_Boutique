import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category');
    const featuredParam = searchParams.get('featured');

    try {
        const where: any = {};
        if (categoryParam) {
            where.category = { slug: categoryParam };
        }
        if (featuredParam === 'true') {
            where.isFeatured = true;
        }

        const productsList = await prisma.product.findMany({
            where,
            include: { category: true }
        });

        const products = productsList.map((product) => ({
            ...product,
            images: JSON.parse(product.images as string),
            specifications: product.specifications ? JSON.parse(product.specifications as string) : {}
        }));

        return NextResponse.json(products);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
