import { useState } from "react";
import "../App.css";

const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "BOB", "Kotak"];
const TOPICS = [
  { value: "account", label: "Account / Savings" },
  { value: "loan", label: "Loan / EMI" },
  { value: "card", label: "Credit / Debit Card" },
  { value: "general", label: "General Banking" }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [bank, setBank] = useState("");
  const [topic, setTopic] = useState("general");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Namaste 👋 Aapka banking helper yahan hai. Pehle bank aur topic select karein." }
  ]);
  const [loading, setLoading] = useState(false);

  const backendBase = "http://localhost:5000"; // change to your deployed URL later

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!bank) {
      alert("Please select a bank first.");
      return;
    }

    const userMsg = { from: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${backendBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          bank,
          topic,
          message: userMsg.text
        })
      });

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { from: "bot", text: data.reply }]);
      } else {
        setMessages(prev => [
          ...prev,
          { from: "bot", text: "Kuch gadbad ho gayi, thodi der baad try karein 🙏" }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Server se connect nahi ho paaya 😔" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-2xl"
      >
        💬
      </button>

      {/* Chat box */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 w-80 bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="px-3 py-2 bg-blue-600 text-white flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm">AI Banking Helper</div>
              <div className="text-xs text-blue-100">24x7 info & guidance</div>
            </div>
            <button onClick={() => setIsOpen(false)}>✖️</button>
          </div>

          {/* Bank & topic selector */}
          <div className="p-2 border-b border-slate-100 space-y-2">
            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={bank}
              onChange={e => setBank(e.target.value)}
            >
              <option value="">Select Bank</option>
              {BANKS.map(b => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              className="w-full border rounded px-2 py-1 text-sm"
              value={topic}
              onChange={e => setTopic(e.target.value)}
            >
              {TOPICS.map(t => (
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
                    : "bg-white text-slate-800 border border-slate-200"
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
          <div className="p-2 border-t border-slate-200 flex gap-1">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Apna sawal likho..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
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
