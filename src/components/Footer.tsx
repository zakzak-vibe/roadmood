import React from 'react';

interface FooterProps {
  onOpenDataSources: () => void;
  onOpenVibeSupport: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDataSources, onOpenVibeSupport }) => {
  return (
    <footer className="w-full bg-[#fff1e7] py-6 border-t border-[#eee0d6] mt-auto">
      <div className="w-full px-4 md:px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-extrabold text-[#211a15]">Road Moods SG</span>
          <span className="text-[#3c4a42] text-[12px] font-medium">
            • Tactile island-wide traffic spirits
          </span>
        </div>

        <div className="flex items-center gap-4 text-[12px] text-[#3c4a42]">
          <button
            type="button"
            onClick={onOpenDataSources}
            className="hover:text-[#211a15] font-semibold transition-colors cursor-pointer"
          >
            Data Sources
          </button>
          <button
            type="button"
            onClick={onOpenVibeSupport}
            className="hover:text-[#211a15] font-semibold transition-colors cursor-pointer"
          >
            Vibe Support
          </button>
          <span className="font-medium">© 2025 Road Moods</span>
        </div>
      </div>
    </footer>
  );
};
