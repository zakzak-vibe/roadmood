import React, { useState, useEffect } from 'react';
import { fetchApiHealth, ApiHealthResponse } from '../services/ltaApi';

interface ApiHealthModalProps {
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ApiHealthModal: React.FC<ApiHealthModalProps> = ({ onClose, onShowToast }) => {
  const [healthData, setHealthData] = useState<ApiHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/health');
  const [endpointPayload, setEndpointPayload] = useState<any>(null);
  const [loadingPayload, setLoadingPayload] = useState(false);

  const loadHealth = async () => {
    setIsLoading(true);
    try {
      const data = await fetchApiHealth();
      setHealthData(data);
    } catch (err) {
      console.error(err);
      onShowToast('Could not reach /api/health endpoint');
    } finally {
      setIsLoading(false);
    }
  };

  const testEndpoint = async (path: string) => {
    setSelectedEndpoint(path);
    setLoadingPayload(true);
    try {
      const res = await fetch(path);
      const json = await res.json();
      setEndpointPayload(json);
      onShowToast(`Fetched response from ${path}`);
    } catch (err: any) {
      setEndpointPayload({ error: err.message || 'Fetch failed' });
    } finally {
      setLoadingPayload(false);
    }
  };

  useEffect(() => {
    loadHealth();
    testEndpoint('/api/health');
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#211a15]/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#eee0d6] flex flex-col gap-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#eee0d6]">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#10b981] animate-ping" />
            <h3 className="text-[19px] font-extrabold text-[#211a15]">
              API Health & Telemetry Monitor 📡
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f9ebe2] text-[#3c4a42] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status Overview Banner */}
        <div className="bg-[#fff1e7] rounded-2xl p-4 border border-[#eee0d6] flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#10b981] text-white text-[11px] font-extrabold">
                {healthData?.status?.toUpperCase() || 'CHECKING...'}
              </span>
              <span className="text-[12px] font-bold text-[#3c4a42]">
                Uptime: {healthData?.uptime ?? 0}s • Latency: {healthData?.latency_ms ?? 0}ms
              </span>
            </div>
            <p className="text-[11px] text-[#3c4a42] mt-1 font-medium">
              Monitoring LTA DataMall, OneMap Routing, and NEA 2-Hour Weather APIs.
            </p>
          </div>
          <button
            onClick={() => {
              loadHealth();
              testEndpoint(selectedEndpoint);
              onShowToast('Refreshed API telemetry status');
            }}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f9ebe2] border border-[#eee0d6] text-[#211a15] text-[12px] font-extrabold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Check Now</span>
          </button>
        </div>

        {/* Credentials & Environment Keys (Read-only Vercel Env Status) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
          <div className="p-3.5 bg-[#f9ebe2] rounded-2xl border border-[#eee0d6]">
            <span className="text-[10px] font-extrabold text-[#3c4a42] uppercase tracking-wider block">
              LTA_ACCOUNT_KEY
            </span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-mono font-bold text-[#211a15]">
                {healthData?.env?.LTA_ACCOUNT_KEY || 'Checking...'}
              </span>
              <span className="text-[10px] text-[#855300] font-extrabold bg-white/80 px-2 py-0.5 rounded-full border border-[#eee0d6]">
                Vercel Env
              </span>
            </div>
            <p className="text-[11px] text-[#3c4a42] mt-1 font-medium">
              Server-side variable for LTA DataMall v2
            </p>
          </div>

          <div className="p-3.5 bg-[#f9ebe2] rounded-2xl border border-[#eee0d6]">
            <span className="text-[10px] font-extrabold text-[#3c4a42] uppercase tracking-wider block">
              ONEMAP_TOKEN
            </span>
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-mono font-bold text-[#211a15]">
                {healthData?.env?.ONEMAP_TOKEN || 'Checking...'}
              </span>
              <span className="text-[10px] text-[#855300] font-extrabold bg-white/80 px-2 py-0.5 rounded-full border border-[#eee0d6]">
                Vercel Env
              </span>
            </div>
            <p className="text-[11px] text-[#3c4a42] mt-1 font-medium">
              Server-side variable for SLA OneMap routing
            </p>
          </div>
        </div>

        {/* Endpoint Tester Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-extrabold uppercase text-[#3c4a42] tracking-wider">
            Test Configured Endpoints (/api/*):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Health Status', path: '/api/health' },
              { label: 'LTA Incidents', path: '/api/traffic-incidents' },
              { label: 'Travel Times', path: '/api/travel-times' },
              { label: 'Flood Reports', path: '/api/flood-alerts' },
              { label: 'Road Works', path: '/api/road-works' },
              { label: 'Speed Bands', path: '/api/traffic-speeds' },
              { label: 'OneMap Routing', path: '/api/onemap-route' },
              { label: 'NEA 2hr Weather', path: '/api/weather-2hr' },
            ].map((btn) => (
              <button
                key={btn.path}
                onClick={() => testEndpoint(btn.path)}
                className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer border ${
                  selectedEndpoint === btn.path
                    ? 'bg-[#006c49] text-white border-[#006c49]'
                    : 'bg-[#fff1e7] text-[#3c4a42] border-[#eee0d6] hover:bg-[#f9ebe2]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Payload Viewer */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#3c4a42] font-bold">
            <span>GET {selectedEndpoint}</span>
            <span>{loadingPayload ? 'Loading response...' : 'HTTP 200 OK'}</span>
          </div>
          <div className="bg-[#211a15] text-[#6ffbbe] p-3.5 rounded-xl font-mono text-[11px] max-h-56 overflow-y-auto overflow-x-auto shadow-inner">
            {loadingPayload ? (
              <div className="flex items-center gap-2 text-white">
                <span className="animate-spin text-sm">⏳</span> Fetching payload...
              </div>
            ) : (
              <pre>{JSON.stringify(endpointPayload, null, 2)}</pre>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-[#eee0d6] flex items-center justify-between text-[11px] text-[#3c4a42]">
          <span>Endpoint file: {selectedEndpoint}.js in project root /api</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#006c49] text-white text-[12px] font-extrabold hover:bg-[#10b981] cursor-pointer"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
