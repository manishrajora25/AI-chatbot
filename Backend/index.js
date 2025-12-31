import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import docRoutes from "./routes/docRoutes.js"; 

import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // ✅ agar auth use kar rahe ho

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

// ✅ Rate Limiter (Spam Protection)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,            // 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Apply limiter ONLY on /api
app.use("/api", apiLimiter);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Banking Helper Bot Backend ✅");
});

// ✅ Routes
app.use("/api/auth", authRoutes); 
app.use("/api/docs", docRoutes);  // login/register
app.use("/api", chatRoutes);        // chat routes

// ✅ Server Start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("✅ MongoDB connected");
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server start failed:", err.message);
    process.exit(1);
  }
};

startServer();
