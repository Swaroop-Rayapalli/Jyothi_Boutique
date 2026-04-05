import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mail';
import { getAdminData, saveAdminData } from '@/lib/admin-store';

// Helper to generate a random alphanumeric password
function generateRandomPassword(length = 7) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        const adminData = await getAdminData();

        if (email !== adminData.email) {
            return NextResponse.json({ error: 'Email not recognized' }, { status: 404 });
        }

        // Generate a new temporary password
        const tempPassword = generateRandomPassword(7);
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Update the admin data with temporary password and expiry
        adminData.tempPassword = tempPassword;
        adminData.tempPasswordExpires = expiresAt;
        
        await saveAdminData(adminData);

        // Send the email using the centralized mail utility
        await sendEmail({
            to: adminData.email,
            subject: 'Admin Password Reset - Jyothi Boutique',
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #fbbf24; text-align: center;">Jyothi Boutique</h2>
                    <p>Hello Admin,</p>
                    <p>You have requested to reset your password. Your <strong>temporary password</strong> is shown below:</p>
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; color: #1e293b; margin: 20px 0;">
                        ${tempPassword}
                    </div>
                    <p style="color: #ef4444; font-weight: bold; text-align: center;">
                        This temporary password will expire in 5 minutes.
                    </p>
                    <p style="margin-top: 20px;">Please use this password to sign in. Once logged in, you can continue using your account or update your permanent password in the profile settings.</p>
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                        If you did not request this, you can safely ignore this email. Your current password remains unchanged.
                    </p>
                </div>
            `,
        });

        return NextResponse.json({ success: true, message: 'New password sent to your email' });
    } catch (error) {
        console.error('Failed to reset password:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
