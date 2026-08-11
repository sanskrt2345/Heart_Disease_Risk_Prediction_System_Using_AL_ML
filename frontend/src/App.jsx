import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import PatientForm from "./pages/PatientForm/PatientForm.jsx";
import Report from "./pages/Report/Report.jsx";
import Prediction from "./pages/Prediction/Prediction.jsx";
import Results from "./pages/Results/Results.jsx";
import Whatif from "./pages/WhatIf/Whatif.jsx";
import AIAssistant from "./pages/AIAssistant/AIAssistant";
import Lifestyle from "./pages/Lifestyle/Lifestyle.jsx";
import History from "./pages/History/History.jsx";
import Settings from "./pages/Settings/Settings.jsx";

/* ===========================
      PAGE TRANSITION WRAPPER
   Wraps every routed page so switching routes fades/slides
   instead of hard-cutting. Keep this fast & subtle.
=========================== */
const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
        <Route path="/patient-form" element={<PageWrapper><PatientForm /></PageWrapper>} />
        <Route path="/report" element={<PageWrapper><Report /></PageWrapper>} />
        <Route path="/prediction" element={<PageWrapper><Prediction /></PageWrapper>} />
        <Route path="/results" element={<PageWrapper><Results /></PageWrapper>} />
        <Route path="/whatif" element={<PageWrapper><Whatif /></PageWrapper>} />
        <Route path="/assistant" element={<PageWrapper><AIAssistant /></PageWrapper>} />
        <Route path="/tips" element={<PageWrapper><Lifestyle /></PageWrapper>} />
        <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;