import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('API Categories GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, slug } = body;
        if (!name || !slug) return NextResponse.json({ error: 'Name and slug required' }, { status: 400 });
        const category = await prisma.category.create({ data: { name, description, slug } });
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
