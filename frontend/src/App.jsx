import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient-form" element={<PatientForm />} />
        <Route path="/report" element={<Report />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/results" element={<Results />} />
        <Route path="/whatif" element={<Whatif />} />
       <Route path="/assistant" element={<AIAssistant />} />
       <Route path="/tips" element={<Lifestyle />} />
       <Route path="/history" element={<History />} />
       <Route path="/settings" element={<Settings />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;