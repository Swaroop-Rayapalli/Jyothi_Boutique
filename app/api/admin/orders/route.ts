import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        
        // Map to expected format if needed
        const formattedOrders = orders.map((order: any) => ({
            ...order,
            customer: {
                name: order.customerName,
                email: order.customerEmail,
                phone: order.customerPhone,
                address: order.customerAddress,
            }
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { orderId, newStatus } = await request.json();
        
        if (!orderId || !newStatus) {
            return NextResponse.json({ error: 'Order ID and new status are required' }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus },
            include: { items: true },
        });

        // Send email to the client
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: order.customerEmail,
            subject: `Order Status Updated: ${order.id} - Jyothi Boutique`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #fbbf24; text-align: center;">Jyothi Boutique</h2>
                    <p>Dear ${order.customerName},</p>
                    <p>The status of your order <strong>${order.id}</strong> has been updated.</p>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 1.1rem; color: #1e293b;">New Status: <span style="font-weight: 800; text-transform: uppercase; color: #fbbf24;">${newStatus}</span></p>
                    </div>
                    <p><strong>Order Summary:</strong></p>
                    <ul style="list-style: none; padding: 0;">
                        ${order.items.map((item: any) => `
                            <li style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                                ${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                            </li>
                        `).join('')}
                    </ul>
                    <p style="font-size: 1.25rem; font-weight: 800; text-align: right; margin-top: 1rem;">Total: ₹${order.totalAmount.toLocaleString('en-IN')}</p>
                    <p style="margin-top: 2rem;">Thank you for shopping at Jyothi Boutique! If you have any questions, please reply to this email.</p>
                    <p style="font-size: 0.8rem; color: #94a3b8; text-align: center; margin-top: 2rem;">
                        Jyothi Boutique | Premium Paints & Thanjavur Art
                    </p>
                </div>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Failed to send status update email:', emailError);
        }

        return NextResponse.json({ success: true, message: 'Order status updated.', order });
    } catch (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
