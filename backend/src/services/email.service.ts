import nodemailer from 'nodemailer';

// Create reusable transporter (configure with your email service)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendOTPEmail = async (email: string, otp: string) => {
    try {
        const mailOptions = {
            from: `"ChargerBNB" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Your ChargerBNB Verification Code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B35;">ChargerBNB Email Verification</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #FF6B35;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">ChargerBNB - India's #1 EV Charging Network</p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
