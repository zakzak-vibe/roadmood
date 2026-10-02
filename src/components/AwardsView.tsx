import React, { useState } from 'react';
import { GrumpyMascotFace, GrinningCoolMascot, NervousAmberMascot } from './MascotIcons';
import { EXPRESSWAYS } from '../data/trafficData';

interface AwardsViewProps {
  onBackToMoods: () => void;
  onShowToast: (msg: string) => void;
}

export const AwardsView: React.FC<AwardsViewProps> = ({ onBackToMoods, onShowToast }) => {
  const [votes, setVotes] = useState<Record<string, number>>({
    pie: 1420,
    cte: 980,
    kpe: 430,
    aye: 210,
  });
  const [hasVoted, setHasVoted] = useState<string | null>(null);

  const handleVote = (expyKey: string) => {
    if (hasVoted) {
      onShowToast('You already voted today! Thanks for comforting the roads.');
      return;
    }
    setVotes((prev) => ({
      ...prev,
      [expyKey]: prev[expyKey] + 1,
    }));
    setHasVoted(expyKey);
    onShowToast(`Vote cast for ${expyKey.toUpperCase()}! Sending virtual kopi and encouragement.`);
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBackToMoods}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#006c49] hover:underline mb-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Live Map</span>
          </button>
          <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#211a15] tracking-tight">
            Expressway Awards & Daily Vibes 🏆
          </h1>
          <p className="text-[14px] text-[#3c4a42]">
            Celebrating Singapore's most emotional stretches of asphalt today.
          </p>
        </div>
      </div>

      {/* Podium Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1st: Grumpiest Expy */}
        <div className="bg-gradient-to-b from-[#ffdad7] via-[#fff8f5] to-white p-5 rounded-2xl border-2 border-[#b91a24] shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px] font-extrabold">
            #1 CRAWLER
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👑</span>
              <span className="text-[12px] uppercase tracking-wider font-extrabold text-[#b91a24]">
                Today's Grumpiest
              </span>
            </div>
            <div className="flex items-center gap-3 my-2">
              <div className="w-14 h-14 rounded-full bg-[#b91a24] flex items-center justify-center shadow-md">
                <GrumpyMascotFace size={44} hasCrown={true} />
              </div>
              <div>
                <h3 className="text-[18px] font-extrabold text-[#211a15]">PIE</h3>
                <p className="text-[12px] text-[#ba1a1a] font-bold">18 km/h avg speed</p>
              </div>
            </div>
            <p className="text-[13px] text-[#211a15] italic mt-2 bg-[#ffdad7]/60 p-2.5 rounded-xl border border-[#ffb3ad]">
              “Stuck at Eunos since 7:40 AM. Don't look at me.”
            </p>
            <p className="text-[11px] text-[#3c4a42] mt-2 leading-relaxed">
              Awarded for a massive 24-minute standstill near Woodsville Flyover and Bedok North.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eee0d6] flex items-center justify-between text-[11px] font-bold text-[#b91a24]">
            <span>Peak Delay: +24 mins</span>
            <span>Sulking Score: 98/100</span>
          </div>
        </div>

        {/* 2nd: Happiest Cruise */}
        <div className="bg-gradient-to-b from-[#6ffbbe]/30 via-[#fff8f5] to-white p-5 rounded-2xl border-2 border-[#006c49] shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-[#006c49] text-white text-[10px] font-extrabold">
            #1 VIBE
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏄‍♂️</span>
              <span className="text-[12px] uppercase tracking-wider font-extrabold text-[#006c49]">
                Smoothest Cruise
              </span>
            </div>
            <div className="flex items-center gap-3 my-2">
              <div className="w-14 h-14 rounded-full bg-[#10b981] flex items-center justify-center shadow-md">
                <GrinningCoolMascot size={44} />
              </div>
              <div>
                <h3 className="text-[18px] font-extrabold text-[#211a15]">ECP</h3>
                <p className="text-[12px] text-[#006c49] font-bold">84 km/h breezy flow</p>
              </div>
            </div>
            <p className="text-[13px] text-[#211a15] italic mt-2 bg-[#6ffbbe]/30 p-2.5 rounded-xl border border-[#10b981]/30">
              “Smooth sailing all the way to boarding gate! Pure coastal vibes! 🏄‍♂️”
            </p>
            <p className="text-[11px] text-[#3c4a42] mt-2 leading-relaxed">
              Clean sea breeze along East Coast Park with clear skies and zero slowdowns.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eee0d6] flex items-center justify-between text-[11px] font-bold text-[#006c49]">
            <span>Zero Delays</span>
            <span>Happiness: 99/100</span>
          </div>
        </div>

        {/* 3rd: Most Dramatic Meltdown */}
        <div className="bg-gradient-to-b from-[#ffddb8]/50 via-[#fff8f5] to-white p-5 rounded-2xl border-2 border-[#fea619] shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-[#fea619] text-[#2a1700] text-[10px] font-extrabold">
            MOST DRAMATIC
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">👀</span>
              <span className="text-[12px] uppercase tracking-wider font-extrabold text-[#855300]">
                Tunnel Meltdown
              </span>
            </div>
            <div className="flex items-center gap-3 my-2">
              <div className="w-14 h-14 rounded-full bg-[#fea619] flex items-center justify-center shadow-md">
                <NervousAmberMascot size={44} />
              </div>
              <div>
                <h3 className="text-[18px] font-extrabold text-[#211a15]">CTE</h3>
                <p className="text-[12px] text-[#855300] font-bold">42 km/h bottleneck</p>
              </div>
            </div>
            <p className="text-[13px] text-[#211a15] italic mt-2 bg-[#ffddb8]/40 p-2.5 rounded-xl border border-[#ffb95f]">
              “Tunnels are packed like sardines. Slow crawl past Moulmein!”
            </p>
            <p className="text-[11px] text-[#3c4a42] mt-2 leading-relaxed">
              ERP gantry surge and heavy southbound filtering into chinatown / marina.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#eee0d6] flex items-center justify-between text-[11px] font-bold text-[#855300]">
            <span>Peak Delay: +14 mins</span>
            <span>Anxiety: 84/100</span>
          </div>
        </div>
      </div>

      {/* Community Expressway Emotional Support Poll */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eee0d6]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[20px] font-extrabold text-[#211a15]">
              Which expressway needs emotional support today? ☕
            </h2>
            <p className="text-[13px] text-[#3c4a42]">
              Cast your vote to send virtual kopi & good vibes to our hard-working asphalt friends!
            </p>
          </div>
          <span className="px-3 py-1 bg-[#fff1e7] rounded-full text-[12px] font-bold text-[#3c4a42]">
            {totalVotes.toLocaleString()} votes cast
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'pie',
              name: 'PIE',
              sub: 'Pan Island',
              quote: 'Needs a hug & towing service',
              color: 'border-[#b91a24]',
            },
            {
              id: 'cte',
              name: 'CTE',
              sub: 'Central Expy',
              quote: 'Needs fresh tunnel air',
              color: 'border-[#fea619]',
            },
            {
              id: 'kpe',
              name: 'KPE',
              sub: 'Kallang-Paya',
              quote: 'Nervous about cameras',
              color: 'border-[#ffddb8]',
            },
            {
              id: 'aye',
              name: 'AYE',
              sub: 'Ayer Rajah',
              quote: 'Doing ok but tired',
              color: 'border-[#10b981]',
            },
          ].map((item) => {
            const count = votes[item.id] || 0;
            const pct = Math.round((count / totalVotes) * 100);
            const isVoted = hasVoted === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleVote(item.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative overflow-hidden group hover:scale-[1.02] ${
                  isVoted
                    ? 'border-[#006c49] bg-[#6ffbbe]/15 shadow-sm'
                    : `${item.color} bg-[#fff8f5] hover:bg-white`
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[16px] font-extrabold text-[#211a15]">{item.name}</span>
                  <span className="text-[13px] font-extrabold text-[#006c49]">{pct}%</span>
                </div>
                <p className="text-[11px] text-[#3c4a42] font-semibold">{item.sub}</p>
                <p className="text-[12px] text-[#211a15] italic mt-2">“{item.quote}”</p>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#eee0d6] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-[#006c49] transition-all duration-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 text-right">
                  <span className="text-[11px] text-[#3c4a42] font-bold">
                    {count.toLocaleString()} votes {isVoted && '✓'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
