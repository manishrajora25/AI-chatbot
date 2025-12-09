// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Safe banking helper AI
// export async function generateReply({ bank, topic, userMessage, history = [] }) {
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash"
//     });

//     const historyText = history
//       .map(m => `${m.from === "user" ? "User" : "Bot"}: ${m.text}`)
//       .join("\n");

//     const prompt = `
// You are an AI Banking Helper for Indian users.

// Rules:
// - DO NOT ask for OTP, PIN, CVV, full account number, UPI PIN, or passwords.
// - Never perform real transactions. Only give general guidance and education.
// - If user asks exact interest rate or charges, say: "Rates and charges change frequently, please confirm on the bank's official website or branch."
// - Use simple Hinglish (mix of Hindi + English).
// - Keep answers short, clear and friendly.
// - If the user looks confused, ask 1 follow-up question to clarify their need.

// User selected bank: ${bank || "Not specified"}
// User topic: ${topic || "general"}

// Previous chat:
// ${historyText || "(no previous messages)"}

// User message:
// "${userMessage}"
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return text?.trim() || "Thoda aur detail me batao please 🙂";
//   } catch (err) {
//     console.error("❌ Gemini error:", err.message);
//     return "Abhi thoda technical issue aa gaya hai, thodi der baad try karein 🙏";
//   }
// }







// import OpenAI from "openai";
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });   // ✅ FORCE LOAD



// // ✅ DEBUG (once run to confirm key loaded)
// console.log("OPENAI KEY LOADED:", process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌");

// const openai = new OpenAI(process.env.OPENAI_API_KEY,);


// // ✅ Safe banking helper AI (OpenAI version)
// export async function generateReply({ bank, topic, userMessage, history = [] }) {
//   try {
//     const historyText = history
//       .map(m => `${m.from === "user" ? "User" : "Bot"}: ${m.text}`)
//       .join("\n");

//     const prompt = `
// You are an AI Banking Helper for Indian users.

// Rules:
// - DO NOT ask for OTP, PIN, CVV, full account number, UPI PIN, or passwords.
// - Never perform real transactions. Only give general guidance and education.
// - If user asks exact interest rate or charges, say:
//   "Rates and charges change frequently, please confirm on the bank's official website or branch."
// - Use simple Hinglish (mix of Hindi + English).
// - Keep answers short, clear and friendly.
// - If the user looks confused, ask 1 follow-up question to clarify their need.

// User selected bank: ${bank || "Not specified"}
// User topic: ${topic || "general"}

// Previous chat:
// ${historyText || "(no previous messages)"}

// User message:
// "${userMessage}"
// `;

//     const result = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: "You are a helpful Indian banking assistant." },
//         { role: "user", content: prompt }
//       ],
//       temperature: 0.4
//     });

//     const text = result.choices[0]?.message?.content;

//     return text?.trim() || "Thoda aur detail me batao please 🙂";

//   } catch (err) {
//     console.error("❌ OpenAI error:", err.message);
//     return "Abhi thoda technical issue aa gaya hai, thodi der baad try karein 🙏";
//   }
// }

// import dotenv from "dotenv";
// dotenv.config();

// import Groq from "groq-sdk";

// console.log("✅ GROQ KEY LOADED:", process.env.GROQ_API_KEY ? "YES" : "NO ❌");

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// export async function generateReply({ bank, topic, userMessage, history = [] }) {
//   try {
//     const historyText = history
//       .map(m => `${m.from === "user" ? "User" : "Bot"}: ${m.text}`)
//       .join("\n");

//     const prompt = `
// You are an AI Banking Helper for Indian users.

// Rules:
// - DO NOT ask for OTP, PIN, CVV, full account number, UPI PIN, or passwords.
// - Never perform real transactions.
// - Only give general guidance.
// - Use simple Hinglish.
// - Keep reply short and friendly.
// - Ask 1 follow-up question if needed.

// User selected bank: ${bank || "Not specified"}
// User topic: ${topic || "general"}

// Previous chat:
// ${historyText || "(no previous messages)"}

// User message:
// "${userMessage}"
// `;

//     const result = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant",   // ✅ NEW WORKING MODEL
//       messages: [
//         { role: "system", content: "You are a helpful Indian banking assistant." },
//         { role: "user", content: prompt }
//       ],
//       temperature: 0.4,
//     });

//     return (
//       result.choices[0]?.message?.content?.trim() ||
//       "Thoda aur detail me batao please 🙂"
//     );

//   } catch (err) {
//     console.error("❌ GROQ Error:", err.message);
//     return "Abhi AI thoda busy hai 😕 thodi der baad try karein.";
//   }
// }








import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

import Message from "../models/Message.js";

console.log(
  "✅ GROQ KEY LOADED:",
  process.env.GROQ_API_KEY ? "YES" : "NO ❌"
);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateReply({
  bank,
  topic,
  userMessage,
  history = [],
  language = "hinglish",
  docs = [], 
}) {
  try {
    // Just last 10 messages for cost optimization
    const trimmedHistory = history.slice(-10);

    const historyText = trimmedHistory
      .map((m) => `${m.from === "user" ? "User" : "Bot"}: ${m.text}`)
      .join("\n");

    const languageInstruction =
      language === "hi"
        ? "Reply mostly in Hindi."
        : language === "en"
        ? "Reply in simple English."
        : "Reply in simple Hinglish (mix of Hindi & English).";

    const prompt = `
You are an AI Banking Helper for Indian users.

Rules:
- DO NOT ask for OTP, PIN, CVV, full account number, UPI PIN, or passwords.
- Never perform real transactions.
- Only give general guidance and education.
- If user asks exact interest rate or charges, say:
  "Rates and charges change frequently, please confirm on the bank's official website or branch."
- ${languageInstruction}
- Keep answers short, clear and friendly.
- If the user looks confused, ask 1 follow-up question.

User selected bank: ${bank || "Not specified"}
User topic: ${topic || "general"}

Previous chat:
${historyText || "(no previous messages)"}

User message:
"${userMessage}"
`;

    const result = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a helpful Indian banking assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    });

    return (
      result.choices[0]?.message?.content?.trim() ||
      "Thoda aur detail me batao please 🙂"
    );
  } catch (err) {
    console.error("❌ GROQ Error:", err.message);
    return "Abhi AI thoda busy hai 😕 thodi der baad try karein.";
  }
}
