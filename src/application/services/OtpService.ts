import nodemailer from "nodemailer";
import { google } from "googleapis";
import { configBrevo } from "../../config/ConfigSetup";

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, USER } =
  configBrevo.GMAIL;

// Create OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token || "",
      },
    });

    const mailOptions = {
      from: `"Code Sphere" <${USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <html>
          <body>
            <h2>Hi there!</h2>
            <p>We received a request to verify your account. To complete the verification, click the button below to view your OTP.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br/>
            <h1>OTP : ${otp}</h1>
            
            <p style="margin-top: 20px; font-size: 12px; color: #777;">This email was sent from your account at <strong>Code Sphere</strong>.</p>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email", error);
    throw new Error("Unable to send OTP email");
  }
};
