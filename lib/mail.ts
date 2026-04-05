import nodemailer from 'nodemailer';

/**
 * Shared email utility for Jyothi Boutique.
 * Uses environment variables for configuration.
 */

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    // Gmail port 587 requires TLS
    tls: {
        rejectUnauthorized: false, // Helps with some hosting environments
        minVersion: 'TLSv1.2'
    }
});

interface MailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
}

/**
 * Sends an email using the configured transporter.
 * @param options Mail options including to, subject, body, etc.
 * @returns Promise resolving to the sent message info.
 */
export async function sendEmail(options: MailOptions) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        ...options,
    };

    try {
        console.log(`[Mail] Attempting to send email to: ${options.to} (Subject: ${options.subject})`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Mail] Success: Message sent: ${info.messageId}`);
        return { success: true, info };
    } catch (error) {
        console.error('[Mail] Critical Error: Failed to send email:', error);
        // We throw so the API route can decide how to handle it
        throw error;
    }
}

/**
 * Helper for admin notifications.
 * Sends an email to the configured EMAIL_USER.
 */
export async function notifyAdmin(subject: string, text: string, html: string) {
    return sendEmail({
        to: process.env.EMAIL_USER!,
        subject,
        text,
        html
    });
}
