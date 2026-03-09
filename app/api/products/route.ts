import { NextResponse } from 'next/server';
import { products } from '@/lib/data';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get('category');
    const featuredParam = searchParams.get('featured');

    try {
        let filteredProducts = products;

        if (categoryParam) {
            filteredProducts = filteredProducts.filter(p => p.category?.slug === categoryParam);
        }
        if (featuredParam === 'true') {
            filteredProducts = filteredProducts.filter(p => p.isFeatured);
        }

        return NextResponse.json(filteredProducts);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
