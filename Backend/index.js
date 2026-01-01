// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import rateLimit from "express-rate-limit";
// import docRoutes from "./routes/docRoutes.js"; 

// import connectDB from "./config/db.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import authRoutes from "./routes/authRoutes.js";

// const app = express();

// // ✅ Middleware
// app.use(cors({ origin: "*", credentials: false }));
// app.use(express.json());

// // ✅ Rate Limiter (Spam Protection)
// const apiLimiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 20,            // 20 requests per minute
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // ✅ Apply limiter ONLY on /api
// app.use("/api", apiLimiter);

// // ✅ Test Route
// app.get("/", (req, res) => {
//   res.send("Banking Helper Bot Backend ✅");
// });

// // ✅ Routes
// app.use("/api/auth", authRoutes); 
// app.use("/api/docs", docRoutes);  
// app.use("/api", chatRoutes);      

// // ✅ Server Start
// const PORT = process.env.PORT || 8080;

// const startServer = async () => {
//   try {
//     await connectDB();

//     app.listen(PORT, () => {
//       console.log("✅ MongoDB connected");
//       console.log(`✅ Server running on port ${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Server start failed:", err.message);
//     process.exit(1);
//   }
// };

// startServer();





import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import docRoutes from "./routes/docRoutes.js"; 

import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// ✅ CORS (UPDATED)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ambitious-bush-035eeaa10.4.azurestaticapps.net"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Banking Helper Bot Backend ✅");
});

// ✅ Routes
app.use("/api/auth", authRoutes); 
app.use("/api/docs", docRoutes);  
app.use("/api", chatRoutes);      

// ✅ Server Start
const PORT = process.env.PORT || 8080;

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
