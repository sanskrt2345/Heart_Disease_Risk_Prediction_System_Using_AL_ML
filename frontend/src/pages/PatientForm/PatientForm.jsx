// frontend/src/pages/PatientForm/PatientForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiHeart,
  FiActivity,
  FiGrid,
  FiFileText,
  FiSliders,
  FiMessageCircle,
  FiZap,
  FiClock,
  FiUserCheck,
  FiSettings,
  FiSave,
} from "react-icons/fi";

/* ===========================
      SIDEBAR MENU
   (kept identical to Dashboard.jsx / Lifestyle.jsx)
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
      FIELD OPTIONS
   (encodings match Heart_disease_cleveland_new.csv exactly)
=========================== */
const SEX_OPTIONS = [
  { value: "0", label: "Female" },
  { value: "1", label: "Male" },
];

const YES_NO_OPTIONS = [
  { value: "0", label: "No" },
  { value: "1", label: "Yes" },
];

const CP_OPTIONS = [
  { value: "0", label: "Typical angina" },
  { value: "1", label: "Atypical angina" },
  { value: "2", label: "Non-anginal pain" },
  { value: "3", label: "Asymptomatic" },
];

const RESTECG_OPTIONS = [
  { value: "0", label: "Normal" },
  { value: "1", label: "ST-T wave abnormality" },
  { value: "2", label: "Left ventricular hypertrophy" },
];

const SLOPE_OPTIONS = [
  { value: "0", label: "Upsloping" },
  { value: "1", label: "Flat" },
  { value: "2", label: "Downsloping" },
];

const CA_OPTIONS = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
];

const THAL_OPTIONS = [
  { value: "1", label: "Normal" },
  { value: "2", label: "Fixed defect" },
  { value: "3", label: "Reversible defect" },
];

const SMOKING_OPTIONS = [
  { value: "non-smoker", label: "Non-smoker" },
  { value: "former", label: "Former smoker" },
  { value: "current", label: "Current smoker" },
];

const ALCOHOL_OPTIONS = [
  { value: "none", label: "None / rare" },
  { value: "moderate", label: "Moderate" },
  { value: "heavy", label: "Heavy" },
];

const ACTIVITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
];

const DIET_OPTIONS = [
  { value: "balanced", label: "Balanced" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "low-carb", label: "Low-carb" },
  { value: "high-protein", label: "High-protein" },
];

/* ===========================
      INITIAL STATE
=========================== */
const INITIAL_FORM = {
  // Personal / lifestyle
  name: "",
  age: "",
  sex: "",
  height: "",
  weight: "",
  bmi: "",
  occupation: "",
  smoking: "",
  alcohol: "",
  familyHistory: "",
  physicalActivity: "",
  dailySteps: "",
  sleepHours: "",
  stressLevel: 2,
  dietType: "",
  waterIntake: "",

  // Clinical (feeds the ML model directly)
  cp: "",
  trestbps: "",
  chol: "",
  fbs: "",
  restecg: "",
  thalach: "",
  exang: "",
  oldpeak: "",
  slope: "",
  ca: "",
  thal: "",
  medications: "",
  previousHeartDisease: "",
  diabetes: "",
  hypertension: "",
};

/* ===========================
      REUSABLE FIELD
=========================== */
function Label({ children, required }) {
  return (
    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function TextField({ label, name, value, onChange, error, placeholder, hint, required, type = "text", ...rest }) {
  return (
    <div>
      <Label required={required}>
        {label}
        {hint && <span className="ml-2 font-normal normal-case text-slate-400">{hint}</span>}
      </Label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors ${
          error ? "border-red-400" : "border-slate-200"
        } focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, options, hint, required, placeholder = "Select" }) {
  return (
    <div>
      <Label required={required}>
        {label}
        {hint && <span className="ml-2 font-normal normal-case text-slate-400">{hint}</span>}
      </Label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors ${
          error ? "border-red-400" : "border-slate-200"
        } focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function ReadOnlyField({ label, value, hint }) {
  return (
    <div>
      <Label>
        {label}
        {hint && <span className="ml-2 font-normal normal-case text-slate-400">{hint}</span>}
      </Label>
      <div className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700">
        {value || "—"}
      </div>
    </div>
  );
}

function SliderField({ label, name, value, onChange, min = 1, max = 5 }) {
  return (
    <div>
      <Label>{label} ({min}-{max})</Label>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full accent-blue-600"
      />
      <p className="mt-1 text-xs text-slate-400">Current: {value}/{max}</p>
    </div>
  );
}

/* ===========================
      STEP INDICATOR
=========================== */
function StepPill({ index, label, currentStep }) {
  const isDone = currentStep > index;
  const isActive = currentStep === index;
  return (
    <motion.div
      layout
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        isDone
          ? "bg-emerald-50 text-emerald-600"
          : isActive
          ? "bg-blue-600 text-white shadow-sm"
          : "bg-slate-100 text-slate-400"
      }`}
    >
      {isDone ? <FiCheck className="h-3.5 w-3.5" /> : <span>{index}</span>}
      {label}
    </motion.div>
  );
}

/* ===========================
      COMPONENT
=========================== */
export default function PatientForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1 = Personal, 2 = Clinical
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Auto-calculate BMI whenever height or weight changes.
  useEffect(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) {
      const heightM = h / 100;
      const bmi = (w / (heightM * heightM)).toFixed(1);
      setFormData((prev) => (prev.bmi === bmi ? prev : { ...prev, bmi }));
    } else if (formData.bmi !== "") {
      setFormData((prev) => (prev.bmi === "" ? prev : { ...prev, bmi: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.height, formData.weight]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.age) newErrors.age = "Age is required";
      if (!formData.sex) newErrors.sex = "Sex is required";
    }

    if (step === 2) {
      if (!formData.cp) newErrors.cp = "Chest pain type is required";
      if (!formData.trestbps) newErrors.trestbps = "Resting blood pressure is required";
      if (!formData.chol) newErrors.chol = "Cholesterol level is required";
      if (!formData.fbs) newErrors.fbs = "Fasting blood sugar is required";
      if (!formData.restecg) newErrors.restecg = "Resting ECG is required";
      if (!formData.thalach) newErrors.thalach = "Max heart rate is required";
      if (!formData.exang) newErrors.exang = "Exercise-induced angina is required";
      if (!formData.oldpeak && formData.oldpeak !== "0") newErrors.oldpeak = "Old peak is required";
      if (!formData.slope) newErrors.slope = "ST slope is required";
      if (!formData.ca) newErrors.ca = "Major vessels is required";
      if (!formData.thal) newErrors.thal = "Thalassemia type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(1)) setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(2)) {
      navigate("/prediction", { state: { patientData: formData } });
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto px-10 py-10">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-start justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-blue-600 uppercase">
                Form
              </p>
              <h1 className="mt-1 text-3xl font-bold text-slate-900">Patient Details</h1>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the patient profile to generate a personalized cardiovascular risk assessment.
              </p>
            </div>
          </motion.div>

          {/* Step indicator */}
          <div className="mt-6 flex items-center gap-3">
            <StepPill index={1} label="Personal" currentStep={currentStep} />
            <div
              className={`h-0.5 flex-1 rounded-full transition-colors ${
                currentStep > 1 ? "bg-emerald-300" : "bg-slate-200"
              }`}
            />
            <StepPill index={2} label="Clinical" currentStep={currentStep} />
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit}>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="grid grid-cols-1 gap-5 md:grid-cols-3"
                  >
                    <TextField
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                    />
                    <TextField
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      error={errors.age}
                      hint="(29-77)"
                      required
                      min="29"
                      max="77"
                      placeholder="Enter age"
                    />
                    <SelectField
                      label="Sex"
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      error={errors.sex}
                      options={SEX_OPTIONS}
                      required
                    />

                    <TextField
                      label="Height"
                      name="height"
                      type="number"
                      value={formData.height}
                      onChange={handleChange}
                      hint="(cm)"
                      placeholder="170"
                    />
                    <TextField
                      label="Weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleChange}
                      hint="(kg)"
                      placeholder="72"
                    />
                    <ReadOnlyField label="BMI" value={formData.bmi} hint="Auto-calculated" />

                    <TextField
                      label="Occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                    />
                    <SelectField
                      label="Smoking"
                      name="smoking"
                      value={formData.smoking}
                      onChange={handleChange}
                      options={SMOKING_OPTIONS}
                    />
                    <SelectField
                      label="Alcohol"
                      name="alcohol"
                      value={formData.alcohol}
                      onChange={handleChange}
                      options={ALCOHOL_OPTIONS}
                    />

                    <SelectField
                      label="Family History"
                      name="familyHistory"
                      value={formData.familyHistory}
                      onChange={handleChange}
                      options={YES_NO_OPTIONS}
                    />
                    <SelectField
                      label="Physical Activity"
                      name="physicalActivity"
                      value={formData.physicalActivity}
                      onChange={handleChange}
                      options={ACTIVITY_OPTIONS}
                    />
                    <TextField
                      label="Daily Steps"
                      name="dailySteps"
                      type="number"
                      value={formData.dailySteps}
                      onChange={handleChange}
                      placeholder="6000"
                    />

                    <TextField
                      label="Sleep Hours"
                      name="sleepHours"
                      type="number"
                      value={formData.sleepHours}
                      onChange={handleChange}
                      placeholder="7"
                    />
                    <SliderField
                      label="Stress Level"
                      name="stressLevel"
                      value={formData.stressLevel}
                      onChange={handleChange}
                      min={1}
                      max={5}
                    />
                    <SelectField
                      label="Diet Type"
                      name="dietType"
                      value={formData.dietType}
                      onChange={handleChange}
                      options={DIET_OPTIONS}
                    />

                    <TextField
                      label="Water Intake"
                      name="waterIntake"
                      type="number"
                      step="0.1"
                      value={formData.waterIntake}
                      onChange={handleChange}
                      hint="(L/day)"
                      placeholder="2"
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="grid grid-cols-1 gap-5 md:grid-cols-3"
                  >
                    <SelectField
                      label="Chest Pain Type"
                      name="cp"
                      value={formData.cp}
                      onChange={handleChange}
                      error={errors.cp}
                      options={CP_OPTIONS}
                      required
                    />
                    <TextField
                      label="Resting Blood Pressure"
                      name="trestbps"
                      type="number"
                      value={formData.trestbps}
                      onChange={handleChange}
                      error={errors.trestbps}
                      hint="(mmHg, 94-200)"
                      required
                      min="94"
                      max="200"
                      placeholder="122"
                    />
                    <TextField
                      label="Cholesterol"
                      name="chol"
                      type="number"
                      value={formData.chol}
                      onChange={handleChange}
                      error={errors.chol}
                      hint="(mg/dl, 126-564)"
                      required
                      min="126"
                      max="564"
                      placeholder="200"
                    />

                    <SelectField
                      label="Fasting Blood Sugar > 120"
                      name="fbs"
                      value={formData.fbs}
                      onChange={handleChange}
                      error={errors.fbs}
                      options={YES_NO_OPTIONS}
                      required
                    />
                    <SelectField
                      label="Resting ECG"
                      name="restecg"
                      value={formData.restecg}
                      onChange={handleChange}
                      error={errors.restecg}
                      options={RESTECG_OPTIONS}
                      required
                    />
                    <TextField
                      label="Max Heart Rate"
                      name="thalach"
                      type="number"
                      value={formData.thalach}
                      onChange={handleChange}
                      error={errors.thalach}
                      hint="(71-202)"
                      required
                      min="71"
                      max="202"
                      placeholder="150"
                    />

                    <SelectField
                      label="Exercise-Induced Angina"
                      name="exang"
                      value={formData.exang}
                      onChange={handleChange}
                      error={errors.exang}
                      options={YES_NO_OPTIONS}
                      required
                    />
                    <TextField
                      label="Old Peak (ST Depression)"
                      name="oldpeak"
                      type="number"
                      step="0.1"
                      value={formData.oldpeak}
                      onChange={handleChange}
                      error={errors.oldpeak}
                      hint="(0-6.2)"
                      required
                      min="0"
                      max="6.2"
                      placeholder="1"
                    />
                    <SelectField
                      label="ST Slope"
                      name="slope"
                      value={formData.slope}
                      onChange={handleChange}
                      error={errors.slope}
                      options={SLOPE_OPTIONS}
                      required
                    />

                    <SelectField
                      label="Major Vessels"
                      name="ca"
                      value={formData.ca}
                      onChange={handleChange}
                      error={errors.ca}
                      options={CA_OPTIONS}
                      hint="(0-3)"
                      required
                    />
                    <SelectField
                      label="Thalassemia"
                      name="thal"
                      value={formData.thal}
                      onChange={handleChange}
                      error={errors.thal}
                      options={THAL_OPTIONS}
                      required
                    />
                    <TextField
                      label="Medications"
                      name="medications"
                      value={formData.medications}
                      onChange={handleChange}
                      placeholder="e.g. Atorvastatin"
                    />

                    <SelectField
                      label="Previous Heart Disease"
                      name="previousHeartDisease"
                      value={formData.previousHeartDisease}
                      onChange={handleChange}
                      options={YES_NO_OPTIONS}
                    />
                    <SelectField
                      label="Diabetes"
                      name="diabetes"
                      value={formData.diabetes}
                      onChange={handleChange}
                      options={YES_NO_OPTIONS}
                    />
                    <SelectField
                      label="Hypertension"
                      name="hypertension"
                      value={formData.hypertension}
                      onChange={handleChange}
                      options={YES_NO_OPTIONS}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer actions */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={currentStep === 1 ? () => navigate("/dashboard") : handleBack}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  {currentStep === 1 ? "Cancel" : "Back"}
                </button>

                {currentStep === 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    Next
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    <FiSave className="h-4 w-4" />
                    Save & Predict
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}