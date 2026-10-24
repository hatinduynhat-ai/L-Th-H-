import React, { useState } from 'react';
import { Play, ArrowRight, Award, Gamepad2, Map, BookOpen, Star, Sparkles, CheckCircle2, Heart } from 'lucide-react';
import { UserProgress, Lesson } from '../types/math';
import { ALL_LESSONS, TOPICS } from '../data/curriculumData';
import { sounds } from '../utils/soundEffects';

interface Props {
  progress: UserProgress;
  onUpdateName: (name: string) => void;
  onStartLesson: (lessonId: number) => void;
  onNavigate: (view: 'home' | 'map' | 'lesson' | 'games' | 'progress' | 'portal') => void;
}

export const HomeView: React.FC<Props> = ({
  progress,
  onUpdateName,
  onStartLesson,
  onNavigate,
}) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.studentName || 'Bạn nhỏ');

  const totalLessons = 36;
  const completedCount = progress.completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const currentLesson = ALL_LESSONS.find((l) => l.id === progress.currentLessonId) || ALL_LESSONS[0];

  const getEncouragement = () => {
    if (completedCount === 0) return 'Khởi đầu chuyến phiêu lưu kỳ thú cùng Robo Toán nào!';
    if (completedCount < 6) return 'Tuyệt vời lắm! Em đang làm quen rất nhanh với các con số!';
    if (completedCount < 14) return 'Bé tính nhẩm siêu quá! Thung lũng phép tính đã mở rộng!';
    if (completedCount < 24) return 'Em đã chinh phục cả phép tính có nhớ! Thật đáng khen!';
    if (completedCount < 32) return 'Thời gian và hình học không làm khó được em!';
    return 'Xuất sắc! Em sắp trở thành Vua Toán Học Lớp 2 rồi!';
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setEditingName(false);
      sounds.playStar();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Hero Banner Chào Mừng Hoạt Hình */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-10 text-white shadow-xl border-4 border-amber-300">
        {/* Bong bóng trang trí */}
        <div className="absolute top-2 right-12 w-20 h-20 bg-white/20 rounded-full blur-md pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-yellow-300/30 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 justify-between">
          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-xs sm:text-sm font-black text-amber-950">
                <span>🌟</span>
                <span>Chào mừng em đến với Vương quốc Toán học!</span>
              </div>

              {/* Tên giáo viên bên dưới dòng chào mừng */}
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 bg-amber-950/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/35 text-xs sm:text-sm font-extrabold text-amber-950 shadow-xs">
                  <span className="text-base">👩‍🏫</span>
                  <span>Giáo viên: <span className="text-white font-black drop-shadow-sm">Phạm Thị Bẩy</span></span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-4xl font-black drop-shadow-md">
                Xin chào,{' '}
                {editingName ? (
                  <span className="inline-flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      className="bg-white text-slate-800 text-xl font-black px-3 py-1 rounded-xl outline-none w-48 shadow-inner"
                      placeholder="Nhập tên em..."
                      autoFocus
                    />
                    <button
                      onClick={handleSaveName}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black px-3 py-1.5 rounded-xl transition cursor-pointer"
                    >
                      Lưu
                    </button>
                  </span>
                ) : (
                  <span
                    onClick={() => setEditingName(true)}
                    className="underline decoration-wavy decoration-amber-200 cursor-pointer hover:text-amber-100"
                    title="Nhấn để đổi tên hoặc biệt danh của em"
                  >
                    {progress.studentName} ✏️
                  </span>
                )}
                !
              </h2>

              <p className="text-base sm:text-lg font-bold text-amber-100 max-w-xl">
                {getEncouragement()}
              </p>
            </div>

            {/* Thanh tiến độ học tập */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between items-center text-xs font-black text-amber-950 mb-1.5">
                <span>Tiến độ chinh phục Tập 1</span>
                <span>{completedCount}/{totalLessons} bài ({progressPercent}%)</span>
              </div>
              <div className="h-4 bg-amber-950/20 rounded-full overflow-hidden p-0.5 border border-white/40">
                <div
                  className="h-full bg-gradient-to-r from-yellow-200 via-amber-300 to-emerald-300 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Nhân vật Robo Toán và hai bạn nhỏ */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              {/* Vòng hào quang */}
              <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-60 animate-pulse" />
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 bg-white/30 backdrop-blur-sm rounded-full border-4 border-white/60 p-3 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <span className="text-6xl sm:text-7xl block select-none transform hover:rotate-6 transition-transform">
                    🤖
                  </span>
                  <span className="inline-block mt-1 bg-white text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
                    Robo Toán
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs font-black bg-amber-950/30 px-3 py-1 rounded-full text-white">
              <span>Cùng bạn Nam 👦 và bạn Mai 👧</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 NÚT THAO TÁC CHÍNH BẰNG NÚT LỚN DỄ NHẤN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Nút 1: Học tiếp bài trước */}
        <button
          onClick={() => {
            sounds.playPop();
            onStartLesson(currentLesson.id);
          }}
          className="group p-5 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-3xl shadow-md hover:shadow-xl transition-all text-left border-3 border-emerald-400 cursor-pointer transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-white/20 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
              🚀
            </span>
            <span className="text-xs font-black bg-white text-emerald-900 px-3 py-1 rounded-full uppercase tracking-wider">
              Khuyên học
            </span>
          </div>
          <h3 className="text-xl font-black leading-snug">Học tiếp bài trước</h3>
          <p className="text-xs text-emerald-100 font-bold mt-1 line-clamp-1">
            {currentLesson.title}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-black text-amber-200">
            <span>Vào học ngay</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Nút 2: Chọn bài học (Bản đồ 7 chủ đề) */}
        <button
          onClick={() => {
            sounds.playPop();
            onNavigate('map');
          }}
          className="group p-5 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-3xl shadow-md hover:shadow-xl transition-all text-left border-3 border-sky-400 cursor-pointer transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-white/20 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
              🗺️
            </span>
            <span className="text-xs font-black bg-white text-sky-900 px-3 py-1 rounded-full uppercase tracking-wider">
              36 Bài học
            </span>
          </div>
          <h3 className="text-xl font-black leading-snug">Chọn bài học</h3>
          <p className="text-xs text-sky-100 font-bold mt-1">
            Khám phá 7 vùng đất từ Bài 1 đến Bài 36
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-black text-amber-200">
            <span>Mở bản đồ chủ đề</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Nút 3: Thử thách Toán vui (8 Trò chơi) */}
        <button
          onClick={() => {
            sounds.playPop();
            onNavigate('games');
          }}
          className="group p-5 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-3xl shadow-md hover:shadow-xl transition-all text-left border-3 border-purple-400 cursor-pointer transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-white/20 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
              🎮
            </span>
            <span className="text-xs font-black bg-white text-purple-900 px-3 py-1 rounded-full uppercase tracking-wider">
              8 Trò chơi
            </span>
          </div>
          <h3 className="text-xl font-black leading-snug">Thử thách Toán vui</h3>
          <p className="text-xs text-purple-100 font-bold mt-1">
            Siêu thị, đua xe, mê cung, ghép đôi thẻ số
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-black text-amber-200">
            <span>Chơi ngay không cần đợi</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Nút 4: Thành tích của em */}
        <button
          onClick={() => {
            sounds.playPop();
            onNavigate('progress');
          }}
          className="group p-5 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-3xl shadow-md hover:shadow-xl transition-all text-left border-3 border-amber-300 cursor-pointer transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-white/20 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
              🏆
            </span>
            <span className="text-xs font-black bg-white text-amber-900 px-3 py-1 rounded-full uppercase tracking-wider">
              {progress.totalStars} Ngôi sao
            </span>
          </div>
          <h3 className="text-xl font-black leading-snug">Thành tích của em</h3>
          <p className="text-xs text-amber-100 font-bold mt-1">
            Xem tiến bộ, số câu đúng và luyện lại câu sai
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-black text-white">
            <span>Xem bảng thành tích</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Nút 5: Bắt đầu học bài đầu tiên */}
        <button
          onClick={() => {
            sounds.playPop();
            onStartLesson(1);
          }}
          className="group p-5 bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-3xl shadow-md hover:shadow-xl transition-all text-left border-3 border-rose-400 cursor-pointer transform hover:-translate-y-1 sm:col-span-2 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-3 bg-white/20 rounded-2xl text-2xl group-hover:scale-110 transition-transform">
              📖
            </span>
            <span className="text-xs font-black bg-white text-rose-900 px-3 py-1 rounded-full uppercase tracking-wider">
              Chuẩn SGK Toán 2
            </span>
          </div>
          <h3 className="text-xl font-black leading-snug">Bắt đầu học: Bài 1 - Ôn tập các số đến 100</h3>
          <p className="text-xs text-rose-100 font-bold mt-1">
            Tìm hiểu số chục, số đơn vị, làm quen que tính và bài tập trực quan có hướng dẫn
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-black text-amber-200">
            <span>Bắt đầu từ Bài 1</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* TỔNG KẾT NHANH 7 VÙNG ĐẤT CHỦ ĐỀ */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-3 border-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-black uppercase text-amber-700 tracking-wider">
              Khám phá vương quốc
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-0.5">
              7 Vùng đất toán học theo chuẩn chương trình
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('map');
            }}
            className="text-sm font-black text-amber-600 hover:text-amber-800 flex items-center gap-1 underline cursor-pointer"
          >
            Xem tất cả 36 bài học ▶
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOPICS.slice(0, 4).map((topic) => (
            <div
              key={topic.id}
              onClick={() => {
                sounds.playPop();
                onStartLesson(topic.startLessonId);
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/70 border-2 border-slate-200 hover:border-amber-300 transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {topic.icon}
              </div>
              <div className="text-xs font-black text-amber-800 uppercase tracking-wider">
                Chủ đề {topic.id}
              </div>
              <h4 className="font-black text-slate-800 text-sm mt-0.5 group-hover:text-amber-700 transition-colors">
                {topic.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-bold mt-1 line-clamp-2">
                {topic.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs font-black text-slate-600 pt-2 border-t border-slate-200/60">
                <span>{topic.lessonCount} bài</span>
                <span className="text-amber-600 group-hover:translate-x-0.5 transition-transform">
                  Học ngay →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
