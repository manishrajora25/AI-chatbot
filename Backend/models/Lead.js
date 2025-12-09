import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    city: String,
    bank: String,        // e.g. "SBI", "HDFC"
    needType: String,    // "loan", "account", "card"
    note: String,
    source: { type: String, default: "website-widget" }
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
