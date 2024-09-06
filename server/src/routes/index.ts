import { Express, Request, Response } from "express";
import authRoutes from "./authRoutes";
import assessmentRoutes from './assessmentRoutes'

export function registerRoutes(app:Express) {
    app.use("/api/auth", authRoutes)
    app.use("/api/assessment", assessmentRoutes)
}