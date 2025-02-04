import { config } from "dotenv";
config();

export const configBrevo = {
  GMAIL: {
    USER: process.env.GMAIL_USER,
    CLIENT_ID: process.env.GMAIL_CLIENT_ID,
    CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
    REDIRECT_URI: "https://developers.google.com/oauthplayground",
    REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,
  },
  EMAIL_FROM: process.env.GMAIL_USER,
};

export const configJwt = {
  jwtSecret: process.env.JWT_SECRET || "secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "refreshSecret",
};
