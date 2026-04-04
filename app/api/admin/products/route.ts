import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const productsFilePath = path.join(process.cwd(), 'lib', 'products.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

async function getProducts() {
    try {
        const fileContent = await fs.readFile(productsFilePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

async function saveProducts(products: any[]) {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 4), 'utf8');
}

async function ensureDir(dir: string) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

export async function GET() {
    try {
        const products = await getProducts();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ensureDir(UPLOAD_DIR);
        const formData = await request.formData();
        
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string) || 0;
        const categoryId = formData.get('categoryId') as string;
        const isFeatured = formData.get('isFeatured') === 'true';
        const isComingSoon = formData.get('isComingSoon') === 'true';
        
        // Handle image files
        const files = formData.getAll('images') as File[];
        const imageUrls: string[] = [];
        
        // Also handle existing URLs (if any were passed as strings)
        const existingUrls = formData.getAll('existingImages') as string[];
        imageUrls.push(...existingUrls);

        for (const file of files) {
            if (file && typeof file !== 'string' && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const extension = path.extname(file.name) || '.jpg';
                const fileName = `${crypto.randomUUID()}${extension}`;
                const filePath = path.join(UPLOAD_DIR, fileName);
                
                await fs.writeFile(filePath, buffer);
                imageUrls.push(`/uploads/products/${fileName}`);
            }
        }

        const products = await getProducts();
        
        // Simple ID generation
        const maxId = products.length > 0 ? Math.max(...products.map((p: any) => parseInt(p.id) || 0)) : 0;
        const newProduct = {
            id: (maxId + 1).toString(),
            name,
            description,
            price,
            images: imageUrls,
            categoryId,
            isFeatured,
            isComingSoon
        };
        
        products.push(newProduct);
        await saveProducts(products);
        
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Failed to create product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await ensureDir(UPLOAD_DIR);
        const formData = await request.formData();
        
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const price = parseFloat(formData.get('price') as string) || 0;
        const categoryId = formData.get('categoryId') as string;
        const isFeatured = formData.get('isFeatured') === 'true';
        const isComingSoon = formData.get('isComingSoon') === 'true';
        
        const products = await getProducts();
        const index = products.findIndex((p: any) => p.id === id);
        
        if (index === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        // Handle images
        const imageUrls: string[] = [];
        
        // Keep existing images that were not removed
        const existingImages = formData.getAll('existingImages') as string[];
        imageUrls.push(...existingImages);
        
        // Add new uploaded images
        const files = formData.getAll('images') as File[];
        for (const file of files) {
            if (file && typeof file !== 'string' && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const extension = path.extname(file.name) || '.jpg';
                const fileName = `${crypto.randomUUID()}${extension}`;
                const filePath = path.join(UPLOAD_DIR, fileName);
                
                await fs.writeFile(filePath, buffer);
                imageUrls.push(`/uploads/products/${fileName}`);
            }
        }
        
        products[index] = {
            ...products[index],
            name,
            description,
            price,
            images: imageUrls,
            categoryId,
            isFeatured,
            isComingSoon
        };
        
        await saveProducts(products);
        
        return NextResponse.json(products[index]);
    } catch (error) {
        console.error('Failed to update product:', error);
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }
        
        const products = await getProducts();
        const filteredProducts = products.filter((p: any) => p.id !== id);
        
        if (products.length === filteredProducts.length) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        await saveProducts(filteredProducts);
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

