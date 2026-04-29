import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminData } from '@/lib/admin-store';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const adminData = await getAdminData();

        const isMainPassword = password === adminData.password;
        const isTempPassword = adminData.tempPassword && 
                              password === adminData.tempPassword &&
                              adminData.tempPasswordExpires && 
                              adminData.tempPasswordExpires > Date.now();

        if (email === adminData.email && (isMainPassword || isTempPassword)) {
            // Set secure HTTP-only cookie
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            return NextResponse.json({ success: true, message: 'Login successful' });
        } else {
            const errorMsg = (adminData.tempPassword && password === adminData.tempPassword && adminData.tempPasswordExpires && adminData.tempPasswordExpires <= Date.now())
                ? 'Temporary password has expired'
                : 'Invalid credentials';
            return NextResponse.json({ error: errorMsg }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
