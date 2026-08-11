// frontend/src/pages/Prediction/Prediction.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../services/api";

import {
  FiHeart,
  FiUser,
  FiActivity,
  FiArrowRight,
  FiGrid,
  FiFileText,
  FiSliders,
  FiMessageCircle,
  FiZap,
  FiUserCheck,
  FiSettings,
  FiMoon,
  FiClock,
} from "react-icons/fi";

import { FaHeartbeat, FaWeight } from "react-icons/fa";
import { BsActivity } from "react-icons/bs";

// ================= Sidebar =================

const navItems = [
  { icon: FiGrid, label: "Dashboard", path: "/dashboard" },
  { icon: FiUser, label: "Patient Details", path: "/patient-form" },
  { icon: FiFileText, label: "Medical Report", path: "/report" },
  {
    icon: FiHeart,
    label: "Risk Prediction",
    path: "/prediction",
    active: true,
  },
  { icon: FiActivity, label: "Results", path: "/results" },
  { icon: FiSliders, label: "What-If Simulator", path: "/whatif" },
  { icon: FiMessageCircle, label: "AI Assistant", path: "/assistant" },
  { icon: FiZap, label: "Lifestyle Tips", path: "/tips" },
  { icon: FiClock, label: "History", path: "/history" },
  { icon: FiSettings, label: "Settings", path: "/settings" },
];

const Prediction = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState("");

  const patientData = location.state?.patientData || {
    age: 50,
    sex: "1",
    trestbps: 120,
    chol: 200,
    thalach: 150,
    oldpeak: 1.0,
  };

  const getSexLabel = (sex) => {
    if (sex === "0") return "Female";
    if (sex === "1") return "Male";
    return sex;
  };

  const handlePredict = async () => {
    setIsPredicting(true);
    setError("");

    try {
      // Calls the real ML model on the backend (trained on the Cleveland dataset)
      const result = await apiFetch("/api/predict", {
        method: "POST",
        body: JSON.stringify(patientData),
      });

      // brief pause so the loading modal doesn't just flash instantly
      setTimeout(() => {
        setIsPredicting(false);
        navigate("/results", {
          state: {
            result,
            patientData,
          },
        });
      }, 800);
    } catch (err) {
      setIsPredicting(false);
      setError(err.message || "Prediction failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* ================= SIDEBAR ================= */}

      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shadow-sm min-h-screen">

        <div className="px-6 py-6 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">

              <FiHeart className="text-white w-5 h-5" />

            </div>

            <div>

              <h2 className="font-semibold text-[15px] text-slate-900">

                Heart Health Monitor

              </h2>

              <p className="text-[9px] tracking-[0.25em] uppercase text-slate-400 mt-1 font-medium">

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
                item.active
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >

              <item.icon
                className={`w-5 h-5 ${
                  item.active ? "text-white" : "text-slate-500"
                }`}
              />

              {item.label}

            </button>

          ))}

        </nav>

        <div className="px-6 py-5 border-t border-slate-100">

          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-[10px] tracking-widest uppercase text-slate-500 font-semibold">

              AI MODEL

            </p>

            <h3 className="mt-1 text-sm font-bold text-slate-900">

              XGBoost v2.0

            </h3>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <div className="flex-1 flex flex-col min-h-screen">

        {/* ================= HEADER ================= */}

        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10">

          <div>

            <div className="flex items-center gap-3">

              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide">

                STEP 3

              </span>

              <h1 className="text-[32px] font-bold tracking-tight text-slate-900">

                Risk Prediction

              </h1>

            </div>

            <p className="mt-2 text-sm text-slate-500">

              Review the patient's clinical summary before running the AI
              prediction model.

            </p>

          </div>

          <button className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all duration-300 flex items-center justify-center">

            <FiMoon className="w-5 h-5 text-slate-600" />

          </button>

        </header>

        {/* ================= PAGE ================= */}

        <main className="flex-1 overflow-y-auto relative">

          <div className="max-w-5xl mx-auto px-10 py-10">

            {/* Background Decoration */}

            <div className="absolute right-12 top-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            <div className="absolute left-20 bottom-20 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            {/* ================= GLASS CARD ================= */}

            <div
              className="relative overflow-hidden
              rounded-[30px]
              border border-white/40
              bg-white/80
              backdrop-blur-xl
              shadow-[0_20px_60px_rgba(15,23,42,.08)]"
            >

              {/* Gradient Background */}

              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-50"></div>

              {/* Decorative Circle */}

              <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-blue-100 opacity-30 blur-2xl"></div>

              <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-red-100 opacity-20 blur-2xl"></div>

              {/* Card Content */}

              <div className="relative p-10">

                {/* ================= TITLE ================= */}

                <div className="flex items-center gap-4 mb-8">

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">

                    <FiHeart className="text-white text-xl" />

                  </div>

                  <div>

                    <p className="uppercase tracking-[0.28em] text-[11px] font-semibold text-slate-400">

                      Patient Summary

                    </p>

                    <h2 className="text-[28px] font-bold text-slate-900 mt-1">

                      Anonymous · {patientData.age}y · {getSexLabel(patientData.sex)}

                    </h2>

                    <p className="text-sm text-slate-500 mt-1">

                      Clinical parameters ready for AI evaluation

                    </p>

                  </div>

                </div>

                {error && (
                  <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* ===== METRIC CARDS ===== */}

                <div className="grid grid-cols-5 gap-5">

                  {/* ================= BP ================= */}

                  <div className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">

                      <FiActivity className="text-red-500 text-lg" />

                    </div>

                    <p className="uppercase tracking-[0.18em] text-[10px] font-semibold text-slate-400">
                      Blood Pressure
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {patientData.trestbps || 120}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      mmHg
                    </p>

                  </div>

                  {/* ================= Cholesterol ================= */}

                  <div className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">

                      <FiHeart className="text-orange-500 text-lg" />

                    </div>

                    <p className="uppercase tracking-[0.18em] text-[10px] font-semibold text-slate-400">
                      Cholesterol
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {patientData.chol || 200}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      mg/dL
                    </p>

                  </div>

                  {/* ================= MAX HR ================= */}

                  <div className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">

                      <FaHeartbeat className="text-blue-500 text-lg" />

                    </div>

                    <p className="uppercase tracking-[0.18em] text-[10px] font-semibold text-slate-400">
                      Max Heart Rate
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {patientData.thalach || 150}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      bpm
                    </p>

                  </div>

                  {/* ================= OLDPEAK ================= */}

                  <div className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">

                      <BsActivity className="text-green-500 text-lg" />

                    </div>

                    <p className="uppercase tracking-[0.18em] text-[10px] font-semibold text-slate-400">
                      Oldpeak
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {patientData.oldpeak || 1.0}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      ST Depression
                    </p>

                  </div>

                  {/* ================= BMI ================= */}

                  <div className="group rounded-3xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-4">

                      <FaWeight className="text-purple-500 text-lg" />

                    </div>

                    <p className="uppercase tracking-[0.18em] text-[10px] font-semibold text-slate-400">
                      BMI
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {patientData.bmi || 24.9}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      kg/m²
                    </p>

                  </div>

                </div>

                {/* ================= BUTTON - BLUE ================= */}

                <div className="mt-10 flex justify-center">

                  <button
                    onClick={handlePredict}
                    disabled={isPredicting}
                    className={`group flex items-center gap-3 rounded-full px-10 py-4 text-[15px] font-semibold text-white transition-all duration-300
                    ${
                      isPredicting
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:scale-[1.03] hover:shadow-2xl shadow-lg"
                    }`}
                  >
                    {isPredicting ? (
                      <>
                        <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
                        Running AI Analysis...
                      </>
                    ) : (
                      <>
                        <FiHeart className="text-lg" />

                        Predict Heart Disease Risk

                        <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

      {/* ================= LOADING MODAL ================= */}

      {isPredicting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">

          <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl w-[420px] p-10 text-center">

            {/* Background Glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50"></div>

            <div className="relative">

              {/* Animated Circle */}

              <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center mb-6">

                <div className="w-12 h-12 border-[5px] border-red-500 border-t-transparent rounded-full animate-spin"></div>

              </div>

              <h2 className="text-2xl font-bold text-slate-900">

                AI Analysis in Progress

              </h2>

              <p className="mt-3 text-slate-500 leading-relaxed">

                Our AI model is analyzing the patient's clinical
                parameters and calculating the heart disease risk.

              </p>

              {/* Progress */}

              <div className="mt-8">

                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse"
                    style={{ width: "70%" }}
                  ></div>

                </div>

                <p className="mt-3 text-sm text-slate-500">

                  Processing medical records...

                </p>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Prediction;