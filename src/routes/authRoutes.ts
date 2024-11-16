import { Router } from "express";
import { dashboardUser, loginUser, registerUser } from "../controllers/authController";
import { verifyToken } from "../middleware/authMIddleware";

const router = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/dashboard", verifyToken, dashboardUser)

export default router;
