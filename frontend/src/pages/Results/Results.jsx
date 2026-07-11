// frontend/src/pages/Result/Result.jsx
import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

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
} from "react-icons/fi";

// Simple inline icon replacements (no external icon library needed)
const Download = (props) => (
  <svg width={props.size || 15} height={props.size || 15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
);
const Printer = (props) => (
  <svg width={props.size || 15} height={props.size || 15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
);
const Mail = (props) => (
  <svg width={props.size || 15} height={props.size || 15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
);

/* ===========================
      SIDEBAR MENU DATA
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
  { icon: FiUserCheck, label: "Doctor Panel", path: "/doctor" },
  { icon: FiSettings, label: "Settings", path: "/settings" },
];

// ---- Sample data (swap with your real API response) ----
const patient = {
  name: "Anonymous",
  generatedAt: "30/6/2026, 12:10:50 am",
  probability: 0.8, // %
  riskLabel: "Low risk",
  healthScore: 100,
  heartAge: 40,
  chronoAge: 32,
  confidence: 98.2,
  bmi: 24.9,
  bmiLabel: "Normal",
  bloodPressure: 120,
  bloodPressureLabel: "Elevated",
  cholesterol: 200,
  cholesterolLabel: "Borderline",
  recommendation:
    "Continue annual check-ups. Maintain healthy lifestyle and re-assess yearly.",
};
const riskFactors = [
  { name: "Chest pain type", value: 92 },
  { name: "Thalassemia", value: 68 },
  { name: "Major vessels colored", value: 34 },
  { name: "ST slope", value: 30 },
  { name: "Resting ECG", value: 22 },
  { name: "Exercise-induced angina", value: 18 },
];
const riskPie = [
  { name: "Cardiac risk", value: patient.probability },
  { name: "Safe margin", value: 100 - patient.probability },
];

// ---- Small building blocks ----
function StatCard({ label, value, sub, subTone }) {
  return (
    <div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className={`stat-sub tone-${subTone || "neutral"}`}>{sub}</div>}
    </div>
  );
}

function Gauge({ value }) {
  const angle = -90 + (value / 100) * 180;
  const radius = 78;
  const cx = 90;
  const cy = 90;
  const rad = (Math.PI / 180) * angle;
  const nx = cx + radius * Math.sin(rad);
  const ny = cy - radius * Math.cos(rad);
  const describeArc = (startAngle, endAngle) => {
    const polar = (a) => {
      const r = (Math.PI / 180) * a;
      return [cx + radius * Math.sin(r), cy - radius * Math.cos(r)];
    };
    const [sx, sy] = polar(startAngle);
    const [ex, ey] = polar(endAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 1 ${ex} ${ey}`;
  };
  return (
    <svg viewBox="0 0 180 110" width="100%" height="140">
      <path d={describeArc(-90, 90)} fill="none" stroke="#eceef1" strokeWidth="10" strokeLinecap="round" />
      <path d={describeArc(-90, angle)} fill="none" stroke="#22c55e" strokeWidth="10" strokeLinecap="round" />
      <circle cx={nx} cy={ny} r="6" fill="#22c55e" />
    </svg>
  );
}

const BAR_COLOR = "#3b6fe0";

export default function Result() {
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#f5f6f8",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`heart-risk-report-${patient.name.toLowerCase()}.pdf`);
    } catch (err) {
      console.error("Download failed:", err);
      alert(
        "Couldn't generate the PDF. Make sure html2canvas and jspdf are installed (npm install html2canvas jspdf)."
      );
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    const subject = `Heart disease risk report - ${patient.name}`;
    const body = [
      `Heart disease risk report`,
      `Generated for ${patient.name} · ${patient.generatedAt}`,
      ``,
      `Probability: ${patient.probability}% (${patient.riskLabel})`,
      `Heart age: ${patient.heartAge} (vs ${patient.chronoAge} chronological)`,
      `Confidence: ${patient.confidence}%`,
      `Health score: ${patient.healthScore}`,
      `BMI: ${patient.bmi} (${patient.bmiLabel})`,
      `Blood pressure: ${patient.bloodPressure} (${patient.bloodPressureLabel})`,
      `Cholesterol: ${patient.cholesterol} (${patient.cholesterolLabel})`,
      ``,
      `Doctor recommendation: ${patient.recommendation}`,
    ].join("\n");
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* ================= SIDEBAR (inline, same as Dashboard) ================= */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shadow-sm shrink-0">
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
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`}
                />
                {item.label}
              </button>
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

      {/* ================= MAIN CONTENT (original report) ================= */}
      <div className="hrr-page flex-1">
        <style>{`
          .hrr-page {
            background: #f5f6f8;
            padding: 24px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1a1d23;
          }
          .hrr-inner { max-width: 960px; margin: 0 auto; }
          .hrr-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
          }
          .hrr-eyebrow {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.06em;
            color: #8a8f99;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .hrr-title { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
          .hrr-subtitle { font-size: 13px; color: #8a8f99; }
          .hrr-actions { display: flex; gap: 8px; }
          .hrr-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 500;
            color: #1a1d23;
            background: #fff;
            border: 1px solid #e4e6eb;
            border-radius: 8px;
            padding: 8px 14px;
            cursor: pointer;
          }
          .hrr-btn:hover { background: #fafafa; }
          .hrr-top-grid {
            display: grid;
            grid-template-columns: 260px 1fr;
            gap: 16px;
            margin-bottom: 16px;
          }
          .hrr-card {
            background: #fff;
            border: 1px solid #eceef1;
            border-radius: 14px;
            padding: 20px;
          }
          .hrr-gauge-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .gauge-value { font-size: 26px; font-weight: 700; color: #22c55e; margin-top: 4px; }
          .gauge-caption { font-size: 13px; font-weight: 600; color: #22c55e; margin-top: 2px; }
          .hrr-stats-card { display: flex; flex-direction: column; gap: 18px; }
          .hrr-stats-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .stat-label {
            font-size: 10.5px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: #9aa0aa;
            margin-bottom: 6px;
          }
          .stat-value { font-size: 20px; font-weight: 700; color: #1a1d23; }
          .stat-value small { font-size: 11px; font-weight: 500; color: #9aa0aa; margin-left: 4px; }
          .stat-sub {
            display: inline-block;
            margin-top: 4px;
            font-size: 11px;
            font-weight: 600;
            padding: 1px 7px;
            border-radius: 5px;
          }
          .tone-neutral { background: #eef1f5; color: #5b6270; }
          .tone-warning { background: #fef3e0; color: #b7791f; }
          .tone-good { background: #e7f8ed; color: #16a34a; }
          .hrr-reco {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            background: #eef4ff;
            border-radius: 10px;
            padding: 12px 14px;
          }
          .hrr-reco-icon {
            width: 20px; height: 20px; flex: none; margin-top: 1px;
            color: #3b6fe0;
          }
          .hrr-reco-title {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: #3b6fe0;
            margin-bottom: 2px;
          }
          .hrr-reco-text { font-size: 13px; color: #495062; line-height: 1.4; }
          .hrr-bottom-grid {
            display: grid;
            grid-template-columns: 1.6fr 1fr;
            gap: 16px;
          }
          .hrr-card-title { font-size: 15px; font-weight: 700; margin: 0 0 2px; }
          .hrr-card-caption {
            font-size: 10.5px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: #9aa0aa;
            margin-bottom: 12px;
          }
          .hrr-footnote { font-size: 11px; color: #9aa0aa; margin-top: 8px; }
          .hrr-pie-wrap { display: flex; flex-direction: column; align-items: center; }
          .hrr-pie-legend { display: flex; gap: 14px; margin-top: 8px; font-size: 12px; color: #5b6270; }
          .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }
          @media (max-width: 700px) {
            .hrr-top-grid, .hrr-bottom-grid { grid-template-columns: 1fr; }
            .hrr-stats-row { grid-template-columns: repeat(2, 1fr); }
          }
          @media print {
            .hrr-actions { display: none !important; }
            .hrr-page { background: #fff; padding: 0; }
            .hrr-card { break-inside: avoid; }
          }
        `}</style>
        <div className="hrr-inner">
          {/* Header */}
          <div className="hrr-header">
            <div>
              <div className="hrr-eyebrow">Results</div>
              <h1 className="hrr-title">Heart disease risk report</h1>
              <div className="hrr-subtitle">
                Generated for {patient.name} · {patient.generatedAt}
              </div>
            </div>
            <div className="hrr-actions">
              <button className="hrr-btn" onClick={handleDownload} disabled={downloading}>
                <Download size={15} /> {downloading ? "Preparing..." : "Download"}
              </button>
              <button className="hrr-btn" onClick={handlePrint}>
                <Printer size={15} /> Print
              </button>
              <button className="hrr-btn" onClick={handleEmail}>
                <Mail size={15} /> Email
              </button>
            </div>
          </div>
          {/* Top row: gauge + stats */}
          <div ref={reportRef}>
            <div className="hrr-top-grid">
              <div className="hrr-card hrr-gauge-card">
                <Gauge value={patient.probability} />
                <div className="gauge-value">{patient.probability}%</div>
                <div className="gauge-caption">{patient.riskLabel}</div>
              </div>
              <div className="hrr-card hrr-stats-card">
                <div className="hrr-stats-row">
                  <StatCard label="Probability" value={`${patient.probability}%`} />
                  <StatCard
                    label="Heart age"
                    value={patient.heartAge}
                    sub={`vs ${patient.chronoAge} chronological`}
                    subTone="neutral"
                  />
                  <StatCard label="Confidence" value={`${patient.confidence}%`} />
                  <StatCard label="Health score" value={patient.healthScore} />
                  <StatCard
                    label="BMI"
                    value={patient.bmi}
                    sub={patient.bmiLabel}
                    subTone="good"
                  />
                  <StatCard
                    label="Blood pressure"
                    value={patient.bloodPressure}
                    sub={patient.bloodPressureLabel}
                    subTone="warning"
                  />
                  <StatCard
                    label="Cholesterol"
                    value={patient.cholesterol}
                    sub={patient.cholesterolLabel}
                    subTone="warning"
                  />
                </div>
                <div className="hrr-reco">
                  <Mail className="hrr-reco-icon" size={18} />
                  <div>
                    <div className="hrr-reco-title">Doctor recommendation</div>
                    <div className="hrr-reco-text">{patient.recommendation}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom row: bar chart + donut */}
            <div className="hrr-bottom-grid">
              <div className="hrr-card">
                <div className="hrr-card-caption">Feature impact (SHAP-like)</div>
                <div className="hrr-card-title">Top risk factors</div>
                <div style={{ width: "100%", height: 220, marginTop: 8 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={riskFactors}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={150}
                        tick={{ fontSize: 11, fill: "#8a8f99" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                        {riskFactors.map((_, i) => (
                          <Cell key={i} fill={BAR_COLOR} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="hrr-footnote">Higher bars indicate features that contributed more to this prediction.</div>
              </div>
              <div className="hrr-card">
                <div className="hrr-card-caption">Composition</div>
                <div className="hrr-card-title">Risk pie</div>
                <div className="hrr-pie-wrap">
                  <div style={{ width: "100%", height: 160 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={riskPie}
                          dataKey="value"
                          innerRadius={45}
                          outerRadius={65}
                          startAngle={90}
                          endAngle={-270}
                          stroke="none"
                        >
                          <Cell fill="#22c55e" />
                          <Cell fill="#eceef1" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="hrr-pie-legend">
                    <span><span className="legend-dot" style={{ background: "#22c55e" }} />Cardiac risk</span>
                    <span><span className="legend-dot" style={{ background: "#eceef1" }} />Safe margin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}