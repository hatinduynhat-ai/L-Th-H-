import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, AlertCircle, ArrowRight, RotateCcw, Lightbulb, Sparkles } from 'lucide-react';
import { ExerciseQuestion } from '../types/math';
import { sounds } from '../utils/soundEffects';

interface Props {
  question: ExerciseQuestion;
  onAnswerResult: (isCorrectFirstTry: boolean, questionId: string) => void;
  onNextQuestion?: () => void;
  isLast?: boolean;
}

export const ExerciseCard: React.FC<Props> = ({
  question,
  onAnswerResult,
  onNextQuestion,
  isLast = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [fillAnswer, setFillAnswer] = useState<string>('');
  const [intermediateInput, setIntermediateInput] = useState<string>('');

  // Pedagogical state machine
  // status: 'thinking' | 'correct' | 'wrong_level1' | 'wrong_level2' | 'guided_solution'
  const [status, setStatus] = useState<'thinking' | 'correct' | 'wrong_level1' | 'wrong_level2' | 'guided_solution'>('thinking');
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [showFullExplanation, setShowFullExplanation] = useState<boolean>(false);

  const getCleanValue = (val: string | number) =>
    String(val).trim().toLowerCase();

  const handleCheckAnswer = () => {
    sounds.playPop();
    const studentAns = question.type === 'multiple-choice' || question.type === 'comparison'
      ? selectedOption
      : fillAnswer;

    if (!studentAns && studentAns !== '0') {
      return; // Do nothing if blank
    }

    const isMatch = getCleanValue(studentAns) === getCleanValue(question.correctAnswer);

    if (isMatch) {
      sounds.playCorrect();
      sounds.playStar();
      setStatus('correct');
      setShowFullExplanation(true);
      onAnswerResult(attemptCount === 0, question.id);
    } else {
      sounds.playWrong();
      const newAttempts = attemptCount + 1;
      setAttemptCount(newAttempts);

      if (newAttempts === 1) {
        setStatus('wrong_level1');
      } else {
        setStatus('wrong_level2');
      }
    }
  };

  const handleResetForRetry = () => {
    sounds.playPop();
    if (question.type === 'multiple-choice' || question.type === 'comparison') {
      setSelectedOption('');
    } else {
      setFillAnswer('');
    }
  };

  const handleRequestHelp = () => {
    sounds.playPop();
    setStatus('guided_solution');
    setShowFullExplanation(true);
    onAnswerResult(false, question.id);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg border-3 border-amber-200/80 transition-all">
      {/* Header câu hỏi: độ khó & kỹ năng */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800">
            {question.skillTag}
          </span>
          <span className="text-xs font-bold text-slate-500">
            {question.difficulty === 1 && '⭐ Mức 1: Nhận biết'}
            {question.difficulty === 2 && '⭐⭐ Mức 2: Thông hiểu'}
            {question.difficulty === 3 && '⭐⭐⭐ Mức 3: Vận dụng'}
            {question.difficulty === 4 && '⭐⭐⭐⭐ Mức 4: Thử thách'}
          </span>
        </div>

        {status === 'thinking' && (
          <button
            onClick={handleRequestHelp}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Em chưa hiểu – Hướng dẫn em
          </button>
        )}
      </div>

      {/* Nội dung câu hỏi */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
          {question.question}
        </h3>
      </div>

      {/* VÙNG TRẢ LỜI CỦA HỌC SINH (TUYỆT ĐỐI KHÔNG LỘ ĐÁP ÁN TRƯỚC KHI KIỂM TRA) */}
      <div className="mb-6">
        {question.type === 'multiple-choice' || question.type === 'comparison' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options?.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCheckingDone = status === 'correct' || status === 'guided_solution';
              const isRightAnswer = getCleanValue(opt) === getCleanValue(question.correctAnswer);

              let btnStyle = 'bg-slate-50 hover:bg-amber-50 text-slate-800 border-2 border-slate-200';
              if (isSelected && !isCheckingDone) {
                btnStyle = 'bg-amber-100 text-amber-950 border-3 border-amber-500 shadow-md scale-[1.02]';
              } else if (isCheckingDone && isRightAnswer) {
                btnStyle = 'bg-emerald-100 text-emerald-950 border-3 border-emerald-500 shadow-md';
              } else if (isCheckingDone && isSelected && !isRightAnswer) {
                btnStyle = 'bg-rose-100 text-rose-950 border-2 border-rose-300 opacity-60';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={status === 'correct' || status === 'guided_solution'}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedOption(opt);
                  }}
                  className={`p-4 rounded-2xl text-left font-bold text-base transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-xs font-black text-slate-700 shadow-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </span>

                  {isCheckingDone && isRightAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-base font-extrabold text-slate-700">Đáp án của em:</span>
            <input
              type="text"
              value={fillAnswer}
              disabled={status === 'correct' || status === 'guided_solution'}
              onChange={(e) => setFillAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCheckAnswer();
                }
              }}
              placeholder="Nhập số..."
              className="w-36 text-center text-xl font-black text-slate-800 bg-amber-50/50 focus:bg-white rounded-2xl border-3 border-amber-300 focus:border-amber-500 p-3 outline-none transition"
            />
          </div>
        )}
      </div>

      {/* HÀNG NÚT THAO TÁC */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {status === 'thinking' && (
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={!selectedOption && !fillAnswer && fillAnswer !== '0'}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-black text-base rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Kiểm tra đáp án</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {status === 'wrong_level1' && (
          <div className="w-full space-y-3">
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-start gap-3">
              <span className="text-2xl">🤔</span>
              <div className="flex-1">
                <div className="text-sm font-black text-amber-900">
                  Chưa đúng rồi, em thử quan sát và suy nghĩ thêm nhé!
                </div>
                <div className="text-sm font-bold text-amber-800 mt-1">
                  💡 <strong className="underline">Gợi ý cấp độ 1:</strong> {question.hintLevel1}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCheckAnswer}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl text-sm shadow-md transition cursor-pointer"
              >
                Kiểm tra lại
              </button>
              <button
                type="button"
                onClick={handleResetForRetry}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-300 text-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Chọn lại
              </button>
              <button
                type="button"
                onClick={handleRequestHelp}
                className="ml-auto text-xs font-bold text-sky-600 hover:text-sky-800 underline cursor-pointer"
              >
                Xem hướng dẫn từng bước
              </button>
            </div>
          </div>
        )}

        {status === 'wrong_level2' && (
          <div className="w-full space-y-3">
            <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-2xl flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <div className="text-sm font-black text-orange-950">
                  Cố lên nào bạn nhỏ! Robo Toán hỗ trợ gợi ý bước trung gian nhé:
                </div>
                <div className="text-sm font-bold text-orange-900 mt-1">
                  🔎 <strong className="underline">Gợi ý cấp độ 2:</strong> {question.hintLevel2}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCheckAnswer}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-sm shadow-md transition cursor-pointer"
              >
                Kiểm tra lại
              </button>
              <button
                type="button"
                onClick={handleRequestHelp}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                <Lightbulb className="w-4 h-4" />
                Xem hướng dẫn từng bước
              </button>
            </div>
          </div>
        )}

        {(status === 'correct' || status === 'guided_solution') && (
          <div className="w-full space-y-4">
            {status === 'correct' && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center gap-3">
                <span className="text-3xl animate-bounce">🎉</span>
                <div>
                  <h4 className="text-base font-black text-emerald-900">
                    Tuyệt vời! Em đã trả lời chính xác!
                  </h4>
                  <p className="text-xs font-bold text-emerald-700">
                    Em hãy cùng Robo Toán xem lại các bước giải thích vì sao nhé!
                  </p>
                </div>
                <span className="ml-auto text-xl font-black text-amber-500 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                  +1 ⭐
                </span>
              </div>
            )}

            {/* Hướng dẫn giải chi tiết từng bước */}
            {showFullExplanation && (
              <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50/80 to-sky-50/80 rounded-2xl border-2 border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-sm shadow-xs">
                    🤖
                  </div>
                  <h5 className="text-sm font-black uppercase text-amber-900 tracking-wider">
                    Lời giải chi tiết từng bước:
                  </h5>
                </div>

                <div className="space-y-2 text-sm font-bold text-slate-800">
                  {question.explanationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-amber-100">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                  <div className="pt-2 text-center text-emerald-700 font-extrabold text-base">
                    👉 Đáp án đúng là:{' '}
                    <span className="bg-emerald-100 text-emerald-950 px-3 py-1 rounded-lg border border-emerald-300 font-black">
                      {question.correctAnswer}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Nút chuyển câu tiếp theo */}
            {onNextQuestion && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    onNextQuestion();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-2"
                >
                  <span>{isLast ? 'Hoàn thành bài tập' : 'Sang câu tiếp theo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
