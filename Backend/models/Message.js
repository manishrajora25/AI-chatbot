import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    from: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
