import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with real auth call (API request, Supabase, Firebase, etc.)
    console.log("Login attempt:", { email, password });
    navigate("/dashboard"); // redirect after successful login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,.08)] border border-red-100 p-8">

        <div className="flex items-center gap-2 mb-8">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-lg">
            ❤
          </span>
          <div>
            <p className="font-bold text-gray-900 leading-tight">HeartRiskAI</p>
            <p className="text-[10px] text-gray-400 tracking-wide">AI · CARDIOLOGY</p>
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Sign in to start your free cardiovascular assessment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium text-sm shadow-md hover:shadow-lg transition-shadow"
          >
            Sign In →
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-500 font-medium">
            Sign up free
          </Link>
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full text-center text-xs text-gray-400 mt-4 hover:text-gray-600"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
};

export default Login;