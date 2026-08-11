// frontend/src/pages/AIAssistant/AIAssistant.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "../../services/api";
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
  FiSettings,
  FiSend,
  FiCpu,
} from "react-icons/fi";

/* ===========================
      SIDEBAR MENU
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

const DARK_MODE_KEY = "hhm_dark_mode";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
      <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
            <FiHeart className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-[15px] text-slate-900 dark:text-slate-100">
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
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.025, duration: 0.25, ease: "easeOut" }}
              whileHover={{ x: isActive ? 0 : 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className={`relative w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium overflow-hidden ${
                isActive
                  ? "text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-blue-600"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <item.icon className={`relative z-10 w-5 h-5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-slate-100 dark:border-slate-800">
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            AI MODEL
          </p>
          <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-1">
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
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
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
                : "rounded-tl-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            }`}
          >
            {content}
          </div>
          <p className={`mt-1 text-[11px] text-slate-400 dark:text-slate-500 ${isUser ? "text-right" : "text-left"}`}>
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className="flex justify-start"
    >
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600">
          <FiCpu className="h-4 w-4 text-white" />
        </div>
        <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 shadow-sm">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
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
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  // Apply the globally-persisted dark mode preference in case this page
  // is loaded directly (fresh navigation / hard reload).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DARK_MODE_KEY) === "true";
      document.documentElement.classList.toggle("dark", saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed, time: formatTime() }]);
    setInput("");
    setIsTyping(true);
    setError("");

    try {
      const data = await apiFetch("/api/assistant/chat", {
        method: "POST",
        body: JSON.stringify({ message: trimmed }),
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content, time: formatTime() },
      ]);
    } catch (err) {
      setError(err.message || "Couldn't reach the assistant.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that right now. Please try again.",
          time: formatTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 shrink-0"
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm"
            >
              <FiCpu className="h-4 w-4 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI Health Assistant</h1>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                Ask questions about your risk, report, or lifestyle
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5">
            <motion.span
              className="h-2 w-2 rounded-full bg-emerald-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Online</span>
          </div>
        </motion.header>

        {/* Chat area */}
        <main className="flex-1 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.08 }}
            className="mx-auto flex h-full max-w-3xl flex-col px-6 py-6"
          >
            {error && (
              <div className="mb-3 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs">
                {error}
              </div>
            )}

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
                    show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                  }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {QUICK_PROMPTS.map((prompt) => (
                    <motion.button
                      key={prompt}
                      variants={{
                        hidden: { opacity: 0, y: 6 },
                        show: { opacity: 1, y: 0 },
                      }}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => sendMessage(prompt)}
                      className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm transition-colors hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-400"
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-sm focus-within:border-blue-300 dark:focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/40"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your heart health..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: input.trim() ? 1.04 : 1 }}
                whileTap={{ scale: input.trim() ? 0.96 : 1 }}
                transition={{ duration: 0.15 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiSend className="h-4 w-4" />
              </motion.button>
            </motion.form>
            <p className="mt-2 text-center text-[11px] text-slate-400 dark:text-slate-600">
              AI responses are informational and not a substitute for professional medical advice.
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}