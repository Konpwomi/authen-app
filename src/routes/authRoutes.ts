import { Router } from "express";
import { dashboardUser, loginUser, registerUser } from "../controllers/authController";
import { verifyToken } from "../middleware/authMIddleware";
import dotenv from 'dotenv'; 
dotenv.config();

const router = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/dashboard", verifyToken, dashboardUser)

export default router;
