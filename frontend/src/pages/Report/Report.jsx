// frontend/src/pages/Report/Report.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import {
  FiFileText,
  FiUpload,
  FiClock,
  FiGrid,
  FiUser,
  FiHeart,
  FiActivity,
  FiSliders,
  FiMessageCircle,
  FiZap,
  FiUserCheck,
  FiSettings,
  FiMoon,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

// Sidebar Navigation Items
const navItems = [
  { icon: FiGrid, label: "Dashboard", path: "/dashboard" },
  { icon: FiUser, label: "Patient Details", path: "/patient-form" },
  { icon: FiFileText, label: "Medical Report", path: "/report", active: true },
  { icon: FiHeart, label: "Risk Prediction", path: "/prediction" },
  { icon: FiActivity, label: "Results", path: "/results" },
  { icon: FiSliders, label: "What-If Simulator", path: "/whatif" },
  { icon: FiMessageCircle, label: "AI Assistant", path: "/assistant" },
  { icon: FiZap, label: "Lifestyle Tips", path: "/tips" },
  { icon: FiClock, label: "History", path: "/history" },
  { icon: FiSettings, label: "Settings", path: "/settings" },
];

const Report = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [lastResults, setLastResults] = useState([]); // extraction/prediction results from the latest upload

  const loadReports = async () => {
    try {
      const data = await apiFetch("/api/reports");
      setReports(data);
    } catch (err) {
      setError(err.message || "Couldn't load report history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const uploadFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setError("");
    setLastResults([]);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Array.from(fileList).forEach((file) => formData.append("files", file));

      const res = await fetch("http://localhost:8000/api/reports/upload", {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData, // don't set Content-Type manually - browser sets the multipart boundary
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Upload failed");
      }
      const uploadResults = await res.json(); // [{ report, extracted, patientData, result, message }, ...]

      setReports((prev) => [...uploadResults.map((r) => r.report), ...prev]);
      setLastResults(uploadResults);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    uploadFiles(e.target.files);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  const viewResult = (item) => {
    navigate("/results", {
      state: {
        result: item.result,
        patientData: item.patientData,
      },
    });
  };

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
                item.active
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? "text-white" : "text-slate-500"}`} />
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

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Medical Report</h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload a PDF report and we'll try to auto-detect risk factors and run a prediction.
            </p>
          </div>
          <button className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center">
            <FiMoon className="w-5 h-5 text-slate-600" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            {/* Upload Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FiUpload className="w-5 h-5 text-blue-600" />
                  Upload Report
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  PDF reports get scanned for clinical values automatically. Image reports are saved but not auto-analyzed yet.
                </p>
              </div>

              <div className="p-6">
                {/* Drag & Drop Area */}
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleUploadClick}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".pdf,.png,.jpg,.jpeg"
                    multiple
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isDragging ? "bg-blue-100" : "bg-slate-100"
                    }`}>
                      {uploading ? (
                        <div className="w-6 h-6 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FiUpload className={`w-8 h-8 ${
                          isDragging ? "text-blue-600" : "text-slate-400"
                        }`} />
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {uploading
                          ? "Uploading & analyzing..."
                          : isDragging
                          ? "Drop your files here"
                          : "Drag & drop or click to browse"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF, PNG, JPG, JPEG - up to 8MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest extraction / prediction results */}
            {lastResults.length > 0 && (
              <div className="space-y-4 mb-6">
                {lastResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {item.report.name}
                      </h3>
                      {item.result ? (
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            item.result.riskLevel === "High Risk"
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {item.result.riskLevel} · {item.result.riskPct}%
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                          Not analyzed
                        </span>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start gap-2 text-sm text-slate-600 mb-4">
                        {item.result ? (
                          <FiCheckCircle className="text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <FiAlertCircle className="text-amber-500 mt-0.5 shrink-0" />
                        )}
                        <p>{item.message}</p>
                      </div>

                      {item.extracted && Object.keys(item.extracted).length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                            Detected values
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(item.extracted).map(([key, val]) => (
                              <span
                                key={key}
                                className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium"
                              >
                                {key}: {String(val)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.result && (
                        <button
                          onClick={() => viewResult(item)}
                          className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          View full risk report →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload History */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-slate-500" />
                  Upload History
                </h2>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12 text-sm text-slate-400">Loading...</div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <FiFileText className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-500">No reports uploaded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FiFileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{report.name}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(report.date).toLocaleDateString()} •{" "}
                              {(report.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Report;