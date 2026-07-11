import React from "react";
import { useNavigate } from "react-router-dom";
import HeartAnimation from "../HeartAnimation/HeartAnimation";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
      {/* Left: text content */}
      <div>
        <span className="inline-flex items-center gap-2 bg-red-50 text-red-500 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          ❤ AI-Powered Cardiovascular Screening
        </span>
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
          Listen to Your
          <br />
          Heart,
          <br />
          <span className="text-red-500 italic">Predict</span>
          <br />
          <span className="underline decoration-red-200 decoration-4 underline-offset-4">
            Your Future
          </span>
        </h1>
        <p className="mt-6 text-gray-500 text-base max-w-md">
          AI-powered risk assessment in under 2 minutes. Clinically
          validated. Personal. Private.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="px-7 py-3 rounded-full
            bg-gradient-to-r from-red-500 to-orange-500
            text-white font-semibold text-sm
            shadow-lg hover:shadow-2xl
            hover:scale-105
            active:scale-95
            transition-all duration-300 ease-in-out"
          >
            Start Heart Analysis →
          </button>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            How it works →
          </a>
        </div>
        {/* trust row */}
        <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="text-red-400">✓</span> Clinically validated
          </span>
          <span className="flex items-center gap-1">
            <span className="text-red-400">❤</span> 50K+ users
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-500">●</span> HIPAA compliant
          </span>
        </div>
        {/* stats row */}
        <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-100 pt-6 max-w-md">
          <div>
            <p className="text-xl font-bold text-gray-900">97.3%</p>
            <p className="text-xs text-gray-400">Model accuracy</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">&lt; 2min</p>
            <p className="text-xs text-gray-400">Assessment time</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">14</p>
            <p className="text-xs text-gray-400">Biomarkers analyzed</p>
          </div>
        </div>
      </div>
      {/* Right: heart visual */}
      <HeartAnimation />
    </section>
  );
};

export default Hero;