import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
const config = {
    DB_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || 4000,
    APP_URL: process.env.APP_URL,
    APP_LIVE_URL: process.env.APP_LIVE_URL,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    JWT_SECRET: process.env.JWT_SECRET,
    SEND_EMAIL: process.env.SEND_EMAIL,
};
export default config;
