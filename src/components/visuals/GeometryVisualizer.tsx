import React, { useState } from 'react';

export const GeometryVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'points' | 'broken' | 'quadrilateral'>('broken');

  return (
    <div className="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
            Mô hình trực quan: Hình phẳng
          </span>
          <h4 className="text-lg font-black text-slate-800 mt-1">
            Khám phá điểm, đường thẳng, đường gấp khúc và tứ giác
          </h4>
        </div>

        <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-rose-200">
          <button
            onClick={() => setActiveTab('points')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
              activeTab === 'points'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            Điểm & Đoạn thẳng
          </button>
          <button
            onClick={() => setActiveTab('broken')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
              activeTab === 'broken'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            Đường gấp khúc
          </button>
          <button
            onClick={() => setActiveTab('quadrilateral')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition cursor-pointer ${
              activeTab === 'quadrilateral'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-rose-50'
            }`}
          >
            Hình tứ giác
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-rose-100 min-h-[220px] flex flex-col justify-center">
        {activeTab === 'points' && (
          <div className="space-y-4">
            <svg viewBox="0 0 500 120" className="w-full h-28 bg-slate-50/80 rounded-xl border border-slate-200">
              {/* Đoạn thẳng AB */}
              <line x1="60" y1="40" x2="220" y2="40" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
              <circle cx="60" cy="40" r="6" fill="#e11d48" />
              <circle cx="220" cy="40" r="6" fill="#e11d48" />
              <text x="55" y="25" fontWeight="bold" fill="#0f172a">A</text>
              <text x="215" y="25" fontWeight="bold" fill="#0f172a">B</text>
              <text x="110" y="65" fontSize="12" fill="#0369a1" fontWeight="bold">Đoạn thẳng AB (dài 5 cm)</text>

              {/* Ba điểm thẳng hàng M, N, P */}
              <line x1="280" y1="40" x2="460" y2="40" stroke="#059669" strokeWidth="3" strokeDasharray="4 4" />
              <circle cx="290" cy="40" r="6" fill="#059669" />
              <circle cx="370" cy="40" r="6" fill="#059669" />
              <circle cx="450" cy="40" r="6" fill="#059669" />
              <text x="285" y="25" fontWeight="bold" fill="#065f46">M</text>
              <text x="365" y="25" fontWeight="bold" fill="#065f46">N</text>
              <text x="445" y="25" fontWeight="bold" fill="#065f46">P</text>
              <text x="300" y="65" fontSize="12" fill="#047857" fontWeight="bold">Ba điểm M, N, P thẳng hàng</text>
            </svg>
            <p className="text-xs text-center text-slate-600 font-bold">
              Đoạn thẳng có hai điểm đầu mút A và B. Ba điểm cùng nằm trên một đường thẳng gọi là ba điểm thẳng hàng!
            </p>
          </div>
        )}

        {activeTab === 'broken' && (
          <div className="space-y-4">
            <svg viewBox="0 0 500 130" className="w-full h-32 bg-slate-50/80 rounded-xl border border-slate-200">
              {/* Đường gấp khúc MNPQ */}
              <polyline
                points="50,90 160,20 310,100 450,30"
                fill="none"
                stroke="#e11d48"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="50" cy="90" r="7" fill="#0284c7" />
              <circle cx="160" cy="20" r="7" fill="#0284c7" />
              <circle cx="310" cy="100" r="7" fill="#0284c7" />
              <circle cx="450" cy="30" r="7" fill="#0284c7" />

              <text x="40" y="115" fontWeight="bold" fill="#0f172a">M</text>
              <text x="155" y="15" fontWeight="bold" fill="#0f172a">N</text>
              <text x="305" y="125" fontWeight="bold" fill="#0f172a">P</text>
              <text x="455" y="30" fontWeight="bold" fill="#0f172a">Q</text>

              {/* Nhãn độ dài từng đoạn */}
              <text x="85" y="50" fontSize="13" fontWeight="bold" fill="#e11d48">2 cm</text>
              <text x="240" y="55" fontSize="13" fontWeight="bold" fill="#e11d48">5 cm</text>
              <text x="390" y="60" fontSize="13" fontWeight="bold" fill="#e11d48">3 cm</text>
            </svg>
            <div className="p-2.5 bg-rose-50 rounded-lg text-center text-xs font-bold text-rose-900 border border-rose-200">
              Độ dài đường gấp khúc MNPQ = MN + NP + PQ ={' '}
              <span className="font-mono text-rose-700 text-sm font-black">2 cm + 5 cm + 3 cm = 10 cm</span>
            </div>
          </div>
        )}

        {activeTab === 'quadrilateral' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col items-center">
                <div className="w-16 h-16 bg-amber-400 border-2 border-amber-600 rounded-md shadow-xs mb-1" />
                <span className="text-xs font-bold text-amber-900">Hình vuông (4 cạnh)</span>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex flex-col items-center">
                <div className="w-20 h-14 bg-sky-400 border-2 border-sky-600 rounded-md shadow-xs mb-1" />
                <span className="text-xs font-bold text-sky-900">Hình chữ nhật (4 cạnh)</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col items-center">
                <div
                  className="w-16 h-16 bg-emerald-400 border-2 border-emerald-600 shadow-xs mb-1"
                  style={{ clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' }}
                />
                <span className="text-xs font-bold text-emerald-900">Hình bình hành (4 cạnh)</span>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex flex-col items-center">
                <div
                  className="w-18 h-14 bg-purple-400 border-2 border-purple-600 shadow-xs mb-1"
                  style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}
                />
                <span className="text-xs font-bold text-purple-900">Hình thang (4 cạnh)</span>
              </div>
            </div>
            <p className="text-xs text-center text-slate-600 font-bold">
              Mọi hình phẳng được bao quanh bởi 4 đoạn thẳng khép kín đều là <strong className="text-rose-700">HÌNH TỨ GIÁC</strong>!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
