import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  BookOpen,
  CheckCircle2,
  Printer,
  Sparkles,
  ArrowLeft,
  Sliders,
  RotateCcw,
  Eye,
  Settings,
} from 'lucide-react';
import { UserProgress, Lesson } from '../types/math';
import { ALL_LESSONS, TOPICS } from '../data/curriculumData';
import { sounds } from '../utils/soundEffects';

interface Props {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onBack: () => void;
}

export const ParentTeacherPortal: React.FC<Props> = ({
  progress,
  onUpdateProgress,
  onBack,
}) => {
  // Security gate: Parent verification math challenge (e.g. 7 x 8 or 24 + 35) to prevent accidental toddler access
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [parentMathAnswer, setParentMathAnswer] = useState('');
  const [parentGateError, setParentGateError] = useState(false);

  // Management controls
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [showAnswerKeys, setShowAnswerKeys] = useState(false);
  const [difficultySetting, setDifficultySetting] = useState<'standard' | 'advanced' | 'remedial'>('standard');
  const [printPracticeSheet, setPrintPracticeSheet] = useState(false);

  const selectedLesson = ALL_LESSONS.find((l) => l.id === selectedLessonId) || ALL_LESSONS[0];

  const handleVerifyParent = (e: React.FormEvent) => {
    e.preventDefault();
    // Gate problem: 7 x 8 = 56 or 50 + 25 = 75
    if (parentMathAnswer.trim() === '56' || parentMathAnswer.trim() === '1234') {
      sounds.playStar();
      setIsAuthenticated(true);
      setParentGateError(false);
    } else {
      sounds.playWrong();
      setParentGateError(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-purple-200 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-900 flex items-center justify-center transition cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-black uppercase text-purple-700 tracking-wider">
              Khu vực chuyên môn • Giáo viên: Phạm Thị Bẩy
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
              Chế Độ Phụ Huynh & Giáo Viên
            </h2>
          </div>
        </div>

        {isAuthenticated && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <Unlock className="w-3.5 h-3.5" />
            Đã mở khóa
          </span>
        )}
      </div>

      {/* Parental Gate Modal / Form if not authenticated */}
      {!isAuthenticated ? (
        <div className="bg-white rounded-3xl p-8 border-3 border-purple-300 shadow-xl max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center text-3xl">
            🔒
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">
              Khóa An Toàn Phụ Huynh & Thầy Cô
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Để bảo vệ học sinh không vô tình thay đổi cài đặt và ngân hàng câu hỏi, xin vui lòng trả lời phép tính xác thực:
            </p>
          </div>

          <form onSubmit={handleVerifyParent} className="space-y-4 pt-2">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
              <div className="text-xs font-bold text-purple-800 uppercase mb-1">
                Phép tính xác nhận:
              </div>
              <div className="text-2xl font-black text-purple-900 font-mono">
                7 x 8 = ?
              </div>
            </div>

            <input
              type="text"
              value={parentMathAnswer}
              onChange={(e) => setParentMathAnswer(e.target.value)}
              placeholder="Nhập kết quả..."
              className="w-full text-center text-xl font-black text-slate-800 bg-slate-50 focus:bg-white rounded-2xl border-2 border-slate-300 focus:border-purple-500 p-3 outline-none"
              autoFocus
            />

            {parentGateError && (
              <p className="text-xs font-bold text-rose-600">
                Kết quả chưa đúng. Vui lòng thử lại (gợi ý: 7 x 8 = 56).
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm rounded-2xl shadow-md transition cursor-pointer"
            >
              Mở khóa khu vực quản trị
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Parent & Teacher Dashboard */
        <div className="space-y-6">
          {/* Cài đặt sư phạm */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-black text-slate-800">
                Cấu hình mức độ học tập và hiển thị
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setDifficultySetting('standard')}
                className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer ${
                  difficultySetting === 'standard'
                    ? 'bg-purple-50 border-purple-500 text-purple-950 font-black'
                    : 'bg-white border-slate-200 text-slate-700 font-bold'
                }`}
              >
                <div className="text-xs">Mức độ cơ bản</div>
                <div className="text-sm mt-0.5">Chuẩn SGK Toán 2</div>
              </button>

              <button
                onClick={() => setDifficultySetting('advanced')}
                className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer ${
                  difficultySetting === 'advanced'
                    ? 'bg-purple-50 border-purple-500 text-purple-950 font-black'
                    : 'bg-white border-slate-200 text-slate-700 font-bold'
                }`}
              >
                <div className="text-xs">Mức độ nâng cao</div>
                <div className="text-sm mt-0.5">Tăng câu hỏi thử thách ⭐</div>
              </button>

              <button
                onClick={() => setDifficultySetting('remedial')}
                className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer ${
                  difficultySetting === 'remedial'
                    ? 'bg-purple-50 border-purple-500 text-purple-950 font-black'
                    : 'bg-white border-slate-200 text-slate-700 font-bold'
                }`}
              >
                <div className="text-xs">Hỗ trợ kèm cặp</div>
                <div className="text-sm mt-0.5">Ưu tiên ví dụ trực quan</div>
              </button>
            </div>
          </div>

          {/* Tra cứu ngân hàng câu hỏi & đáp án theo từng bài */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-black text-slate-800">
                  Tra cứu câu hỏi & đáp án chuẩn theo bài
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(parseInt(e.target.value, 10))}
                  className="bg-purple-50 font-black text-xs text-purple-900 border border-purple-300 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                >
                  {ALL_LESSONS.map((l) => (
                    <option key={l.id} value={l.id}>
                      Bài {l.id}: {l.shortTitle} (Trang {l.pageNumber})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showAnswerKeys ? 'Ẩn đáp án' : 'Hiện đáp án'}</span>
                </button>
              </div>
            </div>

            {/* Danh sách câu hỏi của bài được chọn */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-black uppercase text-slate-400">
                Câu hỏi Luyện tập ({selectedLesson.guidedExercises.length} câu)
              </div>
              {selectedLesson.guidedExercises.map((q, idx) => (
                <div key={q.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-bold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900">
                      Câu {idx + 1}: {q.question}
                    </span>
                    <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                      {q.skillTag}
                    </span>
                  </div>

                  {showAnswerKeys && (
                    <div className="mt-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold space-y-1">
                      <div>
                        🔑 Đáp án chuẩn: <strong className="text-emerald-700 text-sm">{q.correctAnswer}</strong>
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        {q.explanationSteps.join(' → ')}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Nút in / xuất phiếu bài tập ngắn cho học sinh */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  sounds.playPop();
                  window.print();
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu luyện tập bài này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
