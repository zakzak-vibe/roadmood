import React, { useState, useEffect } from 'react';
import { GrumpyMascotFace, GrinningCoolMascot, NervousAmberMascot } from './MascotIcons';

interface StartDriveModalProps {
  onClose: () => void;
  destination: string;
}

export const StartDriveModal: React.FC<StartDriveModalProps> = ({ onClose, destination }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      segment: 'PIE - Pan Island Expressway',
      speed: 22,
      mood: 'sulking',
      instruction: 'Continue on PIE toward Bedok North. Heavy crawl in effect.',
      distanceRemaining: '18.4 km',
      vibeSpeech: '“Stuck at Eunos since 7:40 AM. Two lanes crawled to a halt lah!”',
      etaText: '38 mins remaining',
      subText: '⚠️ Caution: Lane 1 breakdown ahead + wet road surface',
    },
    {
      segment: 'KPE - Kallang-Paya Lebar Tunnel',
      speed: 54,
      mood: 'nervous',
      instruction: 'In 600m, take Exit 2A toward KPE Tunnel / Airport Link.',
      distanceRemaining: '9.8 km',
      vibeSpeech: '“Entering the tunnel! Keep headlights on and speed steady at 54 km/h.”',
      etaText: '19 mins remaining',
      subText: 'Traffic flowing steadily past Defu underpass',
    },
    {
      segment: 'ECP - East Coast Parkway',
      speed: 84,
      mood: 'grinning',
      instruction: 'Merge smoothly onto ECP Coastal Highway toward Changi Airport T3.',
      distanceRemaining: '3.2 km',
      vibeSpeech: '“Breezy coastal winds! Clear runway all the way to Terminal 3! 🏄‍♂️”',
      etaText: '4 mins remaining',
      subText: 'Expressway is in maximum high spirits! Pure green flow.',
    },
  ];

  const current = steps[stepIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 9000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 bg-[#211a15]/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fff8f5] rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-white flex flex-col gap-5 animate-in zoom-in-95">
        {/* Driving Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10b981] animate-ping" />
            <span className="text-[12px] font-extrabold uppercase tracking-wider text-[#006c49]">
              LIVE NAVIGATION ACTIVE
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-full bg-[#f9ebe2] hover:bg-[#eee0d6] text-[#3c4a42] text-[12px] font-bold cursor-pointer"
          >
            End Drive ✕
          </button>
        </div>

        {/* Turn-by-Turn Instruction Banner */}
        <div className="bg-[#211a15] text-white p-4 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px] text-white">navigation</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-extrabold leading-snug">{current.instruction}</h3>
            <p className="text-[12px] text-[#6ffbbe] mt-0.5">{current.distanceRemaining}</p>
          </div>
        </div>

        {/* Current Expressway Vibe & Mascot Centerpiece */}
        <div className="bg-white rounded-2xl p-5 border border-[#eee0d6] flex flex-col items-center text-center gap-3 relative shadow-xs">
          <div className="flex items-center justify-between w-full">
            <span className="px-2.5 py-0.5 rounded-full bg-[#fff1e7] text-[#3c4a42] text-[11px] font-bold">
              {current.segment}
            </span>
            <span className="text-[12px] font-extrabold text-[#006c49]">{current.etaText}</span>
          </div>

          <div className="relative my-2">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                current.mood === 'sulking'
                  ? 'bg-[#b91a24]'
                  : current.mood === 'nervous'
                  ? 'bg-[#fea619]'
                  : 'bg-[#10b981]'
              }`}
            >
              {current.mood === 'sulking' && <GrumpyMascotFace size={60} hasCrown={true} />}
              {current.mood === 'nervous' && <NervousAmberMascot size={60} />}
              {current.mood === 'grinning' && <GrinningCoolMascot size={60} />}
            </div>
            {/* Speed Gauge floating pill */}
            <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-[#211a15] text-white text-[12px] font-extrabold shadow-md border-2 border-white">
              {current.speed} km/h
            </span>
          </div>

          {/* Speech bubble */}
          <div className="bg-[#fff1e7] text-[#211a15] italic p-3 rounded-2xl border border-[#eee0d6] text-[13px] max-w-sm">
            {current.vibeSpeech}
          </div>

          <p className="text-[11px] text-[#3c4a42] font-semibold">{current.subText}</p>
        </div>

        {/* Segment Stepper & Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStepIndex(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  i === stepIndex ? 'w-8 bg-[#006c49]' : 'w-2.5 bg-[#eee0d6]'
                }`}
                title={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              className="px-3 py-1.5 rounded-full bg-[#fff1e7] disabled:opacity-40 text-[12px] font-bold text-[#3c4a42] cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => {
                if (stepIndex < steps.length - 1) {
                  setStepIndex((prev) => prev + 1);
                } else {
                  onClose();
                }
              }}
              className="px-4 py-1.5 rounded-full bg-[#006c49] text-white text-[12px] font-extrabold shadow-sm hover:bg-[#10b981] cursor-pointer"
            >
              {stepIndex < steps.length - 1 ? 'Next Stretch →' : 'Arrived at Changi! ✈️'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
