import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY,
  GEMINI_API_KEY,
  CLIPDROP_API_KEY,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} = process.env;
