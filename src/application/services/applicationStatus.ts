import { configBrevo } from "../../config/ConfigSetup";
import { transporter } from "./OtpService";
import emailTemplate from "../../utils/email";

export const sendEmail = async (
  email: string,
  isTutor: boolean
): Promise<void> => {
  console.log(
    "checkingggg and email will send.........................................................................."
  );
  console.log(`Email sent to ${email}`);

  const mailOptions = {
    from: configBrevo.EMAIL_FROM,
    name: "Code Sphere",
    to: email,
    subject: "Your Tutor Application Status",
    html: emailTemplate(isTutor),
  };
  console.log(
    "checllllllllllllllllllllllllllllllllllllllllllllllllllllllll",
    mailOptions
  );

  try {
    console.log("checkingggg and email will send");
    let chcek = await transporter.sendMail(mailOptions);
    console.log("checkingggg and email sent", chcek);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email", error);
    throw new Error("Unable to send email");
  }
};
