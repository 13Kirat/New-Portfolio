import express from "express";
import {
  addNewProject,
  deleteProject,
  generateProjectBanner,
  getAllProjects,
  getSingleProject,
  updateProject,
} from "../controller/projectController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate-banner", isAuthenticated, generateProjectBanner);
router.post("/add", isAuthenticated, addNewProject);
router.delete("/delete/:id", isAuthenticated, deleteProject);
router.put("/update/:id", isAuthenticated, updateProject);
router.get("/getall", getAllProjects);
router.get("/get/:id", getSingleProject);

export default router;
