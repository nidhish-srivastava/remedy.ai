import express from "express"
import { getCurrentUser, login, logout, register } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router =express.Router();
router.post("/register",register)
router.post("/login",login)

router.post("/logout",verifyJWT,logout)
router.get("/current-user",verifyJWT, getCurrentUser)

export default router