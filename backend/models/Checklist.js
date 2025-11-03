import mongoose from "mongoose";

const checklistSchema = new mongoose.Schema(
  {
    section: { type: String, required: true }, // e.g. "Opening Check"
    fields: [
      {
        label: String,
        value: String, // "Yes", "No", or custom input
      },
    ],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Checklist", checklistSchema);
