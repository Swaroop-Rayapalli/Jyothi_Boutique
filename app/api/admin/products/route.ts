import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

// ─── GET — list all products ──────────────────────────────────────────────────
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('GET /api/admin/products error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// ─── POST — create product ────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const name         = formData.get('name')         as string;
        const description  = formData.get('description')  as string;
        const price        = parseFloat(formData.get('price') as string) || 0;
        const categoryId   = formData.get('categoryId')   as string;
        const isFeatured   = formData.get('isFeatured')   === 'true';
        const isComingSoon = formData.get('isComingSoon')  === 'true';

        // Retain any existing Cloudinary URLs sent back from the client
        const existingUrls = formData.getAll('existingImages') as string[];

        // Upload new files to Cloudinary
        const files = formData.getAll('images') as File[];
        const uploadedUrls: string[] = [];
        for (const file of files) {
            if (file && typeof file !== 'string' && file.size > 0) {
                const url = await uploadToCloudinary(file, 'jyothi-boutique/products');
                uploadedUrls.push(url);
            }
        }

        const images = [...existingUrls, ...uploadedUrls];

        const product = await prisma.product.create({
            data: { name, description, price, images, categoryId, isFeatured, isComingSoon },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('POST /api/admin/products error:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

// ─── PUT — update product ─────────────────────────────────────────────────────
export async function PUT(request: Request) {
    try {
        const formData = await request.formData();

        const id           = formData.get('id')           as string;
        const name         = formData.get('name')         as string;
        const description  = formData.get('description')  as string;
        const price        = parseFloat(formData.get('price') as string) || 0;
        const categoryId   = formData.get('categoryId')   as string;
        const isFeatured   = formData.get('isFeatured')   === 'true';
        const isComingSoon = formData.get('isComingSoon')  === 'true';

        const existingImages = formData.getAll('existingImages') as string[];

        const files = formData.getAll('images') as File[];
        const uploadedUrls: string[] = [];
        for (const file of files) {
            if (file && typeof file !== 'string' && file.size > 0) {
                const url = await uploadToCloudinary(file, 'jyothi-boutique/products');
                uploadedUrls.push(url);
            }
        }

        const images = [...existingImages, ...uploadedUrls];

        const product = await prisma.product.update({
            where: { id },
            data: { name, description, price, images, categoryId, isFeatured, isComingSoon },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('PUT /api/admin/products error:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// ─── DELETE — remove product ──────────────────────────────────────────────────
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('DELETE /api/admin/products error:', error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
