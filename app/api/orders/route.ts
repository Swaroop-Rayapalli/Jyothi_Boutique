import { NextResponse } from 'next/server';

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

        // Simulate successful order creation and return a mock ID
        const mockOrder = {
            id: 'ord_' + Math.random().toString(36).substr(2, 9),
            ...body
        };

        return NextResponse.json(mockOrder);
    } catch (error) {
        console.error('API Orders POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
