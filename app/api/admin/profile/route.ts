import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { getAdminData, saveAdminData } from '@/lib/admin-store';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'profile');

async function ensureDir(dir: string) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

export async function GET() {
    try {
        const adminData = await getAdminData();
        // Don't send sensitive info
        const { password, tempPassword, tempPasswordExpires, otp, otpExpires, ...publicData } = adminData;
        return NextResponse.json(publicData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ensureDir(UPLOAD_DIR);
        const formData = await request.formData();
        
        const username = formData.get('username') as string;
        const photoFile = formData.get('profilePhoto') as File | null;
        
        const adminData = await getAdminData();
        
        if (username) {
            adminData.username = username;
        }

        if (photoFile && typeof photoFile !== 'string' && photoFile.size > 0) {
            const buffer = Buffer.from(await photoFile.arrayBuffer());
            const extension = path.extname(photoFile.name) || '.jpg';
            const fileName = `admin-profile-${crypto.randomUUID().slice(0, 8)}${extension}`;
            const filePath = path.join(UPLOAD_DIR, fileName);
            
            // Delete old photo if it exists and is in the uploads folder
            if (adminData.profilePhoto && adminData.profilePhoto.startsWith('/uploads/profile/')) {
                const oldPath = path.join(process.cwd(), 'public', adminData.profilePhoto);
                try {
                    await fs.unlink(oldPath);
                } catch (e) {
                    // Ignore if file doesn't exist
                }
            }

            await fs.writeFile(filePath, buffer);
            adminData.profilePhoto = `/uploads/profile/${fileName}`;
        }

        await saveAdminData(adminData);
        
        const { password, tempPassword, tempPasswordExpires, otp, otpExpires, ...publicData } = adminData;
        return NextResponse.json(publicData);
    } catch (error) {
        console.error('Failed to update profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
