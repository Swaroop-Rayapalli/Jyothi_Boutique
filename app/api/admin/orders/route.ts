import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'lib', 'orders.json');

export async function GET() {
    try {
        if (!fs.existsSync(ordersFilePath)) {
            return NextResponse.json([]);
        }
        const fileContent = fs.readFileSync(ordersFilePath, 'utf8');
        const orders = JSON.parse(fileContent);
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
