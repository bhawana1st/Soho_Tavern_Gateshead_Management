import mongoose from "mongoose";

const tempSchema = new mongoose.Schema({
  time: { type: String },
  readings: { type: [String], default: [] }, // keep strings so +/- kept
});

const deliverySchema = new mongoose.Schema({
  supplier: String,
  product: String,
  time: String,
  surfTemp: String,
  rejectedIfAny: String,
  sign: String,
});

const cookingSchema = new mongoose.Schema({
  itemCooked: String,
  endCookingTemperature: Number,
  time: String,
  chillingMethod: String,
  chillingDuration: String,
  endTemperature: Number,
});

const dishwasherCheckSchema = new mongoose.Schema({
  period: { type: String, enum: ["AM", "PM"], required: true },
  time: String,
  temp: String,
  cleansingOk: String,
  chemicalSufficient: String,
  closingCheck: String,
  initial: String,
});

const openingCheckSchema = new mongoose.Schema({
  label: String,
  yes: { type: Boolean, default: false },
});

const closingCheckSchema = new mongoose.Schema({
  label: String,
  yes: { type: Boolean, default: false },
});

const servedRowSchema = new mongoose.Schema({
  dish: String,
  lunch: String,
  dinner: String,
});

const wastageSchema = new mongoose.Schema({
  itemName: String,
  session: String,
  reason: String,
  quantity: String,
  sign: String,
});

const incidentSchema = new mongoose.Schema({
  nature: String,
  actionTaken: String,
});

const checklistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true, index: true },
    dishwasherChecks: { type: [dishwasherCheckSchema], default: [] },
    openingChecks: { type: [openingCheckSchema], default: [] },
    openingComment: { type: String, default: "" },
    fridgeTemps: { type: [tempSchema], default: [] },
    fridgeComments: {
      AM: { type: String, default: "" },
      PM: { type: String, default: "" },
    },
    deliveryDetails: { type: [deliverySchema], default: [] },
    cookingDetails: { type: [cookingSchema], default: [] },
    servedRows: { type: [servedRowSchema], default: [] },
    wastageReport: { type: [wastageSchema], default: [] },
    incidentReport: { type: [incidentSchema], default: [] },
    closingChecks: { type: [closingCheckSchema], default: [] },
    closingComment: { type: String, default: "" },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: false 
    },
  },
  { timestamps: true }
);

// Ensure unique checklist per date per user
checklistSchema.index({ date: 1, createdBy: 1 }, { unique: true });

export default mongoose.models.Checklist || mongoose.model("Checklist", checklistSchema);