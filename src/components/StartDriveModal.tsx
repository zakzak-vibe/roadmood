import React, { useState, useEffect } from 'react';
import { RouteTripDetail } from '../data/trafficData';
import { GrumpyMascotFace, GrinningCoolMascot, NervousAmberMascot } from './MascotIcons';

interface StartDriveModalProps {
  onClose: () => void;
  routeData: RouteTripDetail;
}

export const StartDriveModal: React.FC<StartDriveModalProps> = ({ onClose, routeData }) => {
  const [stepIndex, setStepIndex] = useState(0);

  // Dynamically generate turn-by-turn navigation stretches based on actual routeData
  const expys = routeData.expressways || [];

  const totalDist = routeData.distanceKm || 15;
  const totalMins = routeData.estMinutes || 25;

  const steps = expys.map((ex, idx) => {
    const fractionDone = idx / Math.max(expys.length, 1);
    const distRemaining = Math.max(1.2, parseFloat((totalDist * (1 - fractionDone)).toFixed(1)));
    const minsRemaining = Math.max(2, Math.round(totalMins * (1 - fractionDone)));

    let instruction = `Continue on ${ex.code} (${ex.sectionName}) towards ${routeData.toText}.`;
    if (idx === 0) {
      instruction = `Merge onto ${ex.code} (${ex.sectionName}) towards ${routeData.toText}.`;
    } else if (idx === expys.length - 1) {
      instruction = `Approaching ${routeData.toText} via ${ex.code}. Prepare to take the destination exit.`;
    } else {
      instruction = `In 800m, transition onto ${ex.code} (${ex.sectionName}).`;
    }

    const subText =
      ex.incidents && ex.incidents.length > 0
        ? `⚠️ Caution: ${ex.incidents[0]}`
        : `${ex.moodLabel} • Sensor speed: ${ex.speedKmH} km/h • Safe following distance`;

    return {
      segment: `${ex.code} - ${ex.sectionName}`,
      code: ex.code,
      speed: ex.speedKmH,
      mood: ex.mood,
      instruction,
      distanceRemaining: `${distRemaining} km remaining`,
      vibeSpeech: ex.characterQuote,
      etaText: `${minsRemaining} mins remaining`,
      subText,
    };
  });

  // Add the final arrival celebration step
  steps.push({
    segment: `Destination: ${routeData.toText}`,
    code: 'ARRIVED',
    speed: 0,
    mood: 'grinning',
    instruction: `You have arrived at ${routeData.toText}!`,
    distanceRemaining: '0.0 km',
    vibeSpeech: `“Great drive! Arrived safely at ${routeData.toText}. Hope Road Moods made your commute more chill!”`,
    etaText: 'Arrived 🏁',
    subText: `Trip completed: ${routeData.distanceKm} km in ~${routeData.estMinutes} mins.`,
  });

  const current = steps[stepIndex] || steps[0];

  // Auto-advance step every 9 seconds or manual click
  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 9000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 bg-[#211a15]/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#fff8f5] rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-white flex flex-col gap-5 animate-in zoom-in-95">
        {/* Driving Header with Live Route Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10b981] animate-ping" />
            <span className="text-[12px] font-extrabold uppercase tracking-wider text-[#006c49]">
              LIVE NAVIGATION ACTIVE
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1 rounded-full bg-[#f9ebe2] hover:bg-[#eee0d6] text-[#3c4a42] hover:text-[#211a15] text-[12px] font-extrabold cursor-pointer transition-colors shadow-2xs"
          >
            End Drive ✕
          </button>
        </div>

        {/* Dynamic Route Pill (From -> To) */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#eee0d6] text-[#211a15] shadow-xs">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c49] shrink-0" />
            <span className="text-[13px] font-extrabold truncate">{routeData.fromText}</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#855300] shrink-0">
            arrow_forward
          </span>
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b91a24] shrink-0" />
            <span className="text-[13px] font-extrabold truncate text-[#b91a24]">
              {routeData.toText}
            </span>
          </div>
        </div>

        {/* Turn-by-Turn Instruction Banner */}
        <div className="bg-[#211a15] text-white p-4 rounded-2xl flex items-center gap-4 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-[#006c49] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px] text-white">
              {current.code === 'ARRIVED' ? 'flag' : 'navigation'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-extrabold leading-snug">{current.instruction}</h3>
            <div className="flex items-center gap-2 mt-1 text-[12px] text-[#6ffbbe]">
              <span>{current.distanceRemaining}</span>
              <span>•</span>
              <span className="text-white font-bold">{current.etaText}</span>
            </div>
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
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                current.mood === 'sulking'
                  ? 'bg-[#b91a24]'
                  : current.mood === 'meh' || current.mood === 'grumpy'
                  ? 'bg-[#fea619]'
                  : 'bg-[#10b981]'
              }`}
            >
              {current.mood === 'sulking' && <GrumpyMascotFace size={60} hasCrown={true} />}
              {(current.mood === 'meh' || current.mood === 'grumpy') && (
                <NervousAmberMascot size={60} />
              )}
              {(current.mood === 'grinning' || current.mood === 'breezy') && (
                <GrinningCoolMascot size={60} />
              )}
            </div>
            {/* Speed Gauge floating pill */}
            {current.code !== 'ARRIVED' && (
              <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-[#211a15] text-white text-[12px] font-extrabold shadow-md border-2 border-white">
                {current.speed} km/h
              </span>
            )}
          </div>

          {/* Speech bubble with live character quote */}
          <div className="bg-[#fff1e7] text-[#211a15] italic p-3 rounded-2xl border border-[#eee0d6] text-[13px] max-w-sm leading-snug">
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
                title={`Stretch ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              className="px-3.5 py-1.5 rounded-full bg-[#fff1e7] hover:bg-[#f9ebe2] disabled:opacity-40 text-[12px] font-bold text-[#3c4a42] cursor-pointer"
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
              className="px-4 py-1.5 rounded-full bg-[#006c49] text-white text-[12px] font-extrabold shadow-sm hover:bg-[#10b981] cursor-pointer active:scale-95 transition-all"
            >
              {stepIndex < steps.length - 1
                ? 'Next Stretch →'
                : `Arrived at ${routeData.toText.split(' ')[0]}! 🏁`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
