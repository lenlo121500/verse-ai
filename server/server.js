import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { PORT } from "./config/envVars.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";

const app = express();

app.use(cors());
app.use(clerkMiddleware());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(requireAuth());

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
