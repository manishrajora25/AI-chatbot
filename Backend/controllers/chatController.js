// import ChatSession from "../models/ChatSession.js";
// import Lead from "../models/Lead.js";
// import { generateReply } from "../services/aiService.js";

// export const handleChat = async (req, res) => {
//   try {
//     const { sessionId, bank, topic, message } = req.body;

//     if (!sessionId || !message) {
//       return res.status(400).json({ error: "sessionId and message required" });
//     }

//     // Load or create session
//     let session = await ChatSession.findOne({ sessionId });

//     if (!session) {
//       session = await ChatSession.create({
//         sessionId,
//         bank,
//         topic,
//         messages: []
//       });
//     } else {
//       // update bank/topic if provided
//       if (bank && !session.bank) session.bank = bank;
//       if (topic && !session.topic) session.topic = topic;
//     }

//     // Push user message
//     session.messages.push({ from: "user", text: message });

//     // Generate AI reply
//     const replyText = await generateReply({
//       bank: session.bank,
//       topic: session.topic,
//       userMessage: message,
//       history: session.messages
//     });

//     // Push bot message
//     session.messages.push({ from: "bot", text: replyText });
//     await session.save();

//     return res.json({
//       reply: replyText,
//       bank: session.bank,
//       topic: session.topic
//     });
//   } catch (err) {
//     console.error("❌ handleChat error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const createLead = async (req, res) => {
//   try {
//     const { name, phone, city, bank, needType, note } = req.body;

//     if (!phone) {
//       return res.status(400).json({ error: "phone is required" });
//     }

//     const lead = await Lead.create({
//       name,
//       phone,
//       city,
//       bank,
//       needType,
//       note
//     });

//     return res.status(201).json({ success: true, lead });
//   } catch (err) {
//     console.error("❌ createLead error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };









import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import BankDocChunk from "../models/BankDocChunk.js";
import { generateReply } from "../services/aiService.js";

// POST /api/chat/message
export const sendMessage = async (req, res) => {
  try {
    const user = req.user; // from authMiddleware
    const { bank, topic, userMessage, conversationId, language } = req.body;

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: user._id,
      });
    }

    if (!conversation) {
      // create new conversation
      conversation = await Conversation.create({
        user: user._id,
        bank: bank || user.defaultBank,
        topic: topic || null,
        language: language || user.preferredLanguage || "hinglish",
      });
    }

    // load recent messages for history
    const historyMessages = await Message.find({
      conversation: conversation._id,
    })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    const history = historyMessages.map((m) => ({
      from: m.from,
      text: m.text,
    }));


// ✅ RAG: find relevant bank doc chunks
let docChunks = [];
if (conversation.bank) {
  try {
    docChunks = await BankDocChunk.find(
      {
        bank: conversation.bank,
        $text: { $search: userMessage }, // simple full-text search
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(5)
      .lean();
  } catch (err) {
    console.error("Bank doc search error:", err.message);
  }
}

// Save user message
const userMsg = await Message.create({
  conversation: conversation._id,
  from: "user",
  text: userMessage,
});

// Generate AI reply with docs
const replyText = await generateReply({
  bank: conversation.bank,
  topic: conversation.topic,
  userMessage,
  history,
  language: conversation.language,
  docs: docChunks,      // ✅ pass docs to AI
});

   
    // save bot reply
    const botMsg = await Message.create({
      conversation: conversation._id,
      from: "bot",
      text: replyText,
    });

    // basic analytics hook – yahan se future me logs/metrics ban sakte hain

    res.json({
      conversationId: conversation._id,
      messages: [
        {
          id: userMsg._id,
          from: userMsg.from,
          text: userMsg.text,
          createdAt: userMsg.createdAt,
        },
        {
          id: botMsg._id,
          from: botMsg.from,
          text: botMsg.text,
          createdAt: botMsg.createdAt,
        },
      ],
    });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/chat/history
export const getHistory = async (req, res) => {
  try {
    const user = req.user;

    const conversations = await Conversation.find({ user: user._id })
      .sort({ updatedAt: -1 })
      .lean();

    const convIds = conversations.map((c) => c._id);

    const messages = await Message.find({
      conversation: { $in: convIds },
    })
      .sort({ createdAt: 1 })
      .lean();

    const grouped = {};
    for (const msg of messages) {
      const cid = msg.conversation.toString();
      if (!grouped[cid]) grouped[cid] = [];
      grouped[cid].push(msg);
    }

    const result = conversations.map((conv) => ({
      conversationId: conv._id,
      bank: conv.bank,
      topic: conv.topic,
      language: conv.language,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      messages: grouped[conv._id.toString()] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("History error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
