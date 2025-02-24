import { config } from "dotenv";
config();

export const configBrevo = {
  BREVO: {
    SMTP_SERVER: "smtp.gmail.com",
    LOGIN: process.env.EMAIL_FROM || "",
    PASSWORD: process.env.APP_PASSWORD || "",
  },
  EMAIL_FROM: process.env.EMAIL_FROM || "no-reply@example.com",
};

export const configJwt = {
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refreshSecret",
};
