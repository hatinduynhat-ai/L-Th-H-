import React, { useState } from 'react';

interface Props {
  num1?: number;
  num2?: number;
  label?: string;
}

export const SplitCombineVisualizer: React.FC<Props> = ({
  num1 = 9,
  num2 = 5,
  label,
}) => {
  const [step, setStep] = useState<number>(0);

  // Split calculations
  const neededForTen = 10 - num1;
  const remaining = num2 - neededForTen;
  const total = num1 + num2;

  return (
    <div className="bg-rose-50/70 border-2 border-rose-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
            Mô hình trực quan: Tách gộp qua 10
          </span>
          <h4 className="text-xl font-black text-slate-800 mt-1">
            {label || `Phép cộng qua 10: ${num1} + ${num2} = ?`}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-3 py-1 bg-white hover:bg-rose-100 disabled:opacity-40 text-rose-800 font-bold rounded-lg border border-rose-300 text-sm cursor-pointer disabled:cursor-not-allowed transition"
          >
            ◀ Bước trước
          </button>
          <span className="text-xs font-black text-rose-700 px-2">
            Bước {step + 1} / 4
          </span>
          <button
            onClick={() => setStep(Math.min(3, step + 1))}
            disabled={step === 3}
            className="px-3 py-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold rounded-lg text-sm cursor-pointer disabled:cursor-not-allowed transition"
          >
            Bước tiếp ▶
          </button>
        </div>
      </div>

      {/* Vùng hiển thị trực quan quả táo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-rose-100">
        {/* Nhóm thứ nhất: num1 quả táo đỏ */}
        <div className={`p-4 rounded-xl transition-all border-2 ${
          step >= 2 ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200' : 'bg-rose-50/50 border-rose-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-rose-800">
              Nhóm 1: {num1} quả táo đỏ
            </span>
            {step >= 2 && (
              <span className="text-xs font-extrabold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Đã tròn 1 chục (10 quả)! 🌟
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center min-h-[90px]">
            {Array.from({ length: num1 }).map((_, i) => (
              <span
                key={`red-${i}`}
                className="text-3xl select-none transform hover:scale-125 transition-transform"
                title="Táo đỏ"
              >
                🍎
              </span>
            ))}

            {/* Quả táo vàng đã được ghép sang để đủ 10 */}
            {step >= 2 && Array.from({ length: neededForTen }).map((_, i) => (
              <span
                key={`borrowed-${i}`}
                className="text-3xl select-none animate-bounce"
                title="Táo vàng được ghép sang làm tròn 10"
              >
                🍏
              </span>
            ))}
          </div>
        </div>

        {/* Nhóm thứ hai: num2 quả táo xanh được tách */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border-2 border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-black text-emerald-800">
              Nhóm 2: {num2} quả táo xanh
            </span>
            {step >= 1 && (
              <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                Tách: {neededForTen} và {remaining}
              </span>
            )}
          </div>

          <div className="min-h-[90px]">
            {step === 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: num2 }).map((_, i) => (
                  <span key={`green-${i}`} className="text-3xl select-none">
                    🍏
                  </span>
                ))}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-amber-100/60 rounded-lg border border-amber-300/60">
                  <span className="text-xs font-bold text-amber-900">Phần tách để cho số 9 tròn 10:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: neededForTen }).map((_, i) => (
                      <span key={`split1-${i}`} className="text-2xl select-none">🍏</span>
                    ))}
                  </div>
                  <span className="text-sm font-black text-amber-800">({neededForTen} quả)</span>
                </div>

                <div className="flex items-center gap-2 p-2 bg-emerald-100/60 rounded-lg border border-emerald-300/60">
                  <span className="text-xs font-bold text-emerald-900">Phần còn lại:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: remaining }).map((_, i) => (
                      <span key={`split2-${i}`} className="text-2xl select-none">🍏</span>
                    ))}
                  </div>
                  <span className="text-sm font-black text-emerald-800">({remaining} quả)</span>
                </div>
              </div>
            )}

            {step >= 2 && (
              <div className="flex flex-col justify-center h-full">
                <div className="text-xs font-bold text-emerald-800 mb-1">
                  Đã chuyển {neededForTen} quả sang nhóm 1, ở đây còn:
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: remaining }).map((_, i) => (
                    <span key={`remaining-${i}`} className="text-3xl select-none">🍏</span>
                  ))}
                  <span className="text-sm font-black text-emerald-900 self-center">
                    = {remaining} quả
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lời giải thích từng bước sinh động */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-300/80">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-xs shrink-0">
            🤖
          </div>
          <div>
            <div className="text-xs font-extrabold text-amber-900 uppercase">
              Robo Toán giải thích bước {step + 1}:
            </div>
            <div className="text-base font-bold text-slate-800 mt-0.5">
              {step === 0 && (
                <span>
                  Đề bài yêu cầu tính <strong className="text-rose-600 font-black">{num1} + {num2}</strong>. Chúng mình có {num1} quả táo đỏ và {num2} quả táo xanh. Bấm "Bước tiếp" để xem cách tính siêu nhanh nhé!
                </span>
              )}
              {step === 1 && (
                <span>
                  Số {num1} cần thêm <strong className="text-amber-700 font-black">{neededForTen}</strong> để được 10. Ta tách {num2} thành <strong className="text-amber-700">{neededForTen}</strong> và <strong className="text-emerald-700">{remaining}</strong>.
                </span>
              )}
              {step === 2 && (
                <span>
                  Ghép {num1} quả đỏ với {neededForTen} quả xanh: <strong className="text-amber-800 font-mono bg-white px-2 py-0.5 rounded">{num1} + {neededForTen} = 10</strong>. Chúng mình đã có 1 chục!
                </span>
              )}
              {step === 3 && (
                <span>
                  Lấy 10 cộng với phần còn lại: <strong className="text-rose-700 font-mono bg-white px-2 py-0.5 rounded">10 + {remaining} = {total}</strong>. Vậy kết luận: <strong className="text-rose-700 font-black text-lg">{num1} + {num2} = {total}</strong>! 🎉
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
