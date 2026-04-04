import { NextResponse } from 'next/server';
import { getAdminData, saveAdminData } from '@/lib/admin-store';

export async function POST(request: Request) {
    try {
        const { oldPassword, newPassword } = await request.json();
        const adminData = await getAdminData();

        if (oldPassword !== adminData.password) {
            return NextResponse.json({ error: 'Old password is incorrect' }, { status: 401 });
        }

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        // Update password
        adminData.password = newPassword;
        await saveAdminData(adminData);

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}
