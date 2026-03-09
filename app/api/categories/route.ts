import { NextResponse } from 'next/server';
import { categories } from '@/lib/data';

export async function GET() {
    try {
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

        // Mocking database creation
        const category = { id: 'cat_' + Math.random().toString(36).substr(2, 9), name, description, slug };

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
