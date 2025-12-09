import mongoose from "mongoose";


const bankDocChunkSchema = new mongoose.Schema(
  {
    bank: { type: String, index: true },        // e.g. "SBI", "HDFC"
    title: { type: String },
    sourceType: {
      type: String,
      enum: ["pdf", "manual", "web"],
      default: "pdf",
    },
    chunkIndex: { type: Number },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Mongo text index for simple full-text search (RAG v1)
bankDocChunkSchema.index({ text: "text" });

const BankDocChunk = mongoose.model("BankDocChunk", bankDocChunkSchema);

export default BankDocChunk;
