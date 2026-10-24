import React, { useState } from 'react';

interface Props {
  tens: number;
  units: number;
  label?: string;
  allowInteract?: boolean;
}

export const BundlesVisualizer: React.FC<Props> = ({
  tens: initialTens,
  units: initialUnits,
  label,
  allowInteract = true,
}) => {
  const [tens, setTens] = useState(initialTens);
  const [units, setUnits] = useState(initialUnits);

  const total = tens * 10 + units;

  return (
    <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            Mô hình trực quan: Que tính & Chục
          </span>
          <h4 className="text-lg font-black text-slate-800 mt-1">
            {label || `Số ${total} gồm ${tens} chục và ${units} đơn vị`}
          </h4>
        </div>

        {allowInteract && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (units > 0) setUnits(units - 1);
                else if (tens > 0) {
                  setTens(tens - 1);
                  setUnits(9);
                }
              }}
              className="px-3 py-1 bg-white hover:bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-300 text-sm cursor-pointer transition shadow-xs"
              title="Bớt 1 que"
            >
              - 1 que
            </button>
            <button
              onClick={() => {
                if (units < 9) setUnits(units + 1);
                else {
                  setTens(tens + 1);
                  setUnits(0);
                }
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-sm cursor-pointer transition shadow-xs"
              title="Thêm 1 que"
            >
              + 1 que
            </button>
            <button
              onClick={() => {
                setTens(initialTens);
                setUnits(initialUnits);
              }}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-semibold underline cursor-pointer"
            >
              Đặt lại
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/80 p-4 rounded-xl border border-amber-100">
        {/* Hàng chục */}
        <div className="flex flex-col items-center justify-center p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 min-h-[140px]">
          <div className="text-sm font-extrabold text-amber-900 mb-2">
            Hàng Chục: <span className="text-amber-600 text-base">{tens} chục ({tens * 10})</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: tens }).map((_, i) => (
              <div
                key={`ten-${i}`}
                className="flex items-center bg-gradient-to-b from-amber-200 to-amber-300 border-2 border-amber-600 rounded-lg p-1.5 shadow-xs relative"
                title="Bó 10 que tính = 1 chục"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, stickIdx) => (
                    <div
                      key={stickIdx}
                      className="w-1.5 h-14 bg-emerald-600 rounded-full border-r border-emerald-700/50"
                    />
                  ))}
                </div>
                {/* Dây thừng đỏ buộc bó */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 bg-rose-500 rounded-xs shadow-xs border-y border-rose-700" />
              </div>
            ))}
            {tens === 0 && <span className="text-xs text-slate-400 italic">Chưa có bó chục nào</span>}
          </div>
        </div>

        {/* Hàng đơn vị */}
        <div className="flex flex-col items-center justify-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60 min-h-[140px]">
          <div className="text-sm font-extrabold text-emerald-900 mb-2">
            Hàng Đơn Vị: <span className="text-emerald-600 text-base">{units} đơn vị</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.from({ length: units }).map((_, i) => (
              <div
                key={`unit-${i}`}
                className="w-2.5 h-14 bg-emerald-500 hover:bg-emerald-400 rounded-full border-2 border-emerald-700 shadow-xs transition transform hover:-translate-y-1"
                title="1 que tính lẻ"
              />
            ))}
            {units === 0 && <span className="text-xs text-slate-400 italic">0 que tính lẻ</span>}
          </div>
        </div>
      </div>

      <div className="mt-3 text-center text-sm font-bold text-slate-600">
        👉 Viết số: <span className="text-amber-600 text-lg font-black">{total}</span> | Viết thành tổng: <span className="font-mono text-slate-800 bg-amber-100 px-2 py-0.5 rounded">{tens * 10} + {units} = {total}</span>
      </div>
    </div>
  );
};
