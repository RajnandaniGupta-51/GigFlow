
import Gig from "../models/Gig.js";

export const createGig = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can create gigs" });
    }

    const gig = await Gig.create({
      title: req.body.title,
      description: req.body.description,
      budget: req.body.budget,
      ownerId: req.user._id
    });

    res.status(201).json(gig);
  } catch (err) {
    console.error("CREATE_GIG_ERROR:", err);
    res.status(500).json({ message: "Gig creation failed" });
  }
};


export const getGigs = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "System_Error: User context missing." });
    }

    let filter = {};
    if (req.user.role === "client") {
      filter = { ownerId: req.user._id }; 
    } else {
      filter = { status: "open" };
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const gigs = await Gig.find(filter)
      .populate("ownerId", "name email");
    

    res.json(gigs);
  } catch (error) {
    console.error("GET_GIGS_ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getFreelancerGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ freelancerId: req.user.id });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (
      req.user.role !== "client" ||
      gig.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await gig.deleteOne();

    res.json({ message: "Gig deleted successfully", gigId: gig._id });
  } catch (err) {
    console.error("DELETE_GIG_ERROR:", err);
    res.status(500).json({ message: "Gig deletion failed" });
  }
};
