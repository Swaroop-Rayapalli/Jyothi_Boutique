import { NextResponse } from 'next/server';
import { products } from '@/lib/data';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const product = products.find(p => p.id === id);

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('API Product GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
