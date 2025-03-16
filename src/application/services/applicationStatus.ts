import { configBrevo } from "../../config/ConfigSetup";
import { transporter } from "../services/OtpService";
import emailTemplate from "../../utils/email";

export const sendEmail = async (
  email: string,
  isTutor: boolean
): Promise<void> => {
  const mailOptions = {
    from: configBrevo.EMAIL_FROM,
    name: "Code Sphere",
    to: email,
    subject: "Your Tutor Application Status",
    html: emailTemplate(isTutor),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email", error);
    throw new Error("Unable to send email");
  }
};
