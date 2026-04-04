import { NextResponse } from 'next/server';
import { getAdminData, saveAdminData } from '@/lib/admin-store';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null);
        if (!body) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { oldPassword, newPassword } = body;
        const adminData = await getAdminData();

        // Check if the current password is valid (either permanent or temporary)
        const isPermanentMatch = oldPassword === adminData.password;
        const isTempMatch = adminData.tempPassword && 
                           oldPassword === adminData.tempPassword && 
                           adminData.tempPasswordExpires && 
                           Date.now() < adminData.tempPasswordExpires;

        if (!isPermanentMatch && !isTempMatch) {
            return NextResponse.json({ error: 'Current password is incorrect or has expired' }, { status: 401 });
        }

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        // Update permanent password and clear temporary ones
        adminData.password = newPassword;
        adminData.tempPassword = null;
        adminData.tempPasswordExpires = null;

        await saveAdminData(adminData);

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error: any) {
        console.error('Password change error:', error);
        return NextResponse.json({ 
            error: 'Internal server error during password update',
            details: error.message 
        }, { status: 500 });
    }
}
