import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";
import { io } from "../socket/socket.js";

export const createBid = async (req, res) => {
  try {
    const { gigId, price, message } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({ error: "You already bid on this gig" });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      price,
      message
    });

    res.status(201).json(bid);
  } catch (err) {
    console.error("CREATE_BID_ERROR:", err);
    res.status(500).json({ error: "Bid creation failed" });
  }
};

export const getBidsByGig = async (req, res) => {
  const bids = await Bid.find({ gigId: req.params.gigId })
    .populate("freelancerId", "name email")
    .populate({
      path: "gigId",
      populate: {
        path: "ownerId",
        select: "name email"
      }
    });

  res.json(bids);
};

export const hireBid = async (req, res) => {
  const bid = await Bid.findById(req.params.bidId)
    .populate("freelancerId", "name email");

  if (!bid) return res.status(404).json({ error: "Bid not found" });

  bid.status = "accepted";
  await bid.save();

  await Bid.updateMany(
    { gigId: bid.gigId, _id: { $ne: bid._id } },
    { status: "rejected" }
  );

  const updatedGig = await Gig.findByIdAndUpdate(
    bid.gigId,
    {
      assignedTo: bid.freelancerId,
      status: "assigned"
    },
    { new: true }
  ).populate("ownerId", "name email");

  io.to(bid.freelancerId._id.toString()).emit("hired", {
    bid,
    gig: updatedGig
  });

  io.to(updatedGig.ownerId._id.toString()).emit("gig_assigned", {
    bid,
    gig: updatedGig
  });

  res.json({ success: true, bid, gig: updatedGig });
};

export const counterBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const { counterPrice } = req.body;

    const bid = await Bid.findByIdAndUpdate(
      bidId,
      { status: "countered", counterPrice },
      { new: true }
    ).populate("freelancerId", "name email");

    if (!bid) return res.status(404).json({ error: "Bid not found" });

    io.to(bid.freelancerId._id.toString()).emit("bid_countered", {
      bid,
      message: "Client sent a counter offer"
    });

    res.status(200).json(bid);
  } catch (err) {
    console.error("COUNTER_BID_ERROR:", err);
    res.status(500).json({ error: "Counter bid failed" });
  }
};

export const getMyBids = async (req, res) => {
  const bids = await Bid.find({ freelancerId: req.user._id })
    .populate({
      path: "gigId",
      populate: {
        path: "ownerId",
        select: "name email"
      }
    })
    .sort({ updatedAt: -1 });

  res.json(bids);
};

export const acceptCounterBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.bidId)
      .populate("gigId")
      .populate("freelancerId", "name email");

    if (!bid) return res.status(404).json({ error: "Bid not found" });

    if (bid.freelancerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (bid.status !== "countered") {
      return res.status(400).json({ error: "No counter to accept" });
    }

    bid.status = "accepted";
    bid.price = bid.counterPrice;
    bid.counterPrice = undefined;
    await bid.save();

    await Bid.updateMany(
      { gigId: bid.gigId._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    const updatedGig = await Gig.findByIdAndUpdate(
      bid.gigId._id,
      {
        freelancerId: bid.freelancerId._id,
        status: "assigned"
      },
      { new: true }
    );

    io.to(updatedGig.ownerId.toString()).emit("gig_assigned", {
      bid,
      gig: updatedGig
    });

    res.json({ bid, gig: updatedGig });
  } catch (err) {
    console.error("ACCEPT_COUNTER_ERROR:", err);
    res.status(500).json({ error: "Accept failed" });
  }
};

