import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bank: { type: String, default: null },
    topic: { type: String, default: null },
    language: {
      type: String,
      enum: ["hi", "en", "hinglish"],
      default: "hinglish",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
