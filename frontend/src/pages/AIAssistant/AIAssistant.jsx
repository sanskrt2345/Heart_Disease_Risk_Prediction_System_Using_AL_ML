// frontend/src/pages/AIAssistant/AIAssistant.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiUser,
  FiFileText,
  FiHeart,
  FiActivity,
  FiSliders,
  FiMessageCircle,
  FiZap,
  FiClock,
  FiUserCheck,
  FiSettings,
  FiSend,
  FiCpu,
} from "react-icons/fi";

/* ===========================
      SIDEBAR MENU
   (kept identical to Dashboard.jsx / Whatif.jsx so every page matches)
=========================== */
const navItems = [
  { icon: FiGrid, label: "Dashboard", path: "/dashboard" },
  { icon: FiUser, label: "Patient Details", path: "/patient-form" },
  { icon: FiFileText, label: "Medical Report", path: "/report" },
  { icon: FiHeart, label: "Risk Prediction", path: "/prediction" },
  { icon: FiActivity, label: "Results", path: "/results" },
  { icon: FiSliders, label: "What-If Simulator", path: "/whatif" },
  { icon: FiMessageCircle, label: "AI Assistant", path: "/assistant" },
  { icon: FiZap, label: "Lifestyle Tips", path: "/tips" },
  { icon: FiClock, label: "History", path: "/history" },
  { icon: FiSettings, label: "Settings", path: "/settings" },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      <div className="px-6 py-6 border-b border-slate-100">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <FiHeart className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-[15px] text-slate-900">
              Heart Health Monitor
            </h2>
            <p className="text-[9px] tracking-[0.25em] text-slate-400 uppercase mt-1 font-medium">
              AI POWERED RISK PREDICTION
            </p>
          </div>
        </motion.div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
              whileHover={{ x: isActive ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.path)}
              className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium overflow-hidden ${
                isActive ? "text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-blue-600 shadow-md"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <item.icon className={`relative z-10 w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-slate-100">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
            AI MODEL
          </p>
          <p className="font-semibold text-sm text-slate-900 mt-1">
            XGBoost v2.0
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ===========================
      QUICK PROMPTS
=========================== */
const QUICK_PROMPTS = [
  "What does my risk score mean?",
  "How can I lower my blood pressure?",
  "Explain my cholesterol reading",
  "Tips to improve heart age",
];

/* ===========================
      MESSAGE BUBBLE
=========================== */
function MessageBubble({ role, content, time }) {
  const isUser = role === "user";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex max-w-[75%] gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
            isUser ? "bg-blue-600" : "bg-gradient-to-br from-red-500 to-red-600"
          }`}
        >
          {isUser ? (
            <FiUser className="h-4 w-4 text-white" />
          ) : (
            <FiCpu className="h-4 w-4 text-white" />
          )}
        </div>
        <div>
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              isUser
                ? "rounded-tr-sm bg-blue-600 text-white"
                : "rounded-tl-sm border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {content}
          </div>
          <p className={`mt-1 text-[11px] text-slate-400 ${isUser ? "text-right" : "text-left"}`}>
            {time}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ===========================
      TYPING INDICATOR
=========================== */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex justify-start"
    >
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600">
          <FiCpu className="h-4 w-4 text-white" />
        </div>
        <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-slate-400"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ===========================
      HELPER
=========================== */
const formatTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// Placeholder response generator. Swap this out for your real backend /
// LLM API call (e.g. fetch to your FastAPI /chat endpoint).
function mockAssistantReply(userText) {
  const text = userText.toLowerCase();
  if (text.includes("risk score")) {
    return "Your risk score reflects your estimated 10-year probability of a cardiovascular event, based on factors like blood pressure, cholesterol, and lifestyle inputs. A lower score is better — I can walk you through what's driving yours if you'd like.";
  }
  if (text.includes("blood pressure")) {
    return "A few evidence-backed ways to lower blood pressure: reduce sodium intake, aim for 150 minutes of moderate activity a week, limit alcohol, and manage stress. Small, consistent changes tend to move the needle more than drastic ones.";
  }
  if (text.includes("cholesterol")) {
    return "Cholesterol readings break down into LDL ('bad'), HDL ('good'), and triglycerides. Your report shows the full breakdown — I can explain any of those numbers or suggest dietary changes that typically help.";
  }
  if (text.includes("heart age")) {
    return "Heart age compares your cardiovascular risk profile to the average person of your chronological age. Improving sleep, activity, and diet consistently can bring your heart age closer to (or below) your real age over time.";
  }
  return "Thanks for the question — I can help interpret your risk prediction, medical report, or suggest lifestyle changes. Could you share a bit more detail so I can give you a precise answer?";
}

/* ===========================
      COMPONENT
=========================== */
export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I'm your AI Health Assistant. Ask me about your risk score, medical report, or how to improve your heart health — I'm here to help.",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed, time: formatTime() }]);
    setInput("");
    setIsTyping(true);

    // Replace this timeout + mock reply with your real API call.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: mockAssistantReply(trimmed), time: formatTime() },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg"
            >
              <FiCpu className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Health Assistant</h1>
              <p className="text-sm text-slate-500">
                Ask questions about your risk, report, or lifestyle
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <motion.span
              className="h-2 w-2 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-xs font-semibold text-emerald-700">Online</span>
          </div>
        </motion.header>

        {/* Chat area */}
        <main className="flex-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto flex h-full max-w-3xl flex-col px-6 py-6"
          >
            <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <MessageBubble key={i} role={m.role} content={m.content} time={m.time} />
                ))}
                {isTyping && <TypingIndicator key="typing" />}
              </AnimatePresence>
            </div>

            {/* Quick prompts */}
            <AnimatePresence>
              {messages.length <= 1 && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
                  }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {QUICK_PROMPTS.map((prompt) => (
                    <motion.button
                      key={prompt}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        show: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your heart health..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                whileTap={{ scale: input.trim() ? 0.95 : 1 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiSend className="h-4 w-4" />
              </motion.button>
            </motion.form>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              AI responses are informational and not a substitute for professional medical advice.
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}