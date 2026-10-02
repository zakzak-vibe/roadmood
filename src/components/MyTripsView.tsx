import React, { useState } from 'react';
import { SavedTrip } from '../data/trafficData';

interface MyTripsViewProps {
  savedTrips: SavedTrip[];
  onSelectTrip: (trip: SavedTrip) => void;
  onAddTrip: (trip: SavedTrip) => void;
  onDeleteTrip: (id: string) => void;
  onBackToMoods: () => void;
  onShowToast: (msg: string) => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  savedTrips,
  onSelectTrip,
  onAddTrip,
  onDeleteTrip,
  onBackToMoods,
  onShowToast,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newVia, setNewVia] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTo.trim()) {
      onShowToast('Please provide a title and destination');
      return;
    }
    const newTrip: SavedTrip = {
      id: `trip-${Date.now()}`,
      title: newTitle.trim(),
      from: newFrom.trim() || 'My Location',
      to: newTo.trim(),
      via: newVia.trim() || 'Fastest Route',
      tag: 'Custom',
      estTime: '32m',
      mood: 'meh',
      moodLabel: 'Meh',
    };
    onAddTrip(newTrip);
    setShowAddModal(false);
    setNewTitle('');
    setNewFrom('');
    setNewTo('');
    setNewVia('');
    onShowToast(`Commute "${newTrip.title}" saved!`);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <button
            onClick={onBackToMoods}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#006c49] hover:underline mb-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Live Map</span>
          </button>
          <h1 className="text-[28px] md:text-[34px] font-extrabold text-[#211a15] tracking-tight">
            My Commutes & Green Alerts 🚗
          </h1>
          <p className="text-[14px] text-[#3c4a42]">
            Monitor your frequent routes and get buzzed when your expressway turns green.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-full bg-[#006c49] hover:bg-[#10b981] text-white text-[13px] font-extrabold shadow-md flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Commute</span>
        </button>
      </div>

      {/* Saved Commutes List */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#eee0d6] flex flex-col gap-3">
        <h2 className="text-[18px] font-extrabold text-[#211a15]">
          Starred Commutes ({savedTrips.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {savedTrips.map((trip) => {
            const badgeColor =
              trip.mood === 'grinning'
                ? 'bg-[#10b981] text-white'
                : trip.mood === 'meh'
                ? 'bg-[#fea619] text-[#2a1700]'
                : 'bg-[#ff7a73] text-[#410004]';

            return (
              <div
                key={trip.id}
                className="p-4 rounded-xl bg-[#fff1e7] border border-[#eee0d6] hover:border-[#006c49] transition-all flex flex-col justify-between gap-3 group shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3c4a42]">
                      {trip.tag}
                    </span>
                    <h3 className="text-[16px] font-bold text-[#211a15] truncate">{trip.title}</h3>
                    <p className="text-[12px] text-[#3c4a42] truncate mt-0.5">{trip.via}</p>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${badgeColor}`}
                  >
                    {trip.estTime} • {trip.moodLabel}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#eee0d6]/70">
                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="text-[12px] font-extrabold text-[#006c49] hover:text-[#10b981] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">explore</span>
                    <span>Check Mood on Map</span>
                  </button>
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="text-[#3c4a42] hover:text-[#ba1a1a] p-1 rounded-full transition-colors cursor-pointer"
                    title="Delete saved commute"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Departure Routine */}
      <div className="bg-gradient-to-r from-[#6ffbbe]/20 via-[#fff8f5] to-[#ffddb8]/30 rounded-2xl p-5 border border-[#10b981]/30 shadow-sm flex items-start gap-4">
        <span className="text-3xl shrink-0">⏰</span>
        <div className="flex-1">
          <h3 className="text-[16px] font-extrabold text-[#211a15]">
            Smart Morning Green Departure Alarm
          </h3>
          <p className="text-[13px] text-[#3c4a42] mt-1 leading-relaxed">
            Going to work around 8:00 AM? Road Moods checks CTE & PIE every 3 minutes and notifies
            you the instant road speeds climb above 65 km/h so you leave stress-free!
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => onShowToast('Morning Green Alarm enabled for 8:00 AM!')}
              className="px-4 py-2 rounded-full bg-[#006c49] text-white text-[12px] font-extrabold shadow-sm hover:bg-[#10b981] cursor-pointer"
            >
              Enable for Tomorrow 8:00 AM
            </button>
          </div>
        </div>
      </div>

      {/* Add Commute Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#211a15]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#eee0d6] animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-extrabold text-[#211a15]">Star a New Commute</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f9ebe2] text-[#3c4a42] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#3c4a42] mb-1">
                  Trip Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Commute to CBD"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#fff1e7] border border-[#eee0d6] text-[14px] text-[#211a15] font-semibold focus:outline-none focus:border-[#006c49]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#3c4a42] mb-1">
                  Starting Point
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toa Payoh / Home"
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#fff1e7] border border-[#eee0d6] text-[14px] text-[#211a15] font-semibold focus:outline-none focus:border-[#006c49]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#3c4a42] mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marina Bay / Changi / Jurong"
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#fff1e7] border border-[#eee0d6] text-[14px] text-[#211a15] font-semibold focus:outline-none focus:border-[#006c49]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-[#3c4a42] mb-1">
                  Preferred Expressway
                </label>
                <input
                  type="text"
                  placeholder="e.g. Via CTE or ECP"
                  value={newVia}
                  onChange={(e) => setNewVia(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#fff1e7] border border-[#eee0d6] text-[14px] text-[#211a15] font-semibold focus:outline-none focus:border-[#006c49]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-[13px] font-bold text-[#3c4a42] hover:bg-[#f9ebe2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#006c49] hover:bg-[#10b981] text-white text-[13px] font-extrabold shadow-md cursor-pointer"
                >
                  Save Commute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
