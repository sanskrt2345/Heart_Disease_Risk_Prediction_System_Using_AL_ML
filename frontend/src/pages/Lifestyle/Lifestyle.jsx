// frontend/src/pages/Lifestyle/Lifestyle.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
  FiSun,
  FiMoon,
  FiDroplet,
  FiWind,
  FiTarget,
  FiAlertCircle,
  FiRefreshCw,
  FiArrowRight,
} from "react-icons/fi";
import { GiFruitBowl, GiFlame } from "react-icons/gi";
import { FaWalking, FaStethoscope } from "react-icons/fa";
import { MdSmokeFree } from "react-icons/md";

// Shared localStorage key — Prediction.jsx writes the risk result here after
// calculating, this page reads it to personalize recommendations.
const RISK_PROFILE_KEY = "hhm_risk_profile";

/* ===========================
      SIDEBAR MENU
   (kept identical to Dashboard.jsx / Whatif.jsx / AIAssistant.jsx)
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
      DAILY TARGET STATS
   NOTE: these are placeholder/default values for the frontend build.
   Once the backend is wired up, swap these for values computed from
   the patient's actual risk profile (age, BMI, activity level, etc).
=========================== */
const TARGET_STATS = [
  {
    icon: GiFlame,
    color: "text-orange-500",
    label: "Daily Calories",
    value: "2076",
    unit: "kcal",
  },
  {
    icon: FiDroplet,
    color: "text-blue-500",
    label: "Water Target",
    value: "2.5",
    unit: "L",
  },
  {
    icon: FaWalking,
    color: "text-violet-500",
    label: "Steps Target",
    value: "10,000",
    unit: "/day",
  },
  {
    icon: FiTarget,
    color: "text-orange-500",
    label: "BMI Target",
    value: "18.5–24.9",
    unit: "",
  },
];

/* ===========================
      RECOMMENDATION CATEGORIES
=========================== */
const RECOMMENDATIONS = [
  {
    icon: GiFruitBowl,
    iconBg: "bg-emerald-500",
    title: "Diet Plan",
    items: [
      "Mediterranean-style: olive oil, leafy greens, berries, whole grains",
      "Oily fish 2x/week (salmon, sardines) for Omega-3",
      "Limit red meat to once a week; prefer legumes and poultry",
      "Cut added sugar < 25 g/day and refined carbs",
      "Sodium target < 1500 mg/day if hypertensive",
    ],
  },
  {
    icon: FiActivity,
    iconBg: "bg-blue-500",
    title: "Exercise",
    items: [
      "Brisk walking 10,000 steps/day",
      "Moderate cardio 150 min/week (cycling, swimming)",
      "Strength training 2x/week (large muscle groups)",
      "Daily stretching or mobility 10 min",
    ],
  },
  {
    icon: FiSun,
    iconBg: "bg-amber-500",
    title: "Yoga",
    items: [
      "Sukhasana (5 min)",
      "Bhujangasana (Cobra)",
      "Setu Bandhasana (Bridge)",
      "Pranayama – Anulom Vilom 5 min",
      "Shavasana (Corpse pose) 5 min",
    ],
  },
  {
    icon: FiMoon,
    iconBg: "bg-violet-500",
    title: "Sleep Schedule",
    items: [
      "Fixed bedtime within 30-min window",
      "7–9 hours nightly",
      "No screens 60 min before sleep",
      "Cool dark room 18–20°C",
    ],
  },
  {
    icon: FiWind,
    iconBg: "bg-sky-500",
    title: "Stress Management",
    items: [
      "Box breathing 4-4-4-4 (3x/day)",
      "Mindfulness meditation 10 min daily",
      "Journaling before bed",
      "Limit caffeine after 14:00",
    ],
  },
  {
    icon: FaWalking,
    iconBg: "bg-emerald-500",
    title: "Walking Plan",
    items: ["Morning 20 min", "Post-lunch 10 min", "Evening 20 min"],
  },
  {
    icon: MdSmokeFree,
    iconBg: "bg-red-500",
    title: "Smoking Cessation",
    items: ["Maintain smoke-free status."],
    plain: true,
  },
  {
    icon: FaStethoscope,
    iconBg: "bg-blue-500",
    title: "Doctor Consultation",
    items: ["Routine annual check-up sufficient."],
    plain: true,
  },
];

/* ===========================
      STAT CARD
=========================== */
function StatCard({ icon: Icon, color, label, value, unit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <Icon className={`h-4 w-4 ${color}`} />
        {label}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-slate-400">{unit}</span>}
      </p>
    </motion.div>
  );
}

/* ===========================
      RECOMMENDATION CARD
=========================== */
function RecommendationCard({ icon: Icon, iconBg, title, items, plain }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      </div>

      {plain ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-500">{items[0]}</p>
      ) : (
        <ul className="mt-4 space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-slate-600">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

/* ===========================
      EMPTY / LOADING STATES
=========================== */
function LoadingState() {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <FiRefreshCw className="h-6 w-6 animate-spin text-blue-600" />
      </main>
    </div>
  );
}

function NoRiskState({ onNavigate }) {
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center px-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
            <FiAlertCircle className="h-7 w-7 text-amber-500" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No risk assessment yet
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Calculate your cardiovascular risk first — your lifestyle
            recommendations will be tailored to the result.
          </p>
          <button
            onClick={onNavigate}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Go to Risk Prediction
            <FiArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </main>
    </div>
  );
}

/* ===========================
      COMPONENT
=========================== */
export default function Lifestyle() {
  const navigate = useNavigate();

  // undefined = still checking localStorage, null = no risk profile found, object = risk profile exists
  const [riskProfile, setRiskProfile] = useState(undefined);

  // Read the risk profile written by Prediction.jsx once, on mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RISK_PROFILE_KEY);
      setRiskProfile(stored ? JSON.parse(stored) : null);
    } catch (err) {
      console.error("Failed to read risk profile:", err);
      setRiskProfile(null);
    }
  }, []);

  // Still reading localStorage — avoid a flash of the "no risk" state.
  if (riskProfile === undefined) {
    return <LoadingState />;
  }

  // Risk hasn't been calculated yet — don't show recommendations, prompt user instead.
  if (riskProfile === null) {
    return <NoRiskState onNavigate={() => navigate("/prediction")} />;
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-[11px] font-semibold tracking-widest text-blue-600 uppercase">
              Lifestyle
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Personalized Recommendations
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Daily targets and lifestyle prescriptions tailored to the patient's risk profile.
            </p>
          </motion.div>

          {/* Daily target stats */}
          <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {TARGET_STATS.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>

          {/* Recommendation category cards */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {RECOMMENDATIONS.map((rec, i) => (
              <RecommendationCard key={i} {...rec} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}