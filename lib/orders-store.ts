import fs from 'fs/promises';
import path from 'path';

const ORDERS_FILE_PATH = path.join(process.cwd(), 'lib', 'orders.json');

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Customer {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface Order {
    id: string;
    createdAt: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: OrderItem[];
    customer: Customer;
    totalAmount: number;
}

export async function getOrders(): Promise<Order[]> {
    try {
        const fileContent = await fs.readFile(ORDERS_FILE_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

export async function saveOrders(orders: Order[]): Promise<void> {
    await fs.writeFile(ORDERS_FILE_PATH, JSON.stringify(orders, null, 4), 'utf8');
}
