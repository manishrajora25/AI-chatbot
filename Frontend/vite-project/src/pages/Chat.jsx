// import { useState } from "react";
// import "../App.css";

// const BANKS = [
//   "SBI", "HDFC", "ICICI", "Axis", "PNB", "BOB", "Canara",
//   "Union Bank", "Indian Bank", "IDBI", "Kotak", "Yes Bank",
//   "IndusInd", "Bank of India", "Central Bank", "UCO Bank",
//   "Federal Bank", "RBL Bank", "South Indian Bank", "Bandhan Bank"
// ];

// const TOPICS = [
//   { value: "account", label: "Account / Savings" },
//   { value: "loan", label: "Loan / EMI" },
//   { value: "card", label: "Credit / Debit Card" },
//   { value: "general", label: "General Banking" },
// ];

// export default function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [bank, setBank] = useState("");
//   const [topic, setTopic] = useState("general");
//   const [conversationId, setConversationId] = useState(null);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [messages, setMessages] = useState([
//     { from: "bot", text: "Namaste 👋 Apna account type aur bank select karein." },
//   ]);

//   const backendBase = "http://localhost:5000";

//   const sendMessage = async () => {
//     // ✅ Validation: Bank not selected
//     if (!bank) {
//       setMessages((prev) => [
//         ...prev,
//         { from: "bot", text: "⚠️ Pehle apna bank select kijiye." },
//       ]);
//       return;
//     }

//     if (!input.trim()) return;

//     const userText = input;
//     setMessages((prev) => [...prev, { from: "user", text: userText }]);
//     setInput("");
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");

//       const res = await fetch(`${backendBase}/api/chat/message`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           bank,
//           topic,
//           userMessage: userText,
//           conversationId,
//           language: "hinglish",
//         }),
//       });

//       const data = await res.json();

//       if (data.messages) {
//         setConversationId(data.conversationId);
//         setMessages((prev) => [
//           ...prev,
//           ...data.messages.filter((m) => m.from === "bot"),
//         ]);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { from: "bot", text: "Server se connect nahi ho paaya 😔" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen((o) => !o)}
//         className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center text-2xl"
//       >
//         💬
//       </button>

//       {isOpen && (
//         <div className="fixed bottom-24 right-5 w-80 bg-white rounded-xl shadow-2xl border flex flex-col overflow-hidden h-[85vh]">

//           {/* Header */}
//           <div className="px-4 py-2 bg-blue-600 text-white flex justify-between items-center">
//             <div>
//               <div className="font-semibold text-sm">AI Banking Helper</div>
//               <div className="text-xs text-blue-100">India Banking Support</div>
//             </div>
//             <button onClick={() => setIsOpen(false)}>✖️</button>
//           </div>

//           {/* Bank + Topic Select (Always Visible After Open) */}
//           <div className="p-2 border-b space-y-2">
//             <select
//               className="w-full border rounded px-2 py-1 text-sm"
//               value={bank}
//               onChange={(e) => setBank(e.target.value)}
//             >
//               <option value="">Select Your Bank</option>
//               {BANKS.map((b) => (
//                 <option key={b} value={b}>{b}</option>
//               ))}
//             </select>

//             <select
//               className="w-full border rounded px-2 py-1 text-sm"
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//             >
//               {TOPICS.map((t) => (
//                 <option key={t.value} value={t.value}>
//                   {t.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 p-2 overflow-y-auto bg-slate-50 space-y-1 text-sm">
//             {messages.map((m, idx) => (
//               <div
//                 key={idx}
//                 className={`max-w-[80%] px-2 py-1 rounded-md ${
//                   m.from === "user"
//                     ? "bg-blue-500 text-white ml-auto"
//                     : "bg-white text-slate-800 border"
//                 }`}
//               >
//                 {m.text}
//               </div>
//             ))}
//             {loading && (
//               <div className="text-xs text-slate-400">Soch raha hoon... 🤔</div>
//             )}
//           </div>

//           {/* Input Always Visible */}
//           <div className="p-2 border-t flex gap-1">
//             <input
//               className="flex-1 border rounded px-2 py-1 text-sm"
//               placeholder={
//                 bank ? `Sawaal likhiye (${bank})` : "Bank select karke sawaal likhiye"
//               }
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               disabled={loading}
//               className="bg-blue-600 text-white text-sm px-3 rounded disabled:opacity-60"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useState } from "react";
import "../App.css";
import axiosInstance from "../config/axiosConfig";

// ✅ Bank Names
const BANKS = [
  "SBI", "HDFC", "ICICI", "Axis", "PNB", "BOB", "Canara",
  "Union Bank", "Indian Bank", "IDBI", "Kotak", "Yes Bank",
  "IndusInd", "Bank of India", "Central Bank", "UCO Bank",
  "Federal Bank", "RBL Bank", "South Indian Bank", "Bandhan Bank"
];

// ✅ Bank Logos Mapping
const BANK_LOGOS = {
  SBI: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/SBI-logo.svg/2048px-SBI-logo.svg.png",
  HDFC: "https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg",
  ICICI: "https://upload.wikimedia.org/wikipedia/commons/1/12/ICICI_Bank_Logo.svg",
  Axis: "https://e7.pngegg.com/pngimages/510/187/png-clipart-axis-bank-logo-horizontal-bank-logos.png",
  PNB: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXyT6xYR0eSSB14wdrhfjvwt_9f84h6NJQPw&s",
  BOB: "https://1000logos.net/wp-content/uploads/2021/06/Bank-of-Baroda-logo.jpg",
  Canara: "https://cdn.brandfetch.io/canarabank.com/fallback/transparent/w/600/h/200/banner?c=1bfwsmEH20zzEfSNTed",
  Kotak: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0x-5XTuch9fn5z1DFeFeNUI7iaWTAsN9Bpg&s",
  Yes: "https://vectorseek.com/wp-content/uploads/2024/05/Yes-Bank-New-Logo-Vector.svg-.png",
};

const TOPICS = [
  { value: "account", label: "Account / Savings" },
  { value: "loan", label: "Loan / EMI" },
  { value: "card", label: "Credit / Debit Card" },
  { value: "general", label: "General Banking" },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [bank, setBank] = useState("");
  const [topic, setTopic] = useState("general");
  const [conversationId, setConversationId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    { from: "bot", text: "Namaste 👋 Apna account type aur bank select karein." },
  ]);

  const sendMessage = async () => {
    if (!bank) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ Pehle apna bank select kijiye." },
      ]);
      return;
    }

    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/chat/message", {
        bank,
        topic,
        userMessage: userText,
        conversationId,
        language: "hinglish",
      });

      const data = res.data;

      if (data.messages) {
        setConversationId(data.conversationId);
        setMessages((prev) => [
          ...prev,
          ...data.messages.filter((m) => m.from === "bot"),
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Server se connect nahi ho paaya 😔" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center text-2xl"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 w-80 bg-white rounded-xl shadow-2xl border flex flex-col overflow-hidden h-[85vh]">

          {/* Header */}
          <div className="px-4 py-2 bg-blue-600 text-white flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm">AI Banking Helper</div>
              <div className="text-xs text-blue-100">India Banking Support</div>
            </div>
            <button onClick={() => setIsOpen(false)}>✖️</button>
          </div>

          {/* ✅ Selected Bank Logo */}
          {bank && BANK_LOGOS[bank] && (
            <div className="flex items-center justify-center p-2 border-b bg-slate-50">
              <img src={BANK_LOGOS[bank]} alt={bank} className="h-8 object-contain" />
            </div>
          )}

          {/* Bank + Topic Select */}
          <div className="p-2 border-b space-y-2">
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            >
              <option value="">Select Your Bank</option>
              {BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div className="flex-1 p-2 overflow-y-auto bg-slate-50 space-y-1 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] px-2 py-1 rounded-md ${
                  m.from === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-white text-slate-800 border"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="text-xs text-slate-400">Soch raha hoon... 🤔</div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-1">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder={
                bank ? `Sawaal likhiye (${bank})` : "Bank select karke sawaal likhiye"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 text-white text-sm px-3 rounded disabled:opacity-60"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}
