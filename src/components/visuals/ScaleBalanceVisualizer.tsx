import React, { useState } from 'react';

interface Props {
  initialLeft?: number;
  initialRight?: number;
  leftItemName?: string;
  allowAddWeights?: boolean;
}

export const ScaleBalanceVisualizer: React.FC<Props> = ({
  initialLeft = 3,
  initialRight = 3,
  leftItemName = 'Túi cam',
  allowAddWeights = true,
}) => {
  const [leftWeight, setLeftWeight] = useState(initialLeft);
  const [rightWeight, setRightWeight] = useState(initialRight);

  const diff = leftWeight - rightWeight;
  // Rotation degrees for tilt: positive tilts left down, negative tilts right down
  const tiltDeg = Math.max(-12, Math.min(12, diff * 3));

  const isBalanced = diff === 0;

  return (
    <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Mô hình trực quan: Cân đĩa & Ki-lô-gam (kg)
          </span>
          <h4 className="text-lg font-black text-slate-800 mt-1">
            Trạng thái cân:{' '}
            <span className={`px-2.5 py-0.5 rounded-full text-sm font-black ${
              isBalanced ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
            }`}>
              {isBalanced ? 'CÂN THĂNG BẰNG ⚖️' : diff > 0 ? 'Bên trái nặng hơn ⬇️' : 'Bên phải nặng hơn ⬇️'}
            </span>
          </h4>
        </div>

        {allowAddWeights && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLeftWeight(initialLeft);
                setRightWeight(initialRight);
              }}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
            >
              Đặt lại
            </button>
          </div>
        )}
      </div>

      {/* Đồ họa Cân Đĩa SVG + CSS Tilt */}
      <div className="relative py-6 flex flex-col items-center">
        {/* Kim chỉ thăng bằng ở đỉnh */}
        <div className="relative z-20 flex flex-col items-center mb-1">
          <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-amber-400 flex items-center justify-center text-xs text-white font-mono shadow-xs">
            0
          </div>
          <div
            className="w-1.5 h-6 bg-rose-600 origin-bottom transition-transform duration-300"
            style={{ transform: `rotate(${-tiltDeg * 2}deg)` }}
            title="Kim chỉ cân"
          />
        </div>

        {/* Cột trụ trung tâm */}
        <div className="w-6 h-28 bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rounded-t-md relative z-10 shadow-md">
          {/* Đế cân */}
          <div className="absolute -bottom-4 -left-12 w-30 h-6 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-lg border-2 border-amber-800 shadow-lg" />
        </div>

        {/* Thanh đòn cân xoay theo độ nghiêng */}
        <div
          className="absolute top-14 w-72 sm:w-96 h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-full transition-transform duration-300 shadow-md flex justify-between items-center px-1"
          style={{ transform: `rotate(${tiltDeg}deg)` }}
        >
          {/* Điểm treo đĩa trái */}
          <div className="relative -top-1 w-4 h-4 bg-slate-800 rounded-full">
            <div className="absolute top-3 -left-12 w-28 flex flex-col items-center">
              {/* Dây treo đĩa trái */}
              <div className="w-20 h-16 border-x-2 border-b-2 border-slate-600 rounded-b-xl flex flex-col items-center justify-end pb-1 bg-white/40 shadow-xs">
                {/* Đĩa cân trái */}
                <div className="w-24 h-4 bg-amber-400 rounded-full border-2 border-amber-700 shadow-xs flex items-center justify-center">
                  <span className="text-[10px] font-black text-amber-950">
                    {leftItemName}: {leftWeight} kg
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Điểm treo đĩa phải */}
          <div className="relative -top-1 w-4 h-4 bg-slate-800 rounded-full">
            <div className="absolute top-3 -right-12 w-28 flex flex-col items-center">
              {/* Dây treo đĩa phải */}
              <div className="w-20 h-16 border-x-2 border-b-2 border-slate-600 rounded-b-xl flex flex-col items-center justify-end pb-1 bg-white/40 shadow-xs">
                {/* Đĩa cân phải */}
                <div className="w-24 h-4 bg-amber-400 rounded-full border-2 border-amber-700 shadow-xs flex items-center justify-center">
                  <span className="text-[10px] font-black text-amber-950">
                    Quả cân: {rightWeight} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ điều khiển thêm quả cân ở đĩa phải để tìm khối lượng */}
      {allowAddWeights && (
        <div className="mt-8 pt-4 border-t border-emerald-200">
          <div className="text-xs font-bold text-slate-600 mb-2 text-center">
            Thử thêm quả cân vào đĩa phải để cân thăng bằng:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[1, 2, 5].map((w) => (
              <button
                key={w}
                onClick={() => setRightWeight(rightWeight + w)}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-amber-300 font-extrabold rounded-xl border border-slate-900 shadow-xs cursor-pointer text-sm transition transform hover:-translate-y-0.5"
              >
                + Quả {w} kg
              </button>
            ))}
            <button
              onClick={() => setRightWeight(Math.max(0, rightWeight - 1))}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl border border-rose-300 text-sm cursor-pointer transition"
            >
              - 1 kg
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-sm font-bold text-slate-700">
        {isBalanced ? (
          <span className="text-emerald-700 font-black">
            🎉 Tuyệt vời! Cân đã thăng bằng! Vậy {leftItemName} nặng đúng bằng{' '}
            <strong className="text-lg underline">{rightWeight} kg</strong>.
          </span>
        ) : (
          <span className="text-slate-600">
            Cân chưa thăng bằng! Em hãy điều chỉnh quả cân sao cho kim chỉ đúng số 0 ở giữa nhé!
          </span>
        )}
      </div>
    </div>
  );
};
