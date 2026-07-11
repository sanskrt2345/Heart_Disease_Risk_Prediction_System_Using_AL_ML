// frontend/src/pages/Report/Report.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const newReports = Array.from(files).map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        date: new Date().toISOString(),
      }));
      setReports((prev) => [...newReports, ...prev]);
    }
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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const newReports = Array.from(files).map((file) => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        date: new Date().toISOString(),
      }));
      setReports((prev) => [...newReports, ...prev]);
    }
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
              Upload and manage patient medical reports
            </p>
          </div>
          <button className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center">
            <FiMoon className="w-5 h-5 text-slate-600" />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
            
            {/* Upload Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FiUpload className="w-5 h-5 text-blue-600" />
                  Upload Report
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Drop a PDF or image of the medical report and we'll extract key parameters.
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
                      <FiUpload className={`w-8 h-8 ${
                        isDragging ? "text-blue-600" : "text-slate-400"
                      }`} />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {isDragging ? "Drop your files here" : "Drag & drop or click to browse"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        PDF, PNG, JPG, JPEG - up to 8MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload History */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <FiClock className="w-5 h-5 text-slate-500" />
                  Upload History
                </h2>
              </div>

              <div className="p-6">
                {reports.length === 0 ? (
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
                              {new Date(report.date).toLocaleDateString()} • 
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