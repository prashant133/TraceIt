import dotenv from "dotenv";

dotenv.config();

const {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  NODE_ENV,
} = process.env;

if (
  !PORT ||
  !DB_HOST ||
  !DB_PORT ||
  !DB_USERNAME ||
  !DB_PASSWORD ||
  !DB_NAME ||
  !MAIL_HOST ||
  !MAIL_PORT ||
  !MAIL_USER ||
  !MAIL_PASS ||
  !JWT_ACCESS_SECRET ||
  !JWT_REFRESH_SECRET  ||
  !NODE_ENV
) {
  throw new Error("Missing required environment variables");
}

export const env = {
  PORT,
  DB_HOST,
  DB_PORT: Number(DB_PORT) || 5432,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  NODE_ENV,
};
