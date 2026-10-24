import React, { useState } from 'react';
import {
  Award,
  Star,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Trash2,
  ArrowLeft,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { UserProgress } from '../types/math';
import { resetProgress } from '../utils/storage';
import { sounds } from '../utils/soundEffects';

interface Props {
  progress: UserProgress;
  onUpdateProgress: (updated: UserProgress) => void;
  onBack: () => void;
  onSelectLesson: (id: number) => void;
}

export const ProgressReport: React.FC<Props> = ({
  progress,
  onUpdateProgress,
  onBack,
  onSelectLesson,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [redoModeActive, setRedoModeActive] = useState(false);

  const totalLessons = 36;
  const completedCount = progress.completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const accuracyPercent =
    progress.answeredQuestionsCount > 0
      ? Math.round((progress.firstTryCorrectCount / progress.answeredQuestionsCount) * 100)
      : 100;

  const handleResetData = () => {
    sounds.playPop();
    const fresh = resetProgress();
    onUpdateProgress(fresh);
    setShowConfirmReset(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border-3 border-amber-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-black uppercase text-amber-700 tracking-wider">
              Theo dõi tiến bộ cá nhân
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Bảng Thành Tích Của {progress.studentName} 🌟
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Ngày học gần nhất: {progress.lastStudiedDate || 'Hôm nay'}</span>
        </div>
      </div>

      {/* 4 Thẻ Số Liệu Thực Tế */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl text-white shadow-md">
          <span className="text-3xl block mb-1">⭐</span>
          <div className="text-xs font-black uppercase text-amber-950/70">Tổng số sao</div>
          <div className="text-3xl font-black">{progress.totalStars}</div>
          <div className="text-[11px] font-bold text-amber-100 mt-1">Đã tích lũy</div>
        </div>

        <div className="p-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl text-white shadow-md">
          <span className="text-3xl block mb-1">📖</span>
          <div className="text-xs font-black uppercase text-emerald-950/70">Bài hoàn thành</div>
          <div className="text-3xl font-black">{completedCount} / 36</div>
          <div className="text-[11px] font-bold text-emerald-100 mt-1">{progressPercent}% lộ trình</div>
        </div>

        <div className="p-5 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl text-white shadow-md">
          <span className="text-3xl block mb-1">🎯</span>
          <div className="text-xs font-black uppercase text-sky-950/70">Đúng lần đầu</div>
          <div className="text-3xl font-black">{progress.firstTryCorrectCount}</div>
          <div className="text-[11px] font-bold text-sky-100 mt-1">Đạt {accuracyPercent}% câu làm</div>
        </div>

        <div className="p-5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl text-white shadow-md">
          <span className="text-3xl block mb-1">💡</span>
          <div className="text-xs font-black uppercase text-purple-950/70">Câu cần gợi ý</div>
          <div className="text-3xl font-black">{progress.neededHintCount}</div>
          <div className="text-[11px] font-bold text-purple-100 mt-1">Học từ gợi ý</div>
        </div>
      </div>

      {/* ĐÁNH GIÁ KỸ NĂNG: THÀNH THẠO VÀ CẦN ÔN TẬP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kỹ năng đã thành thạo */}
        <div className="bg-white rounded-3xl p-6 border-3 border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-800">
              Kỹ năng em đã thành thạo
            </h3>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-emerald-950">Đọc viết các số đến 100</div>
                <div className="text-xs font-bold text-emerald-700">Chục và đơn vị, so sánh số</div>
              </div>
              <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
                100% Đạt
              </span>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-emerald-950">Tia số, số liền trước liền sau</div>
                <div className="text-xs font-bold text-emerald-700">Quy tắc lùi 1, tiến 1 đơn vị</div>
              </div>
              <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
                Thành thạo
              </span>
            </div>

            <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-emerald-950">Phép cộng qua 10 phạm vi 20</div>
                <div className="text-xs font-bold text-emerald-700">Tách số làm tròn 10</div>
              </div>
              <span className="text-xs font-black bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
                Xuất sắc
              </span>
            </div>
          </div>
        </div>

        {/* Kỹ năng cần ôn tập */}
        <div className="bg-white rounded-3xl p-6 border-3 border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-black text-slate-800">
              Kỹ năng em nên luyện tập thêm
            </h3>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-amber-950">Phép trừ có nhớ phạm vi 100</div>
                <div className="text-xs font-bold text-amber-800">Quy tắc mượn 1 chục và bớt ở hàng chục</div>
              </div>
              <button
                onClick={() => onSelectLesson(22)}
                className="text-xs font-black bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-xl transition cursor-pointer"
              >
                Ôn ngay
              </button>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-amber-950">Xem đồng hồ 15 phút, 30 phút</div>
                <div className="text-xs font-bold text-amber-800">Kim dài chỉ số 3 và số 6</div>
              </div>
              <button
                onClick={() => onSelectLesson(31)}
                className="text-xs font-black bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-xl transition cursor-pointer"
              >
                Ôn ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KHU VỰC THAO TÁC TIẾN TRÌNH */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-slate-800">Quản lý dữ liệu học tập</h4>
          <p className="text-xs font-bold text-slate-500">
            Dữ liệu được lưu an toàn trên trình duyệt của máy bạn, không chứa thông tin riêng tư.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-slate-300 transition cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa dữ liệu để học lại từ đầu</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-xl border border-rose-300">
              <span className="text-xs font-bold text-rose-800">Bạn có chắc chắn muốn xóa?</span>
              <button
                onClick={handleResetData}
                className="px-3 py-1 bg-rose-600 text-white font-black text-xs rounded-lg cursor-pointer"
              >
                Đồng ý xóa
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-1 text-slate-600 text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
