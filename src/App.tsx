import React, { useState, useEffect } from 'react';
import { UserProgress, Lesson } from './types/math';
import { loadProgress, saveProgress, DEFAULT_PROGRESS } from './utils/storage';
import { sounds } from './utils/soundEffects';
import { ALL_LESSONS } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { TopicsMap } from './components/TopicsMap';
import { LessonDetailView } from './components/LessonDetailView';
import { GamesCenter } from './components/GamesCenter';
import { ProgressReport } from './components/ProgressReport';
import { ParentTeacherPortal } from './components/ParentTeacherPortal';
import { ChatbotRoboToan } from './components/ChatbotRoboToan';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [activeView, setActiveView] = useState<'home' | 'map' | 'lesson' | 'games' | 'progress' | 'portal'>('home');
  const [activeLessonId, setActiveLessonId] = useState<number>(progress.currentLessonId || 1);

  // Sync mute setting with Web Audio synthesizer
  useEffect(() => {
    sounds.setMuted(!progress.soundEnabled);
  }, [progress.soundEnabled]);

  const handleUpdateProgress = (updated: UserProgress) => {
    setProgress(updated);
    saveProgress(updated);
  };

  const handleToggleSound = () => {
    const updated: UserProgress = {
      ...progress,
      soundEnabled: !progress.soundEnabled,
    };
    sounds.playPop();
    handleUpdateProgress(updated);
  };

  const handleUpdateName = (name: string) => {
    const updated: UserProgress = {
      ...progress,
      studentName: name,
    };
    handleUpdateProgress(updated);
  };

  const handleStartLesson = (lessonId: number) => {
    setActiveLessonId(lessonId);
    const updated: UserProgress = {
      ...progress,
      currentLessonId: lessonId,
    };
    handleUpdateProgress(updated);
    setActiveView('lesson');
  };

  const handleAddStars = (stars: number) => {
    const updated: UserProgress = {
      ...progress,
      totalStars: progress.totalStars + stars,
    };
    handleUpdateProgress(updated);
  };

  const activeLesson = ALL_LESSONS.find((l) => l.id === activeLessonId) || ALL_LESSONS[0];

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-slate-800 font-['Nunito',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        progress={progress}
        activeView={activeView}
        onNavigate={(view) => {
          sounds.playPop();
          setActiveView(view);
        }}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area based on View Router */}
      <main className="flex-1 pb-16">
        {activeView === 'home' && (
          <HomeView
            progress={progress}
            onUpdateName={handleUpdateName}
            onStartLesson={handleStartLesson}
            onNavigate={(view) => {
              sounds.playPop();
              setActiveView(view);
            }}
          />
        )}

        {activeView === 'map' && (
          <TopicsMap
            progress={progress}
            onSelectLesson={handleStartLesson}
            onBackToHome={() => setActiveView('home')}
          />
        )}

        {activeView === 'lesson' && (
          <LessonDetailView
            lesson={activeLesson}
            progress={progress}
            onBack={() => setActiveView('map')}
            onNextLesson={(nextId) => handleStartLesson(nextId)}
            onSaveProgress={handleUpdateProgress}
          />
        )}

        {activeView === 'games' && (
          <GamesCenter
            onAddStars={handleAddStars}
            onBack={() => setActiveView('home')}
          />
        )}

        {activeView === 'progress' && (
          <ProgressReport
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onBack={() => setActiveView('home')}
            onSelectLesson={handleStartLesson}
          />
        )}

        {activeView === 'portal' && (
          <ParentTeacherPortal
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onBack={() => setActiveView('home')}
          />
        )}
      </main>

      {/* Footer nhỏ thân thiện */}
      <footer className="py-4 text-center text-xs font-bold text-slate-400 border-t border-amber-200/50 bg-white/50">
        <p>Vương Quốc Toán Học Lớp 2 – Tập 1 • Bộ sách Kết nối tri thức với cuộc sống</p>
        <p className="text-[11px] text-slate-400/80 mt-0.5">“Mỗi ngày học một chút – Mỗi ngày giỏi Toán hơn!” • Giáo viên: Phạm Thị Bẩy</p>
      </footer>

      {/* Chatbot Gia sư AI Robo Toán nổi ở góc phải màn hình */}
      <ChatbotRoboToan
        currentLesson={activeView === 'lesson' ? activeLesson : undefined}
      />
    </div>
  );
}
