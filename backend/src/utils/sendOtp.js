import nodemailer from 'nodemailer';

export async function sendOtpEmail(to, code) {
  if (!process.env.SMTP_HOST) {
    console.log('[DEV] OTP for', to, 'is', code);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
   const from = process.env.APP_FROM || "HireHelper <no-reply@hirehelper.app>";

  const html = `
  <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 30px; text-align: center;">
    <!-- Logo -->
    <div style="margin-bottom: 20px;">
      <img src="https://drive.google.com/file/d/1081Ndo1ENPTn-clDRqSWt365N3kFjlM4/view?usp=sharing" alt="Hire-a-Helper" style="height: 60px;">
    </div>

    <!-- Card -->
    <div style="background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); max-width: 400px; margin: 0 auto;">
      <h2 style="color: #111827; margin-bottom: 15px;">Verify Your Account</h2>
      <p style="color: #4b5563; font-size: 15px;">Use the following One-Time Password (OTP) to complete your sign-in:</p>
      
      <div style="font-size: 32px; font-weight: bold; color: #2563EB; letter-spacing: 5px; margin: 20px 0;">
        ${code}
      </div>

      <p style="color: #6b7280; font-size: 13px;">This code will expire in 10 minutes. Do not share it with anyone.</p>
    </div>

    <!-- Footer -->
    <p style="color: #9ca3af; font-size: 12px; margin-top: 25px;">
      © ${new Date().getFullYear()} Hire-a-Helper. All rights reserved.
    </p>
  </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: "Your Hire-a-Helper OTP",
    text: `Your OTP is ${code}`,
    html,
  });
}
