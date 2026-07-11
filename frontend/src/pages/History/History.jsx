// frontend/src/pages/History/History.jsx
import React, { useMemo, useState } from "react";
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
  FiSearch,
  FiDownload,
  FiTrash2,
  FiInbox,
  FiChevronDown,
} from "react-icons/fi";

/* ===========================
      SIDEBAR MENU
   (kept identical to Dashboard.jsx / Lifestyle.jsx / PatientForm.jsx)
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
      SAMPLE DATA
   NOTE: placeholder records for the frontend build. Once the backend
   is wired up, replace this with real prediction history fetched
   from the API / database.
=========================== */
const SAMPLE_HISTORY = [
  { id: "r1", date: "2026-06-30T16:03:23", patient: "Anonymous", riskPct: 0.8, heartAge: 40, notes: "" },
  { id: "r2", date: "2026-06-30T16:02:17", patient: "Anonymous", riskPct: 12.4, heartAge: 46, notes: "Follow-up in 3 months" },
  { id: "r3", date: "2026-06-30T00:15:34", patient: "R. Sharma", riskPct: 0.8, heartAge: 40, notes: "" },
  { id: "r4", date: "2026-06-30T00:11:26", patient: "Anonymous", riskPct: 61.2, heartAge: 58, notes: "Referred to cardiologist" },
  { id: "r5", date: "2026-06-30T00:11:02", patient: "Anonymous", riskPct: 0.8, heartAge: 40, notes: "" },
  { id: "r6", date: "2026-06-30T00:10:59", patient: "A. Verma", riskPct: 28.5, heartAge: 51, notes: "" },
  { id: "r7", date: "2026-06-30T00:10:43", patient: "Anonymous", riskPct: 0.8, heartAge: 40, notes: "" },
  { id: "r8", date: "2026-06-29T22:32:29", patient: "Anonymous", riskPct: 0.8, heartAge: 40, notes: "" },
  { id: "r9", date: "2026-06-29T21:29:24", patient: "S. Iyer", riskPct: 45.0, heartAge: 54, notes: "" },
  { id: "r10", date: "2026-06-29T21:28:54", patient: "Anonymous", riskPct: 0.8, heartAge: 40, notes: "" },
  { id: "r11", date: "2026-06-29T21:27:21", patient: "Anonymous", riskPct: 0.8, heartAge: 40, notes: "" },
  { id: "r12", date: "2026-06-29T18:05:10", patient: "K. Nair", riskPct: 71.9, heartAge: 62, notes: "High priority" },
];

/* ===========================
      HELPERS
=========================== */
function getRiskLevel(pct) {
  if (pct < 20) return "Low";
  if (pct < 50) return "Moderate";
  return "High";
}

const RISK_STYLES = {
  Low: "bg-emerald-50 text-emerald-600",
  Moderate: "bg-amber-50 text-amber-600",
  High: "bg-red-50 text-red-600",
};

const RISK_DOT = {
  Low: "bg-emerald-500",
  Moderate: "bg-amber-500",
  High: "bg-red-500",
};

function formatDate(iso) {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const timePart = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
}

/* ===========================
      RISK BADGE
=========================== */
function RiskBadge({ pct }) {
  const level = getRiskLevel(pct);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${RISK_STYLES[level]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${RISK_DOT[level]}`} />
      {pct.toFixed(1)}% {level}
    </span>
  );
}

/* ===========================
      COMPONENT
=========================== */
export default function History() {
  const [records, setRecords] = useState(SAMPLE_HISTORY);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = useMemo(() => {
    let rows = [...records];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.patient.toLowerCase().includes(q));
    }

    if (riskFilter !== "all") {
      rows = rows.filter((r) => getRiskLevel(r.riskPct) === riskFilter);
    }

    switch (sortBy) {
      case "oldest":
        rows.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "highest":
        rows.sort((a, b) => b.riskPct - a.riskPct);
        break;
      case "lowest":
        rows.sort((a, b) => a.riskPct - b.riskPct);
        break;
      case "newest":
      default:
        rows.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
    }

    return rows;
  }, [records, search, riskFilter, sortBy]);

  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDownload = (record) => {
    // Placeholder — wire this up to real PDF/CSV export once the backend exists.
    console.log("Download requested for record:", record.id);
  };

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
              Records
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">Prediction History</h1>
            <p className="mt-1 text-sm text-slate-500">
              Search, filter, sort and manage past assessments.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient name..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="relative">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-40"
              >
                <option value="all">All risks</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-4 pr-9 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-44"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest risk</option>
                <option value="lowest">Lowest risk</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <p className="whitespace-nowrap text-xs font-medium text-slate-400 sm:ml-1">
              {filtered.length} of {records.length}
            </p>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                  <FiInbox className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  No records found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Date
                      </th>
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Risk
                      </th>
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Heart Age
                      </th>
                      <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {filtered.map((record) => (
                        <motion.tr
                          key={record.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/60"
                        >
                          <td className="whitespace-nowrap px-6 py-3.5 text-sm text-slate-600">
                            {formatDate(record.date)}
                          </td>
                          <td className="px-6 py-3.5 text-sm font-medium text-slate-900">
                            {record.patient}
                          </td>
                          <td className="px-6 py-3.5">
                            <RiskBadge pct={record.riskPct} />
                          </td>
                          <td className="px-6 py-3.5 text-sm text-slate-600">
                            {record.heartAge}
                          </td>
                          <td className="px-6 py-3.5 text-sm text-slate-400">
                            {record.notes || "—"}
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => handleDownload(record)}
                                className="text-slate-400 transition-colors hover:text-blue-600"
                                aria-label="Download report"
                              >
                                <FiDownload className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="text-slate-400 transition-colors hover:text-red-500"
                                aria-label="Delete record"
                              >
                                <FiTrash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}