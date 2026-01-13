// routes/gig.routes.js
import express from "express";
import auth from "../middleware/auth.middleware.js";
import { createGig, getGigs, getFreelancerGigs, deleteGig } from "../controllers/gig.controller.js";


const router = express.Router();

router.get("/",auth, getGigs); 
router.get("/freelancer", auth, getFreelancerGigs); 
router.post("/", auth, createGig);
router.delete("/:id", auth, deleteGig);

export default router;
