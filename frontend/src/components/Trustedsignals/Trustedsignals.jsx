import React from "react";

const signals = [
  "FDA-ALIGNED METHODOLOGY",
  "FRAMINGHAM + PCE",
  "PEER-REVIEWED",
  "SOC 2 · HIPAA",
];

const TrustedSignals = () => {
  return (
    <div className="border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-5 flex flex-col md:flex-row items-center gap-4 md:gap-10">
        <p className="text-[11px] font-semibold tracking-widest text-gray-500 whitespace-nowrap">
          TRUSTED SIGNALS
        </p>
        <div className="hidden md:block h-px bg-gray-200 flex-1 max-w-[60px]" />
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] font-medium tracking-wide text-gray-500">
          {signals.map((s, i) => (
            <React.Fragment key={s}>
              <span>{s}</span>
              {i < signals.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-red-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustedSignals;