import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

        const order = await prisma.order.create({
            data: {
                customerName: body.customer.name,
                customerEmail: body.customer.email,
                customerPhone: body.customer.phone,
                totalAmount: body.totalAmount,
                deliveryAddress: body.deliveryAddress,
                items: {
                    create: body.items.map(item => ({
                        product: { connect: { id: item.productId } },
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('API Orders POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
