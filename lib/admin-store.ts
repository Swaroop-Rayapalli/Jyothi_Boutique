import fs from 'fs/promises';
import path from 'path';

const ADMIN_FILE_PATH = path.join(process.cwd(), 'lib', 'admin.json');

export interface AdminData {
    email: string;
    password: string;
    username: string;
    profilePhoto?: string;
    tempPassword?: string | null;
    tempPasswordExpires?: number | null;
    otp?: string | null;
    otpExpires?: number | null;
}

export async function getAdminData(): Promise<AdminData> {
    try {
        const fileContent = await fs.readFile(ADMIN_FILE_PATH, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        // Fallback to default if file doesn't exist
        return {
            email: "jyothipaints15@gmail.com",
            password: "admin123",
            username: "Admin"
        };
    }
}

export async function saveAdminData(data: AdminData): Promise<void> {
    await fs.writeFile(ADMIN_FILE_PATH, JSON.stringify(data, null, 4), 'utf8');
}
