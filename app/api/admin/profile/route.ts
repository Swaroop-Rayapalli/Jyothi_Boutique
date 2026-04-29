import { NextResponse } from 'next/server';
import { getAdminData, saveAdminData } from '@/lib/admin-store';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
    try {
        const adminData = await getAdminData();
        const { password, tempPassword, tempPasswordExpires, otp, otpExpires, ...publicData } = adminData;
        return NextResponse.json(publicData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        
        const username = formData.get('username') as string;
        const photoFile = formData.get('profilePhoto') as File | null;
        
        const adminData = await getAdminData();
        
        if (username) {
            adminData.username = username;
        }

        if (photoFile && typeof photoFile !== 'string' && photoFile.size > 0) {
            try {
                const photoUrl = await uploadToCloudinary(photoFile) as string;
                adminData.profilePhoto = photoUrl;
                console.log('[Profile API] Photo uploaded to Cloudinary:', photoUrl);
            } catch (uploadErr: any) {
                console.error('[Profile API] Cloudinary upload failed:', uploadErr.message);
                // Still save the username update even if photo fails
            }
        }

        await saveAdminData(adminData);
        
        const { password, tempPassword, tempPasswordExpires, otp, otpExpires, ...publicData } = adminData;
        return NextResponse.json(publicData);
    } catch (error: any) {
        console.error('[Profile API] Failed to update profile:', error);
        return NextResponse.json({ error: 'Failed to update profile', details: error.message }, { status: 500 });
    }
}
