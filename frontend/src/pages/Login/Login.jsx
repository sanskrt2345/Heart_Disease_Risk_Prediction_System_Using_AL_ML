import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { apiFetch } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.message || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
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

        {successMessage && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-green-50 border border-green-200 text-green-600 text-xs">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
            {error}
          </div>
        )}

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
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium text-sm shadow-md hover:shadow-lg transition-shadow disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In →"}
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