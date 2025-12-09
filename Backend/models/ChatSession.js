import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ["user", "bot"] },
    text: String,
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const chatSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, index: true },
    bank: String,
    topic: String, // "account", "loan", "card", "general"
    messages: [messageSchema]
  },
  { timestamps: true }
);

export default mongoose.model("ChatSession", chatSessionSchema);
