import React, { useState } from 'react';
import { ExpresswayData } from '../data/trafficData';

interface CameraModalProps {
  camera: ExpresswayData['cameras'][0];
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ camera, onClose, onShowToast }) => {
  const [isSnapshotRefreshing, setIsSnapshotRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsSnapshotRefreshing(true);
    onShowToast('Requesting fresh camera frame from LTA Datamall...');
    setTimeout(() => {
      setIsSnapshotRefreshing(false);
      onShowToast('Camera snapshot refreshed!');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#211a15]/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-[#eee0d6] flex flex-col gap-4 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#eee0d6]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
            <h3 className="text-[17px] font-extrabold text-[#211a15] truncate">
              {camera.location}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f9ebe2] text-[#3c4a42] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Camera Frame */}
        <div className="w-full h-64 rounded-2xl bg-[#211a15] overflow-hidden relative shadow-inner flex items-center justify-center">
          <img
            src={camera.imageUrl}
            alt={camera.location}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isSnapshotRefreshing ? 'opacity-40' : 'opacity-100'
            }`}
          />
          {isSnapshotRefreshing && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold gap-2">
              <span className="animate-spin text-xl">⏳</span>
              <span>Fetching Live Feed...</span>
            </div>
          )}
          {/* Cam Tag */}
          <div className="absolute top-3 left-3 bg-[#211a15]/85 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
            <span>CAM #{camera.camNumber} • LTA LIVE</span>
          </div>
          {/* Timestamp */}
          <div className="absolute bottom-3 right-3 bg-[#211a15]/85 backdrop-blur-sm text-[#6ffbbe] text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
            Updated {camera.updatedAgo}
          </div>
        </div>

        {/* Telemetry info */}
        <div className="flex items-center justify-between bg-[#fff1e7] p-3 rounded-xl border border-[#eee0d6]">
          <div>
            <span className="block text-[10px] uppercase font-extrabold text-[#3c4a42]">
              ESTIMATED CRAWL SPEED
            </span>
            <span className="text-[14px] font-extrabold text-[#b91a24]">{camera.speedText}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f9ebe2] border border-[#eee0d6] text-[#211a15] text-[12px] font-extrabold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Refresh Frame</span>
          </button>
        </div>

        <div className="text-[11px] text-[#3c4a42] text-center leading-relaxed">
          Source: Land Transport Authority (LTA) Singapore Traffic Camera Network.
        </div>
      </div>
    </div>
  );
};
