import { config } from "dotenv";
config();

export const configBrevo = {
  BREVO: {
    SMTP_SERVER: process.env.BREVO_SMTP_SERVER || "",
    PORT: parseInt(process.env.BREVO_PORT || "587", 10),
    LOGIN: process.env.EMAIL_FROM || "",
    PASSWORD: process.env.BREVO_PASSWORD || "",
  },
  EMAIL_FROM: process.env.EMAIL_FROM || "no-reply@example.com",
};

export const configJwt = {
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refreshSecret",
};
