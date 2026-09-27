import express from "express";
import { generateProjectBanner } from "../controller/aiController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate-banner", isAuthenticated, generateProjectBanner);

export default router;
