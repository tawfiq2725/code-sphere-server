import nodemailer from "nodemailer";
import { configBrevo } from "../../config/ConfigSetup";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: configBrevo.BREVO.LOGIN,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const mailOptions = {
    from: configBrevo.EMAIL_FROM,
    name: "Code Sphere",
    to: email,
    subject: "Your OTP Code",
    html: `
      <html>
        <body>
          <h2>Hi there!</h2>
          <p>We received a request to verify your account. To complete the verification, click the button below to view your OTP.</p>
          <p>If you didn't request this, please ignore this email.</p>
          
          <!-- CTA Button to Reveal OTP -->
          <h1>OTP : ${otp}</h1>
          
          <p style="margin-top: 20px; font-size: 12px; color: #777;">This email was sent from your account at <strong>code-sphere</strong>.</p>
        </body>
      </html>
    `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending OTP email", error);
    throw new Error("Unable to send OTP email");
  }
};
