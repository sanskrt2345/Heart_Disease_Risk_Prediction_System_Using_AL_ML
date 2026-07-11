import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

// ---------------------------------------------------------------------------
// Sidebar — matches Dashboard.jsx exactly: react-icons/fi, red gradient
// logo, slate/blue palette, useNavigate + current-path active highlight.
// ---------------------------------------------------------------------------
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
  // useLocation (not window.location.pathname) so the active item updates
  // immediately on client-side navigation instead of only after a reload.
  const location = useLocation();

  return (
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
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500"}`} />
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
  );
}

// ---------------------------------------------------------------------------
// Slider primitive — label + value on top, native range styled to match the
// thin blue track / dark thumb look from the screenshot, min/max captions.
// ---------------------------------------------------------------------------
function SliderField({ label, value, min, max, step = 1, unit = "", onChange }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-slate-900">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input w-full"
        style={{ "--pct": `${pct}%` }}
      />
      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between text-sm text-slate-600">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
      />
    </label>
  );
}

// ---------------------------------------------------------------------------
// Baseline values — same starting point shown in the screenshot.
// ---------------------------------------------------------------------------
const BASELINE = {
  bloodPressure: 120,
  cholesterol: 200,
  bmi: 24.9,
  maxHeartRate: 150,
  stDepression: 1,
  stress: 2,
  sleep: 7,
  dailySteps: 6000,
  waterIntake: 2,
  physicalActivity: 1,
  smoking: false,
  healthyDiet: true,
};

// Very simple illustrative risk model, 0-100. Not medical advice — just
// enough signal to drive the "Improvement" panel reactively.
function computeRisk(v) {
  let score = 0;
  score += Math.max(0, v.bloodPressure - 110) * 0.35;
  score += Math.max(0, v.cholesterol - 170) * 0.1;
  score += Math.max(0, v.bmi - 22) * 1.6;
  score += Math.max(0, 140 - v.maxHeartRate) * 0.12;
  score += v.stDepression * 4;
  score += v.stress * 3.2;
  score += Math.max(0, 7 - v.sleep) * 2.5;
  score += Math.max(0, 8000 - v.dailySteps) * 0.0015;
  score += Math.max(0, 2 - v.waterIntake) * 2;
  score += Math.max(0, 1 - v.physicalActivity) * 5;
  score += v.smoking ? 18 : 0;
  score -= v.healthyDiet ? 6 : 0;
  return Math.min(100, Math.max(2, Math.round(score)));
}

export default function Whatif() {
  const [values, setValues] = useState(BASELINE);

  const baselineRisk = useMemo(() => computeRisk(BASELINE), []);
  const currentRisk = useMemo(() => computeRisk(values), [values]);

  const riskReduction = Math.round(
    ((baselineRisk - currentRisk) / baselineRisk) * 100
  );
  const heartAgeDelta = Math.round((baselineRisk - currentRisk) / 4);

  const set = (key) => (val) => setValues((prev) => ({ ...prev, [key]: val }));
  const reset = () => setValues(BASELINE);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <p className="text-[11px] font-semibold tracking-widest text-blue-600">
            SIMULATOR
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">What-If Simulator</h1>
          <p className="mt-1 text-sm text-slate-500">
            Slide variables to see how lifestyle changes reshape the risk in real time.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
            {/* Left column: risk gauge + improvement */}
            <div className="space-y-6">
              <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="text-center">
                  <p className="text-4xl font-bold text-slate-900">{currentRisk}%</p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Predicted 10-year risk
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <p className="text-[11px] font-semibold tracking-widest text-emerald-700">
                  IMPROVEMENT
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Risk reduction</p>
                    <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-emerald-600">
                      <FiActivity className="h-4 w-4" />
                      {riskReduction > 0 ? riskReduction : 0}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Heart-age delta</p>
                    <p className="mt-1 flex items-center gap-1 text-lg font-semibold text-blue-600">
                      <FiHeart className="h-4 w-4" />
                      {heartAgeDelta > 0 ? `-${heartAgeDelta}` : heartAgeDelta}
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-24 rounded-lg border border-emerald-100 bg-white/60" />
              </div>

              <button
                onClick={reset}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Reset to baseline
              </button>
            </div>

            {/* Right column: sliders grid */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
                <SliderField
                  label="Blood Pressure"
                  unit=" mmHg"
                  min={80}
                  max={200}
                  value={values.bloodPressure}
                  onChange={set("bloodPressure")}
                />
                <SliderField
                  label="Cholesterol"
                  unit=" mg/dL"
                  min={120}
                  max={400}
                  value={values.cholesterol}
                  onChange={set("cholesterol")}
                />
                <SliderField
                  label="BMI"
                  min={15}
                  max={45}
                  step={0.1}
                  value={values.bmi}
                  onChange={set("bmi")}
                />
                <SliderField
                  label="Max Heart Rate"
                  unit=" bpm"
                  min={70}
                  max={220}
                  value={values.maxHeartRate}
                  onChange={set("maxHeartRate")}
                />
                <SliderField
                  label="ST Depression"
                  min={0}
                  max={6}
                  step={0.1}
                  value={values.stDepression}
                  onChange={set("stDepression")}
                />
                <SliderField
                  label="Stress (1-5)"
                  min={1}
                  max={5}
                  value={values.stress}
                  onChange={set("stress")}
                />
                <SliderField
                  label="Sleep"
                  unit="h"
                  min={3}
                  max={11}
                  value={values.sleep}
                  onChange={set("sleep")}
                />
                <SliderField
                  label="Daily Steps"
                  min={0}
                  max={20000}
                  step={100}
                  value={values.dailySteps}
                  onChange={set("dailySteps")}
                />
                <SliderField
                  label="Water Intake"
                  unit="L"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={values.waterIntake}
                  onChange={set("waterIntake")}
                />
                <SliderField
                  label="Physical Activity"
                  min={0}
                  max={2}
                  value={values.physicalActivity}
                  onChange={set("physicalActivity")}
                />

                <Checkbox
                  label="Smoking"
                  checked={values.smoking}
                  onChange={set("smoking")}
                />
                <Checkbox
                  label="Healthy diet"
                  checked={values.healthyDiet}
                  onChange={set("healthyDiet")}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Slider thumb / track styling to match the reference look */}
      <style>{`
        .slider-input {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 9999px;
          background: linear-gradient(
            to right,
            #2563eb 0%,
            #2563eb var(--pct),
            #e2e8f0 var(--pct),
            #e2e8f0 100%
          );
          outline: none;
        }
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #1e293b;
          border: 3px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          cursor: pointer;
          margin-top: -6px;
        }
        .slider-input::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #1e293b;
          border: 3px solid #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
          cursor: pointer;
        }
        .slider-input::-moz-range-track {
          height: 4px;
          border-radius: 9999px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}