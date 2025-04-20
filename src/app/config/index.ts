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
  },
};
