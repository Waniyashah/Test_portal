import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    // You can use standard SMTP settings here. 
    // Example for Gmail:
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password if using Gmail
    },
});

export const sendOTP = async (toEmail: string, otp: string) => {
    // If SMTP credentials aren't configured, just log and return success for demo purposes.
    // Otherwise nodemailer will throw an error immediately during dev without setup.
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP_USER or SMTP_PASS is missing in .env.local.');
        console.warn(`📩 Simulated Email to ${toEmail}: Your verification code is ${otp}`);
        return true;
    }

    try {
        const info = await transporter.sendMail({
            from: `"TestPortal" <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: 'Your Verification Code - TestPortal',
            text: `Your verification code is: ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #0ea5e9; padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">TestPortal</h1>
                    </div>
                    <div style="padding: 30px; background-color: white;">
                        <h2 style="color: #0f172a; margin-top: 0;">Verification Code</h2>
                        <p style="color: #475569; font-size: 16px; line-height: 1.5;">Please use the following 6-digit code to verify your account or login:</p>
                        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 15px; text-align: center; border-radius: 6px; margin: 25px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0ea5e9;">${otp}</span>
                        </div>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">This code is valid for a single use. Do not share it with anyone.</p>
                    </div>
                </div>
            `,
        });

        console.log(`Email sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
