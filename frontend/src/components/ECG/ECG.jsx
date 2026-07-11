import React from "react";

const ECG = ({ className = "" }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1200 80"
        className="w-full h-full animate-ecg-scroll"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: "drop-shadow(0 0 10px rgba(255,59,77,.45))",
        }}
      >
        <path
          d="
          M0 40
          L180 40
          L220 40
          L240 18
          L255 65
          L270 10
          L288 40
          L340 40

          L430 40

          L450 32
          L465 40
          L480 40

          L600 40

          L640 40
          L660 18
          L675 65
          L690 10
          L708 40
          L760 40

          L850 40

          L870 32
          L885 40
          L900 40

          L1200 40
          "
          stroke="#ff3b4d"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Moving glowing dot */}
      <div
        className="
          absolute
          top-1/2
          -translate-y-1/2
          w-3
          h-3
          rounded-full
          bg-[#ff3b4d]
          animate-ecg-dot
        "
        style={{
          boxShadow: "0 0 14px rgba(255,59,77,.8)",
        }}
      />
    </div>
  );
};

export default ECG;