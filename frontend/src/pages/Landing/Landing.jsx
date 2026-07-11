import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Trustedsignals from "../../components/Trustedsignals/Trustedsignals";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f6f9fd] to-[#eef2fb]">
      <Navbar />
      <Hero />
      <Trustedsignals />
    </div>
  );
};

export default Landing;