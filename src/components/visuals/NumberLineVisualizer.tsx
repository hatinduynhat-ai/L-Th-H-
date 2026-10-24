import React, { useState } from 'react';

interface Props {
  min?: number;
  max?: number;
  highlightNumber?: number;
  showPreviousNext?: boolean;
}

export const NumberLineVisualizer: React.FC<Props> = ({
  min = 0,
  max = 10,
  highlightNumber = 4,
  showPreviousNext = true,
}) => {
  const [selectedNum, setSelectedNum] = useState(highlightNumber);

  const prevNum = selectedNum > min ? selectedNum - 1 : null;
  const nextNum = selectedNum < max ? selectedNum + 1 : null;

  const count = max - min + 1;

  return (
    <div className="bg-sky-50/70 border-2 border-sky-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
            Mô hình trực quan: Tia số
          </span>
          <h4 className="text-lg font-black text-slate-800 mt-1">
            Số đã chọn: <span className="text-sky-600 text-xl font-black">{selectedNum}</span>
          </h4>
        </div>

        <div className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-sky-100">
          Chạm vào số bất kỳ trên tia số để xem!
        </div>
      </div>

      {/* Tia số đồ họa */}
      <div className="relative py-8 px-4 overflow-x-auto">
        {/* Đường thẳng tia số với mũi tên */}
        <div className="relative min-w-[500px] h-1 bg-sky-600 rounded-full my-6 flex items-center justify-between">
          {/* Mũi tên bên phải */}
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-8 border-l-sky-600" />

          {/* Vạch chia & số */}
          {Array.from({ length: count }).map((_, idx) => {
            const num = min + idx;
            const isSelected = num === selectedNum;
            const isPrev = num === prevNum;
            const isNext = num === nextNum;

            return (
              <div
                key={num}
                onClick={() => setSelectedNum(num)}
                className="relative flex flex-col items-center cursor-pointer group"
              >
                {/* Vạch đứng */}
                <div
                  className={`w-1 transition-all ${
                    isSelected
                      ? 'h-8 bg-rose-500 ring-4 ring-rose-200 -my-3 z-10'
                      : isPrev || isNext
                      ? 'h-6 bg-sky-500 ring-2 ring-sky-200 -my-2'
                      : 'h-4 bg-sky-400 group-hover:h-6 group-hover:bg-sky-600'
                  } rounded-full`}
                />

                {/* Bong bóng số */}
                <button
                  type="button"
                  className={`mt-2 font-black transition-all ${
                    isSelected
                      ? 'w-9 h-9 rounded-full bg-rose-500 text-white text-base shadow-md scale-110'
                      : isPrev
                      ? 'w-8 h-8 rounded-full bg-amber-400 text-amber-950 text-sm ring-2 ring-amber-200'
                      : isNext
                      ? 'w-8 h-8 rounded-full bg-emerald-400 text-emerald-950 text-sm ring-2 ring-emerald-200'
                      : 'w-7 h-7 rounded-full text-slate-700 text-sm hover:bg-sky-200/60'
                  } flex items-center justify-center`}
                >
                  {num}
                </button>

                {/* Nhãn trên */}
                {isSelected && (
                  <span className="absolute -top-7 text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 whitespace-nowrap shadow-xs">
                    Số đang chọn
                  </span>
                )}
                {isPrev && showPreviousNext && (
                  <span className="absolute -top-7 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200 whitespace-nowrap">
                    Số liền trước
                  </span>
                )}
                {isNext && showPreviousNext && (
                  <span className="absolute -top-7 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 whitespace-nowrap">
                    Số liền sau
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Thẻ giải thích chi tiết số liền trước - số liền sau */}
      {showPreviousNext && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-center font-bold">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
            <div className="text-xs text-amber-700 uppercase">Số liền trước</div>
            <div className="text-xl text-amber-600 font-black mt-0.5">
              {prevNum !== null ? prevNum : 'Không có'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {prevNum !== null ? `${selectedNum} - 1 = ${prevNum}` : 'Gốc tia số là 0'}
            </div>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border-2 border-rose-300">
            <div className="text-xs text-rose-700 uppercase">Số đã cho</div>
            <div className="text-2xl text-rose-600 font-black mt-0.5">{selectedNum}</div>
            <div className="text-xs text-slate-500 mt-1">Vị trí trung tâm</div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="text-xs text-emerald-700 uppercase">Số liền sau</div>
            <div className="text-xl text-emerald-600 font-black mt-0.5">
              {nextNum !== null ? nextNum : 'Hết giới hạn'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {nextNum !== null ? `${selectedNum} + 1 = ${nextNum}` : 'Tia số còn kéo dài nữa'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
