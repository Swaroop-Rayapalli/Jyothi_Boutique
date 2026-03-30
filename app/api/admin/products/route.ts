import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const productsFilePath = path.join(process.cwd(), 'lib', 'products.json');

function getProducts() {
    const fileContent = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(fileContent);
}

function saveProducts(products: any[]) {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 4), 'utf8');
}

export async function GET() {
    try {
        const products = getProducts();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newProduct = await request.json();
        const products = getProducts();
        
        // Simple ID generation (find max and +1)
        const maxId = products.length > 0 ? Math.max(...products.map((p: any) => parseInt(p.id))) : 0;
        const productWithId = { ...newProduct, id: (maxId + 1).toString() };
        
        products.push(productWithId);
        saveProducts(products);
        
        return NextResponse.json(productWithId, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedProduct = await request.json();
        const products = getProducts();
        
        const index = products.findIndex((p: any) => p.id === updatedProduct.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        products[index] = { ...products[index], ...updatedProduct };
        saveProducts(products);
        
        return NextResponse.json(products[index]);
    } catch (error) {
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
        
        const products = getProducts();
        const filteredProducts = products.filter((p: any) => p.id !== id);
        
        if (products.length === filteredProducts.length) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        
        saveProducts(filteredProducts);
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
