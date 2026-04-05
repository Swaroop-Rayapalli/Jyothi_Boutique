import { NextResponse } from 'next/server';
import { notifyAdmin } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Use the centralized mail utility to notify the admin
        try {
            await notifyAdmin(
                `Contact Form Message from Jyothi Boutique: ${subject}`,
                `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
                `,
                `
<h3>Contact Form Message from Jyothi Boutique</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject}</p>
<br/>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br/>')}</p>
                `
            );
            console.log('Contact form submission notification sent successfully.');
        } catch (mailError) {
            console.error('Contact form email notification failed, but request will succeed:', mailError);
            // We don't throw here so the user gets a success message
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        // Detailed error logging is already handled in lib/mail.ts
        console.error('Contact form API error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to send message. Please try again later.' 
        }, { status: 500 });
    }
}
