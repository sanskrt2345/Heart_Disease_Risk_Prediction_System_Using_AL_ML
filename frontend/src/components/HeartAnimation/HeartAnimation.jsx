import React from "react";
import heart from "../../assets/images/heart.png";
// ECG component no longer used here — our pulse line replaces it

const hexPoints = [
  [320, 20],
  [570, 165],
  [570, 455],
  [320, 600],
  [70, 455],
  [70, 165],
];

const dots = [
  [110, 80],
  [560, 90],
  [600, 300],
  [500, 560],
  [110, 560],
  [40, 300],
];

const HeartAnimation = () => {
  return (
    <div className="w-full max-w-[560px] mx-auto">
      <style>{`
        @keyframes hexSpinSlow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulseTravel {
          0%   { stroke-dashoffset: 900; }
          100% { stroke-dashoffset: -900; }
        }
      `}</style>
      <div className="relative aspect-square [container-type:inline-size] overflow-visible">

        {/* RED GLOW */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90cqw] h-[90cqw] rounded-full blur-[6cqw]"
          style={{
            background:
              "radial-gradient(circle,rgba(255,80,80,.22),rgba(255,255,255,0) 70%)",
          }}
        />

        {/* WHITE GLOW */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80cqw] h-[80cqw] rounded-full"
          style={{
            background:
              "radial-gradient(circle,#fff 0%,#fff 55%,rgba(255,250,250,.92) 78%,rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Pulse Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62cqw] h-[62cqw] rounded-full border-2 border-red-200 animate-pulse-ring" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62cqw] h-[62cqw] rounded-full border border-dashed border-red-300/60" />

        {/* Premium Hexagon */}
        <svg
          viewBox="0 0 640 640"
          className="absolute top-1/2 left-1/2 w-[92cqw] h-[92cqw]"
          style={{
            filter: "drop-shadow(0 0 2cqw rgba(255,80,80,.22))",
            animation: "hexSpinSlow 40s linear infinite",
            transformOrigin: "center",
          }}
        >
          <polygon
            points={hexPoints.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="rgba(255,90,90,.35)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {hexPoints.map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="10" fill="#ff6b6b" opacity=".18" />
              <circle cx={cx} cy={cy} r="4" fill="#ff6b6b" />
            </g>
          ))}

          {dots.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="#f4a5a5" opacity=".65" />
          ))}
        </svg>

        {/* Live ECG component removed — was overlapping with our pulse line, causing double blip */}


        {/* Inner ECG Pulse — same viewBox/box as hexagon so it lines up with the heart */}
        <svg
          viewBox="0 0 640 640"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] w-[92cqw] h-[92cqw] pointer-events-none"
        >
          {/* Base static line (always visible, faint) */}
          <polyline
            points="
              0,300
              170,300
              230,300
              255,230
              285,370
              310,260
              335,320
              365,300
              640,300
            "
            fill="none"
            stroke="#ff3b4e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".35"
          />

          {/* Traveling glowing pulse, left to right, looping */}
          <polyline
            points="
              0,300
              170,300
              230,300
              255,230
              285,370
              310,260
              335,320
              365,300
              640,300
            "
            fill="none"
            stroke="#ff3b4e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="70 900"
            style={{
              animation: "pulseTravel 3.2s linear infinite",
              filter: "drop-shadow(0 0 6px rgba(255,59,78,.85))",
            }}
          />
        </svg>

        {/* Heart */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-heartbeat w-[56cqw]">
          <img
            src={heart}
            alt="Heart"
            className="w-full drop-shadow-[0_1.5cqw_3cqw_rgba(255,70,70,.35)] select-none pointer-events-none"
          />
        </div>

        {/* Soft Heart Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40cqw] h-[40cqw] rounded-full blur-[5cqw] opacity-40 -z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(255,90,90,.35), transparent 70%)",
          }}
        />

        {/* Live Model Card */}
        <div
          className="
            absolute
            top-[4%]
            left-[40%]
            -translate-x-1/2
            bg-white/80
            backdrop-blur-xl
            rounded-2xl
            shadow-[0_20px_60px_rgba(0,0,0,.08)]
            border
            border-red-100
            px-[3cqw]
            py-[1.8cqw]
            animate-float
            z-40
            flex
            items-center
            gap-[1.5cqw]
            max-w-[60%]
          "
        >
          <div className="w-[9cqw] h-[9cqw] min-w-[32px] min-h-[32px] rounded-xl bg-red-50 flex items-center justify-center text-[3.5cqw]">
            📈
          </div>

          <div>
            <p className="text-[3cqw] leading-tight font-semibold text-gray-800 whitespace-nowrap">
              Live model v4.2
            </p>
            <p className="text-[2.4cqw] leading-tight text-gray-400 whitespace-nowrap">
              Trained on 2.1M ECGs
            </p>
          </div>
        </div>

        {/* Floating Plus Button */}
        <button
          className="
            absolute
            left-[6%]
            top-[18%]
            w-[9cqw]
            h-[9cqw]
            min-w-[36px]
            min-h-[36px]
            rounded-full
            bg-white/80
            backdrop-blur-xl
            border
            border-red-100
            shadow-xl
            text-red-500
            text-[3.5cqw]
            animate-float
            z-40
            flex
            items-center
            justify-center
          "
        >
          +
        </button>

        {/* Floating Heart Button */}
        <button
          className="
            absolute
            right-[3%]
            top-[42%]
            -translate-y-1/2
            w-[10cqw]
            h-[10cqw]
            min-w-[40px]
            min-h-[40px]
            rounded-full
            bg-gradient-to-br
            from-red-500
            to-red-600
            shadow-[0_15px_40px_rgba(255,70,70,.45)]
            flex
            items-center
            justify-center
            text-white
            text-[4cqw]
            animate-float
            z-40
          "
        >
          ❤
        </button>

        {/* BPM Card */}
        <div
          className="
            absolute
            left-[3%]
            bottom-[6%]
            bg-white/80
            backdrop-blur-xl
            rounded-2xl
            border
            border-white
            shadow-[0_20px_60px_rgba(0,0,0,.08)]
            px-[3cqw]
            py-[2.5cqw]
            animate-float
            z-40
            flex
            items-center
            gap-[1.8cqw]
          "
        >
          <span className="w-[2.5cqw] h-[2.5cqw] min-w-[10px] min-h-[10px] rounded-full bg-green-500 animate-pulse"></span>

          <div>
            <p className="text-[2.2cqw] text-gray-400 uppercase tracking-wide whitespace-nowrap">
              Heart Rate
            </p>
            <p className="text-[3.2cqw] font-bold text-gray-800 whitespace-nowrap">
              BPM 72
            </p>
            <p className="text-[2.4cqw] text-green-600 whitespace-nowrap">
              Normal Sinus
            </p>
          </div>
        </div>

        {/* Risk Card */}
        <div
          className="
            absolute
            right-[3%]
            bottom-[6%]
            w-[36%]
            bg-white/80
            backdrop-blur-xl
            rounded-2xl
            border
            border-white
            shadow-[0_20px_60px_rgba(0,0,0,.08)]
            px-[3cqw]
            py-[2.5cqw]
            animate-float
            z-40
          "
        >
          <div className="flex justify-between items-center">
            <p className="text-[2.4cqw] text-gray-500 whitespace-nowrap">Risk Score</p>
            <span className="bg-green-100 text-green-700 px-[1.5cqw] py-[0.6cqw] rounded-full text-[2cqw] font-semibold whitespace-nowrap">
              LOW
            </span>
          </div>

          <div className="mt-[1cqw]">
            <span className="text-[6cqw] font-bold text-gray-900">12</span>
            <span className="text-[2.6cqw] text-gray-400">/100</span>
          </div>

          <div className="mt-[1.5cqw] h-[1.5cqw] rounded-full bg-gray-100 overflow-hidden">
            <div className="w-[12%] h-full rounded-full bg-gradient-to-r from-red-400 to-red-500"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeartAnimation;