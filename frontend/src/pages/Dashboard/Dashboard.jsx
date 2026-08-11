// frontend/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroCorridor from "../../assets/images/hero-corridor.jpg";
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
  FiUserCheck,
  FiSettings,
  FiMoon,
  FiArrowRight,
  FiUpload,
  FiTrendingUp,
  FiChevronRight,
} from "react-icons/fi";

/* ===========================
      SIDEBAR MENU
=========================== */

const navItems = [
  { icon: FiGrid, label: "Dashboard", path: "/dashboard", active: true },
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

/* ===========================
      QUICK ACTIONS
=========================== */

const quickActions = [
  {
    icon: FiHeart,
    label: "New Prediction",
    path: "/prediction",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: FiUpload,
    label: "Upload Report",
    path: "/report",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: FiSliders,
    label: "What-If Analysis",
    path: "/whatif",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: FiZap,
    label: "Health Tips",
    path: "/tips",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
];

/* ===========================
      COMPONENT
=========================== */

const Dashboard = () => {
  const navigate = useNavigate();

  const [hoverIdx, setHoverIdx] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/dashboard/summary")
      .then(setSummary)
      .catch((err) => setError(err.message || "Couldn't load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const hasData = summary && summary.totalAssessments > 0;

  const statCards = [
    {
      label: "Current Risk Score",
      value: hasData ? `${summary.latestRiskPct}%` : "-",
      sub: hasData ? summary.latestRiskLevel : "No assessments yet",
      badge: FiHeart,
      badgeBg: hasData && summary.latestRiskLevel === "High Risk" ? "bg-red-500" : "bg-emerald-500",
    },
    {
      label: "Heart Age",
      value: hasData && summary.latestHeartAge != null ? summary.latestHeartAge : "-",
      sub: "vs chronological age",
      badge: FiActivity,
      badgeBg: "bg-blue-500",
    },
    {
      label: "Health Score",
      value: hasData && summary.averageHealthScore != null ? summary.averageHealthScore : "-",
      sub: "0 - 100 wellness",
      badge: FiZap,
      badgeBg: "bg-emerald-500",
    },
    {
      label: "Total Assessments",
      value: summary ? summary.totalAssessments : "-",
      sub: "Across all sessions",
      badge: FiUserCheck,
      badgeBg: "bg-blue-500",
    },
  ];

  const trendData = hasData && summary.trend.length > 0 ? summary.trend : [];

  const chartW = 620;
  const chartH = 220;
  const maxY = 100;

  const stepX = trendData.length > 1 ? chartW / (trendData.length - 1) : chartW;

  const yToPx = (v) => chartH - (v / maxY) * chartH;

  const points = trendData
    .map((d, i) => `${i * stepX},${yToPx(d.score)}`)
    .join(" ");

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
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
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                window.location.pathname === item.path
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className={`w-5 h-5 ${window.location.pathname === item.path ? "text-white" : "text-slate-500"}`} />
              {item.label}
            </button>
          ))}
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

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back! Monitor your heart health insights.
            </p>
          </div>
          <button className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center">
            <FiMoon className="w-5 h-5 text-slate-600" />
          </button>
        </header>

        {/* Main Container */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1180px] mx-auto px-8 py-8 space-y-8">

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* ================= HERO SECTION ================= */}
            <section
              className="relative overflow-hidden rounded-[32px] min-h-[220px] px-12 py-10 bg-cover bg-center shadow-xl"
              style={{
                backgroundImage: `url(${heroCorridor})`,
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07111F]/95 via-[#13233E]/65 to-[#13233E]/25"></div>

              {/* Decorative Blur */}
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-red-500/10 rounded-full blur-3xl"></div>

              {/* Content */}
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold tracking-[0.25em] uppercase border border-blue-400/20">
                  AI Powered Cardiology
                </span>

                <h1 className="mt-5 text-4xl font-bold leading-tight text-white">
                  Welcome to your
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
                    Heart Health Monitor
                  </span>
                </h1>

                <p className="mt-4 text-sm text-slate-300 leading-7 max-w-xl">
                  Predict cardiovascular disease risk using our advanced
                  XGBoost-powered AI engine trained on real clinical data.
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={() => navigate("/prediction")}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-semibold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <FiHeart className="w-5 h-5 text-red-500" />
                    New Prediction
                  </button>

                  <button
                    onClick={() => navigate("/patient-form")}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-md text-white font-semibold hover:bg-white/20 transition-all duration-300"
                  >
                    <FiUser className="w-5 h-5" />
                    Patient Details
                  </button>
                </div>
              </div>
            </section>

            {/* ===================== STATS CARDS ===================== */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {statCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-[20px] border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                        {card.label}
                      </p>
                      <h2 className="text-3xl font-bold text-slate-900 mt-3">
                        {loading ? "..." : card.value}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {card.sub}
                      </p>
                    </div>
                    <div
                      className={`w-11 h-11 rounded-2xl ${card.badgeBg} flex items-center justify-center shadow-md`}
                    >
                      <card.badge className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* ===================== CHART + QUICK ACTION LAYOUT ===================== */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* ===================== HEALTH TREND ===================== */}
              <div className="xl:col-span-2 bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                      WEEKLY HEALTH
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      Risk & Health Score Trend
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                  >
                    View Details
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Chart or empty state */}
                {loading ? (
                  <div className="mt-6 h-56 flex items-center justify-center text-sm text-slate-400">
                    Loading...
                  </div>
                ) : trendData.length === 0 ? (
                  <div className="mt-6 h-56 flex flex-col items-center justify-center text-center gap-2">
                    <FiTrendingUp className="text-slate-300 w-8 h-8" />
                    <p className="text-sm text-slate-500">
                      No assessments yet - run your first prediction to see your trend here.
                    </p>
                    <button
                      onClick={() => navigate("/prediction")}
                      className="mt-2 text-sm text-blue-600 font-semibold"
                    >
                      Run a prediction →
                    </button>
                  </div>
                ) : trendData.length === 1 ? (
                  <div className="mt-6 h-56 flex flex-col items-center justify-center text-center gap-1">
                    <p className="text-3xl font-bold text-slate-900">{trendData[0].score}</p>
                    <p className="text-sm text-slate-500">
                      Health score from your latest assessment. Run more predictions to see a trend.
                    </p>
                  </div>
                ) : (
                  <div className="relative mt-6">
                    <svg
                      viewBox={`0 0 ${chartW} ${chartH}`}
                      className="w-full h-56"
                      onMouseLeave={() => setHoverIdx(null)}
                    >
                      {/* Y-axis grid lines */}
                      {[0, 25, 50, 75, 100].map((v) => (
                        <line
                          key={v}
                          x1={0}
                          x2={chartW}
                          y1={yToPx(v)}
                          y2={yToPx(v)}
                          stroke="#E2E8F0"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                      ))}

                      {/* Y-axis labels */}
                      <text x="-18" y={yToPx(100) + 4} className="text-xs fill-slate-400 font-medium">
                        100
                      </text>
                      <text x="-18" y={yToPx(75) + 4} className="text-xs fill-slate-400 font-medium">
                        75
                      </text>
                      <text x="-18" y={yToPx(50) + 4} className="text-xs fill-slate-400 font-medium">
                        50
                      </text>
                      <text x="-18" y={yToPx(25) + 4} className="text-xs fill-slate-400 font-medium">
                        25
                      </text>
                      <text x="-18" y={yToPx(0) + 4} className="text-xs fill-slate-400 font-medium">
                        0
                      </text>

                      {/* Area under the curve */}
                      <polygon
                        points={`0,${chartH} ${points} ${(trendData.length - 1) * stepX},${chartH}`}
                        fill="url(#blueGradient)"
                        opacity="0.15"
                      />

                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <polyline
                        points={points}
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {trendData.map((d, index) => (
                        <g key={index}>
                          <rect
                            x={index * stepX - stepX / 2}
                            y={0}
                            width={stepX}
                            height={chartH}
                            fill="transparent"
                            onMouseEnter={() => setHoverIdx(index)}
                          />
                          <circle
                            cx={index * stepX}
                            cy={yToPx(d.score)}
                            r={hoverIdx === index ? 8 : 5}
                            fill="#3B82F6"
                            stroke="white"
                            strokeWidth="2.5"
                            className="transition-all duration-200 cursor-pointer"
                          />
                        </g>
                      ))}
                    </svg>

                    {/* Tooltip */}
                    {hoverIdx !== null && (
                      <div
                        className="absolute bg-white rounded-xl shadow-xl border border-slate-200 px-4 py-3 text-sm"
                        style={{
                          left: `${(hoverIdx / (trendData.length - 1)) * 100}%`,
                          top: `${yToPx(trendData[hoverIdx].score) - 85}px`,
                          transform: "translateX(-50%)",
                          minWidth: "120px",
                        }}
                      >
                        <p className="font-semibold text-slate-800 text-center">
                          {trendData[hoverIdx].day}
                        </p>
                        <div className="flex justify-between gap-3 mt-1">
                          <span className="text-xs text-slate-500">Risk:</span>
                          <span className="text-xs font-semibold text-red-500">
                            {trendData[hoverIdx].risk}%
                          </span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-xs text-slate-500">Score:</span>
                          <span className="text-xs font-semibold text-emerald-600">
                            {trendData[hoverIdx].score}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* X Axis */}
                {trendData.length > 1 && (
                  <div className="flex justify-between mt-2 text-xs text-slate-400 px-1 font-medium">
                    {trendData.map((d, index) => (
                      <span key={index}>{d.day}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* ===================== QUICK ACTIONS ===================== */}
              <div className="space-y-5">
                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-6">
                  <div className="mb-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                      QUICK ACTIONS
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      Start Your Journey
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(action.path)}
                        className="w-full flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center`}>
                            <action.icon className={`w-5 h-5 ${action.color}`} />
                          </div>
                          <span className="font-medium text-slate-700 text-sm">
                            {action.label}
                          </span>
                        </div>
                        <FiArrowRight className="text-slate-300 group-hover:text-slate-600 transition-colors w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* ================= DAILY TIP ================= */}
                <div className="rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FiHeart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-blue-100 font-semibold">
                        DAILY TIP
                      </p>
                      <h3 className="font-bold text-base mt-0.5">
                        Keep Your Heart Healthy ❤️
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm text-blue-100 leading-6 mt-2">
                    Aim for <strong>30 minutes</strong> of brisk walking 
                    <strong> 5 days</strong> a week — proven to reduce 
                    cardiovascular risk by up to <strong>19%</strong>.
                  </p>
                  <button
                    onClick={() => navigate("/tips")}
                    className="mt-4 w-full rounded-xl bg-white/20 backdrop-blur-sm text-white py-2.5 font-semibold hover:bg-white/30 transition border border-white/20"
                  >
                    View More Tips
                  </button>
                </div>
              </div>
            </section>

            {/* ===================== FOOTER ===================== */}
            <footer className="pt-2 pb-6">
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  © 2026 Heart Health Monitor • AI Powered Heart Disease Risk Prediction
                </p>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;