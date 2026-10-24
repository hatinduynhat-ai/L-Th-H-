import React from 'react';
import { Sparkles, Volume2, VolumeX, ShieldCheck, Home, Map, Gamepad2, Award } from 'lucide-react';
import { UserProgress } from '../types/math';
import { sounds } from '../utils/soundEffects';

interface Props {
  progress: UserProgress;
  activeView: 'home' | 'map' | 'lesson' | 'games' | 'progress' | 'portal';
  onNavigate: (view: 'home' | 'map' | 'lesson' | 'games' | 'progress' | 'portal') => void;
  onToggleSound: () => void;
}

export const Navbar: React.FC<Props> = ({
  progress,
  activeView,
  onNavigate,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-3 border-amber-300 shadow-sm px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Slogan */}
        <div
          onClick={() => {
            sounds.playPop();
            onNavigate('home');
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl sm:text-2xl">
              👑
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-900 leading-tight group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
              <span>VƯƠNG QUỐC TOÁN HỌC 2</span>
              <span className="text-[10px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Tập 1
              </span>
            </h1>
            <p className="hidden md:block text-[11px] font-bold text-amber-700/80">
              “Mỗi ngày học một chút – Mỗi ngày giỏi Toán hơn!”
            </p>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('home');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'home'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:bg-amber-100/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Trang chủ</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('map');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'map' || activeView === 'lesson'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:bg-amber-100/60'
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">36 Bài học</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('games');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'games'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:bg-amber-100/60'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span className="hidden sm:inline">Trò chơi</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('progress');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer ${
              activeView === 'progress'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:bg-amber-100/60'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Thành tích</span>
          </button>
        </nav>

        {/* Right side: Star balance, Sound toggle & Teacher portal */}
        <div className="flex items-center gap-2">
          {/* Star counter */}
          <div
            onClick={() => onNavigate('progress')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 px-3 py-1 rounded-full shadow-xs cursor-pointer hover:scale-105 transition"
            title="Số ngôi sao em đã tích luỹ"
          >
            <span className="text-base sm:text-lg">⭐</span>
            <span className="text-sm sm:text-base font-black text-amber-900">{progress.totalStars}</span>
          </div>

          {/* Sound button */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition cursor-pointer"
            title={progress.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {progress.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Parent & Teacher mode */}
          <button
            onClick={() => {
              sounds.playPop();
              onNavigate('portal');
            }}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1 text-xs font-black ${
              activeView === 'portal'
                ? 'bg-purple-600 text-white border-purple-700'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border-purple-200'
            }`}
            title="Dành cho Phụ huynh và Giáo viên"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden lg:inline">Phụ huynh / GV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
