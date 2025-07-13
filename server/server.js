import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import { PORT } from "./config/envVars.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import aiRouter from "./routes/ai.route.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";

const app = express();

await connectCloudinary();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(requireAuth());
app.use("/api/ai", aiRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
