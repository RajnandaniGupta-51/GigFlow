import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  createBid,
  getBidsByGig,
  hireBid,
  counterBid,
  getMyBids,
  acceptCounterBid
} from "../controllers/bid.controller.js";

const router = express.Router();

router.get("/me", auth, getMyBids);

router.post("/", auth, createBid);
router.get("/:gigId", auth, getBidsByGig);
router.patch("/:bidId/hire", auth, hireBid);
router.patch("/:bidId/counter", auth, counterBid);
router.patch("/:bidId/accept", auth, acceptCounterBid);

export default router;
