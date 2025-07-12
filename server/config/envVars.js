import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY,
} = process.env;
