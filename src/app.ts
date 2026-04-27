import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import { notFound } from "./middlewares/notFound";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import authRoutes from "./modules/auth/auth.route";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

// middleware
app.use(notFound);
app.use(errorMiddleware);

export default app;
