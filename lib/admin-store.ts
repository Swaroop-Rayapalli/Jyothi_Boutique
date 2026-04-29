import prisma from './prisma';

export interface AdminData {
    email: string;
    password: string;
    username: string;
    profilePhoto?: string | null;
    tempPassword?: string | null;
    tempPasswordExpires?: number | null;
    otp?: string | null;
    otpExpires?: number | null;
}

export async function getAdminData(): Promise<AdminData> {
    try {
        const admin = await prisma.admin.findFirst();
        
        if (admin) {
            return {
                email: admin.email,
                password: admin.password,
                username: admin.username,
                profilePhoto: admin.profilePhoto,
                tempPassword: admin.tempPassword,
                tempPasswordExpires: admin.tempPasswordExpires,
                otp: admin.otp,
                otpExpires: admin.otpExpires,
            };
        }

        // Fallback to default if no admin exists in the database
        return {
            email: "jyothipaints15@gmail.com",
            password: "admin123",
            username: "Admin"
        };
    } catch (error) {
        console.error('[Admin Store] Error fetching admin data:', error);
        return {
            email: "jyothipaints15@gmail.com",
            password: "admin123",
            username: "Admin"
        };
    }
}

export async function saveAdminData(data: AdminData): Promise<void> {
    try {
        const admin = await prisma.admin.findFirst();

        if (admin) {
            await prisma.admin.update({
                where: { id: admin.id },
                data: {
                    email: data.email,
                    password: data.password,
                    username: data.username,
                    profilePhoto: data.profilePhoto || null,
                    tempPassword: data.tempPassword || null,
                    tempPasswordExpires: data.tempPasswordExpires || null,
                    otp: data.otp || null,
                    otpExpires: data.otpExpires || null,
                }
            });
        } else {
            await prisma.admin.create({
                data: {
                    email: data.email,
                    password: data.password,
                    username: data.username,
                    profilePhoto: data.profilePhoto || null,
                    tempPassword: data.tempPassword || null,
                    tempPasswordExpires: data.tempPasswordExpires || null,
                    otp: data.otp || null,
                    otpExpires: data.otpExpires || null,
                }
            });
        }
    } catch (error) {
        console.error('[Admin Store] Error saving admin data:', error);
        throw error;
    }
}
