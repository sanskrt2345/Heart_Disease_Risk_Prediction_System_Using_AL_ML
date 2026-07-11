import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-5 bg-white sticky top-0 z-50 border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
          <span className="text-white text-sm">❤</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
        </div>
        <div className="leading-tight">
          <h1 className="text-lg font-bold text-gray-900">HeartRiskAI</h1>
          <p className="text-[10px] tracking-widest text-gray-400 -mt-1">
            AI · CARDIOLOGY
          </p>
        </div>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-10 text-sm text-gray-600 font-medium">
        <a href="#science" className="hover:text-gray-900 transition-colors">
          The Science
        </a>
        <a href="#how-it-works" className="hover:text-gray-900 transition-colors">
          How it works
        </a>
        <a href="#trust" className="hover:text-gray-900 transition-colors">
          Trust
        </a>
      </div>

      {/* CTA */}
      <div>
        <button className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
          Sign in
        </button>
      </div>
    </nav>
  );
};

export default Navbar;