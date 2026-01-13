import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict"
  });
  res.json({ message: "Logged out" });
});

export default router;
