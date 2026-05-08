import { NextResponse } from 'next/server';
// Updated to use Prisma for Order persistence
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customer, items, totalAmount } = body;

        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const newOrder = await prisma.order.create({
            data: {
                id: orderId,
                status: 'pending',
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                customerAddress: customer.address,
                totalAmount: totalAmount,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error('API Orders POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
