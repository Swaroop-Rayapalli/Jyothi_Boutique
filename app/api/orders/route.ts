import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFilePath = path.join(process.cwd(), 'lib', 'orders.json');

function getOrders() {
    if (!fs.existsSync(ordersFilePath)) {
        fs.writeFileSync(ordersFilePath, '[]', 'utf8');
        return [];
    }
    const fileContent = fs.readFileSync(ordersFilePath, 'utf8');
    return JSON.parse(fileContent);
}

function saveOrders(orders: any[]) {
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 4), 'utf8');
}

interface OrderItemRequest {
    productId: string;
    quantity: number;
    price: number;
}

interface OrderRequestBody {
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    items: OrderItemRequest[];
    totalAmount: number;
    deliveryAddress: string;
}

export async function POST(req: Request) {
    try {
        const body: OrderRequestBody = await req.json();
        const orders = getOrders();

        const newOrder = {
            id: 'ord_' + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            status: 'pending',
            ...body
        };

        orders.push(newOrder);
        saveOrders(orders);

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error('API Orders POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
