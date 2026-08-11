// frontend/src/pages/Settings/Settings.jsx
import React, { useEffect, useState } from "react";
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
  FiSettings,
  FiMoon,
  FiBell,
  FiTrash2,
  FiCheck,
} from "react-icons/fi";

/* ===========================
      SIDEBAR MENU
   (kept identical to Dashboard.jsx / Lifestyle.jsx / History.jsx)
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
    <aside className="w-60 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
      <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
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
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
              whileHover={{ x: isActive ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
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
                  className="absolute inset-0 rounded-xl bg-blue-600 shadow-md"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
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
      SETTING ROW
=========================== */
function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

/* ===========================
      TOGGLE SWITCH
   Reusable animated on/off switch (used by Notifications).
=========================== */
function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
        checked ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="inline-block h-5 w-5 rounded-full bg-white shadow-md"
        style={{ marginLeft: checked ? "26px" : "4px" }}
      />
    </button>
  );
}

/* ===========================
      COMPONENT
=========================== */
const DARK_MODE_KEY = "hhm_dark_mode";
const NOTIFICATIONS_KEY = "hhm_notifications_enabled";
const RISK_PROFILE_KEY = "hhm_risk_profile";
const LAST_PREDICTION_KEY = "hhm_last_prediction";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [cleared, setCleared] = useState(false);

  // Load saved preferences on mount and apply dark mode immediately.
  useEffect(() => {
    let savedDark = false;
    let savedNotifications = true;
    try {
      savedDark = localStorage.getItem(DARK_MODE_KEY) === "true";
      const storedNotif = localStorage.getItem(NOTIFICATIONS_KEY);
      savedNotifications = storedNotif === null ? true : storedNotif === "true";
    } catch {
      /* localStorage unavailable — ignore */
    }
    setDarkMode(savedDark);
    setNotificationsEnabled(savedNotifications);
    document.documentElement.classList.toggle("dark", savedDark);
  }, []);

  // Keep <html class="dark"> in sync whenever darkMode changes, and persist.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem(DARK_MODE_KEY, String(darkMode));
    } catch {
      /* ignore */
    }
  }, [darkMode]);

  // Persist notification preference whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, String(notificationsEnabled));
    } catch {
      /* ignore */
    }
  }, [notificationsEnabled]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleReset = () => {
    try {
      localStorage.removeItem(RISK_PROFILE_KEY);
      localStorage.removeItem(LAST_PREDICTION_KEY);
      setCleared(true);
      setTimeout(() => setCleared(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-slate-950 transition-colors">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-[11px] font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase">
              Preferences
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          </motion.div>

          {/* Settings cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6 space-y-4"
          >
            {/* Dark mode */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <SettingRow
                icon={FiMoon}
                title="Dark mode"
                description="Switch between light and dark themes."
              >
                <button
                  onClick={toggleDarkMode}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                    darkMode
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {darkMode ? "Disable" : "Enable"}
                </button>
              </SettingRow>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <SettingRow
                icon={FiBell}
                title="Notifications"
                description={
                  notificationsEnabled
                    ? "Toast alerts inside the app are turned on."
                    : "Toast alerts inside the app are turned off."
                }
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold ${
                      notificationsEnabled
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {notificationsEnabled ? "On" : "Off"}
                  </span>
                  <ToggleSwitch
                    checked={notificationsEnabled}
                    onChange={setNotificationsEnabled}
                    label="Toggle notifications"
                  />
                </div>
              </SettingRow>
            </div>

            {/* About */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <SettingRow
                icon={FiHeart}
                title="About this app"
                description="Built with FastAPI, React, MongoDB and XGBoost. AI assistant powered by Claude Sonnet 4.5."
              />
            </div>

            {/* Reset local data */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <SettingRow
                icon={FiTrash2}
                title="Reset local data"
                description="Clears the cached patient profile and last prediction (server data is kept)."
              >
                <AnimatePresence mode="wait" initial={false}>
                  {cleared ? (
                    <motion.span
                      key="cleared"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                    >
                      <FiCheck className="h-4 w-4" />
                      Cleared
                    </motion.span>
                  ) : (
                    <motion.button
                      key="clear"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={handleReset}
                      className="rounded-xl border border-red-200 dark:border-red-900 px-4 py-2 text-sm font-semibold text-red-500 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      Clear
                    </motion.button>
                  )}
                </AnimatePresence>
              </SettingRow>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-10 text-center text-xs text-slate-400"
          >
            <p>
              Heart Disease Risk Prediction System · Developed using FastAPI, React,
              XGBoost, Scikit-learn, Recharts, MongoDB
            </p>
            <p className="mt-1">© 2025 All Rights Reserved</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}