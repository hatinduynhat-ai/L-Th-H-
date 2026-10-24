import React, { useState } from 'react';

interface Props {
  initialHour?: number;
  initialMinute?: number;
  label?: string;
}

export const ClockVisualizer: React.FC<Props> = ({
  initialHour = 7,
  initialMinute = 15,
  label,
}) => {
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);

  // Angles in degrees
  const minuteAngle = minute * 6; // 360 / 60
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // 360 / 12

  const format2Digits = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  // Friendly time phrase in Vietnamese
  const getVietnameseTimePhrase = (h: number, m: number) => {
    let session = 'sáng';
    if (h >= 11 && h < 13) session = 'trưa';
    else if (h >= 13 && h < 18) session = 'chiều';
    else if (h >= 18 && h < 22) session = 'tối';
    else if (h >= 22 || h < 5) session = 'đêm';

    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;

    if (m === 0) return `${displayH} giờ đúng (${session})`;
    if (m === 15) return `${displayH} giờ 15 phút (${session})`;
    if (m === 30) return `${displayH} giờ rưỡi hoặc ${displayH} giờ 30 phút (${session})`;
    return `${displayH} giờ ${m} phút (${session})`;
  };

  return (
    <div className="bg-yellow-50/70 border-2 border-yellow-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full">
            Mô hình trực quan: Đồng hồ kim & Đồng hồ số
          </span>
          <h4 className="text-lg font-black text-slate-800 mt-1">
            {label || 'Thực hành xem giờ'}
          </h4>
        </div>

        {/* Đồng hồ số điện tử */}
        <div className="flex items-center gap-2 bg-slate-900 text-emerald-400 font-mono px-4 py-1.5 rounded-xl border-2 border-slate-700 shadow-inner text-xl font-black tracking-widest">
          <span>{format2Digits(hour)}</span>
          <span className="animate-pulse">:</span>
          <span>{format2Digits(minute)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Mặt đồng hồ kim tròn SVG */}
        <div className="flex justify-center">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-white border-8 border-amber-400 shadow-lg flex items-center justify-center">
            {/* Vành phút */}
            <div className="absolute inset-1 rounded-full border border-amber-200 pointer-events-none" />

            {/* Các số từ 1 đến 12 */}
            {Array.from({ length: 12 }).map((_, i) => {
              const num = i + 1;
              const angle = num * 30 - 90; // degrees from top
              const rad = (angle * Math.PI) / 180;
              const r = 90; // distance from center
              const x = r * Math.cos(rad);
              const y = r * Math.sin(rad);

              return (
                <div
                  key={num}
                  className="absolute text-base sm:text-lg font-black text-slate-800 flex items-center justify-center select-none"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {num}
                </div>
              );
            })}

            {/* Kim giờ (ngắn, màu đỏ) */}
            <div
              className="absolute w-2 h-16 bg-rose-600 rounded-full origin-bottom transition-transform duration-200 shadow-xs"
              style={{
                bottom: '50%',
                left: 'calc(50% - 4px)',
                transform: `rotate(${hourAngle}deg)`,
              }}
              title="Kim giờ"
            />

            {/* Kim phút (dài, màu xanh dương) */}
            <div
              className="absolute w-1.5 h-22 bg-sky-600 rounded-full origin-bottom transition-transform duration-200 shadow-xs"
              style={{
                bottom: '50%',
                left: 'calc(50% - 3px)',
                transform: `rotate(${minuteAngle}deg)`,
              }}
              title="Kim phút"
            />

            {/* Trục tâm đồng hồ */}
            <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-amber-300 z-10 shadow-xs" />
          </div>
        </div>

        {/* Bảng điều khiển chọn giờ nhanh & tùy chỉnh */}
        <div className="space-y-4">
          <div className="p-3 bg-white rounded-xl border border-yellow-200">
            <div className="text-xs font-bold text-slate-500 mb-1">Cách đọc giờ bằng lời:</div>
            <div className="text-base font-black text-amber-700">
              🗣️ "{getVietnameseTimePhrase(hour, minute)}"
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-600 mb-2">Chọn nhanh tình huống quen thuộc:</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                onClick={() => { setHour(7); setMinute(0); }}
                className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-left transition cursor-pointer"
              >
                🎒 7:00 sáng - Đi học
              </button>
              <button
                onClick={() => { setHour(9); setMinute(15); }}
                className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-left transition cursor-pointer"
              >
                📐 9:15 sáng - Học Toán
              </button>
              <button
                onClick={() => { setHour(14); setMinute(0); }}
                className="p-2 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-lg text-left transition cursor-pointer"
              >
                ☀️ 14:00 (2h chiều) - Vào lớp
              </button>
              <button
                onClick={() => { setHour(16); setMinute(30); }}
                className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg text-left transition cursor-pointer"
              >
                ⚽ 16:30 (4h rưỡi) - Đá bóng
              </button>
              <button
                onClick={() => { setHour(19); setMinute(0); }}
                className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-lg text-left transition cursor-pointer"
              >
                📺 19:00 (7h tối) - Xem phim
              </button>
              <button
                onClick={() => { setHour(21); setMinute(30); }}
                className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-lg text-left transition cursor-pointer"
              >
                🌙 21:30 (9h rưỡi) - Đi ngủ
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-bold text-slate-600">Đổi phút:</span>
            <button
              onClick={() => setMinute(0)}
              className="px-2.5 py-1 bg-white hover:bg-yellow-100 text-slate-800 text-xs font-bold rounded-lg border border-yellow-300 cursor-pointer"
            >
              00 phút (đúng)
            </button>
            <button
              onClick={() => setMinute(15)}
              className="px-2.5 py-1 bg-white hover:bg-yellow-100 text-slate-800 text-xs font-bold rounded-lg border border-yellow-300 cursor-pointer"
            >
              15 phút
            </button>
            <button
              onClick={() => setMinute(30)}
              className="px-2.5 py-1 bg-white hover:bg-yellow-100 text-slate-800 text-xs font-bold rounded-lg border border-yellow-300 cursor-pointer"
            >
              30 phút (rưỡi)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
