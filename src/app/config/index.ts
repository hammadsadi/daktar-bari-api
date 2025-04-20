import dotenv from "dotenv";
import path from "path";

// Config
dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  JWT: {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    FORGOT_PASSWORD_TOKEN: process.env.FORGOT_PASSWORD_TOKEN,
    FORGOT_PASSWORD_TOKEN_EXPIRE_IN:
      process.env.FORGOT_PASSWORD_TOKEN_EXPIRE_IN,
  },
  CLIENT_API_BASE_URL: process.env.CLIENT_API_BASE_URL,
  SEND_EMAIL: {
    APP_PASS: process.env.APP_PASS,
    EMAIL: process.env.EMAIL,
  },
};
