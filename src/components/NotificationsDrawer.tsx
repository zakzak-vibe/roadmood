import React from 'react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'PIE Crawl Alert',
      message: 'Heavy slowdown near Woodsville Flyover & Bedok North. Sulking at 18 km/h.',
      time: '4 mins ago',
      type: 'warning',
      emoji: '😤',
    },
    {
      id: 'notif-2',
      title: 'ECP is Grinning!',
      message: 'East Coast Parkway is fully breezy above 84 km/h to Changi Airport.',
      time: '12 mins ago',
      type: 'success',
      emoji: '🏄‍♂️',
    },
    {
      id: 'notif-3',
      title: 'NEA Flash Ponding Advisory',
      message: 'Ponding risk near Kallang Way. Reduced traction on lane 1.',
      time: '25 mins ago',
      type: 'weather',
      emoji: '🌧️',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#211a15]/30 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl p-5 flex flex-col gap-4 border-l border-[#eee0d6] animate-in slide-in-from-right">
        <div className="flex items-center justify-between pb-2 border-b border-[#eee0d6]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h3 className="text-[17px] font-extrabold text-[#211a15]">Expressway Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#f9ebe2] text-[#3c4a42] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-[#fff1e7] border border-[#eee0d6] flex items-start gap-3 hover:bg-[#f9ebe2] transition-colors"
            >
              <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-extrabold text-[#211a15]">{item.title}</h4>
                  <span className="text-[10px] text-[#3c4a42]">{item.time}</span>
                </div>
                <p className="text-[12px] text-[#3c4a42] mt-0.5 leading-snug">{item.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#eee0d6] flex gap-2">
          <button
            onClick={() => {
              onShowToast('All notifications marked as read.');
              onClose();
            }}
            className="w-full py-2.5 rounded-full bg-[#006c49] text-white text-[12px] font-extrabold shadow-sm hover:bg-[#10b981] cursor-pointer"
          >
            Clear All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};
