// STEP 1: Create Express app.
// STEP 2: Add CORS and JSON middleware.
// STEP 3: Add GET /health route.
// STEP 4: Mount /auth and /robots routers.
// STEP 5: Register global error handler.
import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import robotRouter from "./routes/robots.routes.js";
import globalErrorHandler from "./middleware/errorHandler.js";
import { checkDbConnection } from "./config/db.js";
import { seedData } from "./utils/seedData.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:5173",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
checkDbConnection();
app.use(morgan("dev"));
seedData(); // Seed initial data on startup (optional, can be removed in production)


app.use("/auth", authRouter);
app.use("/robots", robotRouter);




app.use(globalErrorHandler);

export default app;