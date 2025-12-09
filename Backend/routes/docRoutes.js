import express from "express";
import multer from "multer";
// import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { createRequire } from "module";

import { authMiddleware } from "../middleware/auth.js";
import BankDocChunk from "../models/BankDocChunk.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

// ✅ File memory storage (no disk mess)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ✅ Helper: split big text into small chunks
function chunkText(text, maxLen = 800) {
  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks = [];
  let current = "";

  for (const s of sentences) {
    if ((current + " " + s).length > maxLen) {
      if (current.trim()) chunks.push(current.trim());
      current = s;
    } else {
      current += " " + s;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// POST /api/docs/upload-pdf
router.post(
  "/upload-pdf",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const { bank, title } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "PDF file is required (field name: file)" });
      }

      if (!bank) {
        return res
          .status(400)
          .json({ message: "bank is required (e.g. SBI, HDFC, ICICI)" });
      }

      const pdfData = await pdfParse(req.file.buffer);
      const text = pdfData.text || "";

      if (!text.trim()) {
        return res
          .status(400)
          .json({ message: "Could not extract text from this PDF" });
      }

      const chunks = chunkText(text);

      const docs = chunks.map((chunk, idx) => ({
        bank,
        title: title || req.file.originalname,
        sourceType: "pdf",
        chunkIndex: idx,
        text: chunk,
      }));

      await BankDocChunk.insertMany(docs);

      return res.json({
        message: "Bank document stored successfully ✅",
        bank,
        title: title || req.file.originalname,
        chunks: docs.length,
      });
    } catch (err) {
      console.error("PDF upload error:", err.message);
      return res.status(500).json({ message: "Server error while processing PDF" });
    }
  }
);

export default router;
