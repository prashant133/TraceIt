import "reflect-metadata";
import express from "express";
import * as dotenv from "dotenv";
import { notFound } from "./middlewares/notFound";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.route";
import otpRoutes from "./modules/otp/otp.route";
import shoeRoutes from "./modules/shoe/shoe.route";
import purchaseRoutes from "./modules/purchase/purchase.route";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/shoe", shoeRoutes);
app.use("/api/purchase", purchaseRoutes);

// middleware
app.use(notFound);
app.use(errorMiddleware);

export default app;
