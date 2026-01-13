import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    budget: Number,

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["open", "assigned", "completed"],
      default: "open"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

gigSchema.virtual("bids", {
  ref: "Bid",
  localField: "_id",
  foreignField: "gigId"
});

export default mongoose.model("Gig", gigSchema);
