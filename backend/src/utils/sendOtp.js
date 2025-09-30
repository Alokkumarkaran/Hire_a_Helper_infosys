import nodemailer from 'nodemailer';

export async function sendOtpEmail(to, code) {
  // Dev mode fallback
  if (!process.env.SMTP_HOST) {
    console.log('[DEV] OTP for', to, 'is', code);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == "465", // only true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const from = process.env.APP_FROM || "HireHelper <no-reply@hirehelper.app>";

  // Use a direct image URL instead of Google Drive share link
  const logoUrl = "https://drive.google.com/uc?export=view&id=1081Ndo1ENPTn-clDRqSWt365N3kFjlM4";

  const html = `
  <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 30px; text-align: center;">
    <div style="margin-bottom: 20px;">
      <img src="${logoUrl}" alt="Hire-a-Helper" style="height: 60px;">
    </div>
    <div style="background: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); max-width: 400px; margin: 0 auto;">
      <h2 style="color: #111827; margin-bottom: 15px;">Verify Your Account</h2>
      <p style="color: #4b5563; font-size: 15px;">Use the following One-Time Password (OTP) to complete your sign-in:</p>
      <div style="font-size: 32px; font-weight: bold; color: #2563EB; letter-spacing: 5px; margin: 20px 0;">
        ${code}
      </div>
      <p style="color: #6b7280; font-size: 13px;">This code will expire in 10 minutes. Do not share it with anyone.</p>
    </div>
    <p style="color: #9ca3af; font-size: 12px; margin-top: 25px;">
      © ${new Date().getFullYear()} Hire-a-Helper. All rights reserved.
    </p>
  </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: "Your Hire-a-Helper OTP",
      text: `Your OTP is ${code}`,
      html,
    });
    console.log("OTP email sent to", to);
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw new Error("Email delivery failed");
  }
}
