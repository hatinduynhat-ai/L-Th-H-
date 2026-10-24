import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Target,
  MessageCircleQuestion,
  Compass,
} from 'lucide-react';
import { Lesson, ExerciseQuestion, UserProgress } from '../types/math';
import { ExerciseCard } from './ExerciseCard';
import { BundlesVisualizer } from './visuals/BundlesVisualizer';
import { NumberLineVisualizer } from './visuals/NumberLineVisualizer';
import { SplitCombineVisualizer } from './visuals/SplitCombineVisualizer';
import { ScaleBalanceVisualizer } from './visuals/ScaleBalanceVisualizer';
import { ClockVisualizer } from './visuals/ClockVisualizer';
import { GeometryVisualizer } from './visuals/GeometryVisualizer';
import { sounds } from '../utils/soundEffects';

interface Props {
  lesson: Lesson;
  progress: UserProgress;
  onBack: () => void;
  onNextLesson: (nextId: number) => void;
  onSaveProgress: (updated: UserProgress) => void;
  onOpenRoboChat?: () => void;
}

export const LessonDetailView: React.FC<Props> = ({
  lesson,
  progress,
  onBack,
  onNextLesson,
  onSaveProgress,
  onOpenRoboChat,
}) => {
  // Navigation Tabs: 'explore' | 'guided' | 'self' | 'reallife' | 'summary'
  const [activeTab, setActiveTab] = useState<'explore' | 'guided' | 'self' | 'reallife' | 'summary'>('explore');

  // Interactive exploration state
  const [exploreUnderstood, setExploreUnderstood] = useState(false);
  const [selectedInteractiveChoice, setSelectedInteractiveChoice] = useState<number | null>(null);
  const [interactiveChecked, setInteractiveChecked] = useState(false);

  // Exercise tracking
  const [guidedIndex, setGuidedIndex] = useState(0);
  const [selfIndex, setSelfIndex] = useState(0);

  // Lesson completion state
  const isLessonCompleted = progress.completedLessonIds.includes(lesson.id);

  const handleExerciseResult = (isCorrectFirstTry: boolean, questionId: string) => {
    let newStars = progress.totalStars;
    if (isCorrectFirstTry) {
      newStars += 1;
    }

    const updated: UserProgress = {
      ...progress,
      totalStars: newStars,
      answeredQuestionsCount: progress.answeredQuestionsCount + 1,
      firstTryCorrectCount: isCorrectFirstTry
        ? progress.firstTryCorrectCount + 1
        : progress.firstTryCorrectCount,
      neededHintCount: !isCorrectFirstTry
        ? progress.neededHintCount + 1
        : progress.neededHintCount,
      lastStudiedDate: new Date().toISOString().split('T')[0],
    };

    onSaveProgress(updated);
  };

  const handleFinishLesson = () => {
    sounds.playFanfare();
    const completedSet = new Set(progress.completedLessonIds);
    completedSet.add(lesson.id);

    const updated: UserProgress = {
      ...progress,
      totalStars: progress.totalStars + 5, // 5 bonus stars for completing the lesson!
      completedLessonIds: Array.from(completedSet),
      currentLessonId: Math.min(36, lesson.id + 1),
    };

    onSaveProgress(updated);
    setActiveTab('summary');
  };

  // Render proper dynamic visual based on lesson explore type
  const renderVisualExplorer = () => {
    switch (lesson.explore.visualType) {
      case 'bundles':
        return (
          <BundlesVisualizer
            tens={lesson.explore.visualData?.tens || 3}
            units={lesson.explore.visualData?.units || 4}
            label={lesson.explore.title}
          />
        );
      case 'number-line':
        return (
          <NumberLineVisualizer
            min={0}
            max={10}
            highlightNumber={lesson.explore.visualData?.highlight || 4}
          />
        );
      case 'split-combine':
        return (
          <SplitCombineVisualizer
            num1={lesson.explore.visualData?.num1 || 9}
            num2={lesson.explore.visualData?.num2 || 5}
            label={lesson.explore.title}
          />
        );
      case 'scale-balance':
        return (
          <ScaleBalanceVisualizer
            initialLeft={lesson.explore.visualData?.leftWeight || 3}
            initialRight={lesson.explore.visualData?.rightWeight || 3}
            leftItemName={lesson.explore.visualData?.leftLabel || 'Vật cân'}
          />
        );
      case 'clock':
        return (
          <ClockVisualizer
            initialHour={lesson.explore.visualData?.hour || 7}
            initialMinute={lesson.explore.visualData?.minute || 15}
            label={lesson.explore.title}
          />
        );
      case 'geometric':
        return <GeometryVisualizer />;
      default:
        return (
          <div className="bg-amber-50 p-6 rounded-2xl border-2 border-amber-200 text-center">
            <span className="text-4xl block mb-2">🍎 🍌 🥕</span>
            <p className="text-sm font-bold text-amber-900">{lesson.explore.description}</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Bar với nút Quay lại, Tiêu đề bài và SGK Trang */}
      <div className="bg-white p-5 rounded-3xl border-3 border-amber-200 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition cursor-pointer"
            title="Quay lại danh sách bài học"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                Bài {lesson.id} / 36
              </span>
              <span className="text-xs font-bold text-slate-500">
                SGK Toán 2 - Tập 1 (Trang {lesson.pageNumber})
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800 mt-1">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Nút hỏi Robo Toán nhanh */}
        <button
          onClick={() => {
            sounds.playPop();
            if (onOpenRoboChat) onOpenRoboChat();
          }}
          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-sm hover:scale-105 transition cursor-pointer flex items-center gap-2"
        >
          <span>🤖 Hỏi Robo Toán</span>
        </button>
      </div>

      {/* THANH ĐIỀU HƯỚNG 4 KHU VỰC CHÍNH CỦA BÀI HỌC */}
      <div className="bg-white p-1.5 rounded-2xl border-2 border-slate-200 flex overflow-x-auto gap-1 no-scrollbar shadow-xs">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('explore');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'explore'
              ? 'bg-amber-400 text-amber-950 shadow-xs'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kiến thức</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('guided');
          }}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'guided'
              ? 'bg-amber-400 text-amber-950 shadow-xs'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Luyện tập ({lesson.guidedExercises.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('self');
          }}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'self'
              ? 'bg-amber-400 text-amber-950 shadow-xs'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tự luyện ({lesson.selfPracticeExercises.length})</span>
        </button>

        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('reallife');
          }}
          className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'reallife'
              ? 'bg-amber-400 text-amber-950 shadow-xs'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Vận dụng & Tổng kết</span>
        </button>
      </div>

      {/* ===================== TAB 1: KHÁM PHÁ & KIẾN THỨC CẦN NHỚ ===================== */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Mục tiêu học tập */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-2 border-sky-200 rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-black uppercase text-sky-900 tracking-wider">
                Mục tiêu bài học em cần đạt:
              </h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-bold text-slate-700">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-sky-100">
                  <span className="text-emerald-500 font-black text-base shrink-0">✓</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vùng Mô hình Khám phá trực quan */}
          <div>{renderVisualExplorer()}</div>

          {/* Câu hỏi nhỏ để học sinh tự khám phá */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">❓</span>
              <h4 className="text-base font-black text-slate-800">
                Thử thách nhỏ: {lesson.explore.interactivePrompt.question}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.explore.interactivePrompt.options.map((opt, idx) => {
                const isSelected = selectedInteractiveChoice === idx;
                const isCorrect = idx === lesson.explore.interactivePrompt.correctIndex;
                let btnStyle = 'bg-slate-50 hover:bg-amber-50 border-2 border-slate-200 text-slate-800';

                if (interactiveChecked) {
                  if (isCorrect) btnStyle = 'bg-emerald-100 text-emerald-950 border-3 border-emerald-500 font-black';
                  else if (isSelected && !isCorrect) btnStyle = 'bg-rose-100 text-rose-900 border-2 border-rose-300 opacity-60';
                } else if (isSelected) {
                  btnStyle = 'bg-amber-100 text-amber-950 border-3 border-amber-500 font-black';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      setSelectedInteractiveChoice(idx);
                      setInteractiveChecked(false);
                    }}
                    className={`p-3.5 rounded-xl text-left font-bold text-sm transition cursor-pointer ${btnStyle}`}
                  >
                    {String.fromCharCode(65 + idx)}. {opt}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              {!interactiveChecked ? (
                <button
                  type="button"
                  disabled={selectedInteractiveChoice === null}
                  onClick={() => {
                    sounds.playPop();
                    setInteractiveChecked(true);
                    if (selectedInteractiveChoice === lesson.explore.interactivePrompt.correctIndex) {
                      sounds.playCorrect();
                    } else {
                      sounds.playWrong();
                    }
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-black text-sm rounded-xl shadow-xs transition cursor-pointer"
                >
                  Kiểm tra câu trả lời
                </button>
              ) : (
                <div className="w-full p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                  {selectedInteractiveChoice === lesson.explore.interactivePrompt.correctIndex
                    ? '🎉 Giỏi lắm! '
                    : '💡 Gợi ý của Robo: '}
                  {lesson.explore.interactivePrompt.explanation}
                </div>
              )}
            </div>
          </div>

          {/* Thẻ Kiến thức cần nhớ */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-6 border-3 border-amber-300 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <h3 className="text-lg font-black text-amber-950">
                Thẻ Kiến Thức Cần Nhớ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="text-xs font-extrabold uppercase text-amber-800">Quy tắc vàng:</div>
                <ul className="list-disc pl-4 text-xs font-bold text-slate-700 space-y-1">
                  {lesson.summaryCard.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-2">
                <div className="text-xs font-extrabold uppercase text-amber-800">Ví dụ mẫu:</div>
                <div className="text-sm font-black text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-mono">
                  {lesson.summaryCard.sampleExample}
                </div>
                <div className="text-xs font-bold text-slate-600">
                  <span className="text-rose-600 font-black">Lỗi hay gặp:</span>{' '}
                  {lesson.summaryCard.commonMistakes}
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-amber-300 flex items-center gap-2 text-xs font-black text-amber-900">
              <span className="text-lg">💡 Mẹo nhớ nhanh:</span>
              <span>{lesson.summaryCard.memoryTip}</span>
            </div>

            {/* Nút Em đã hiểu hoặc Học lại ví dụ */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playStar();
                  setExploreUnderstood(true);
                  setActiveTab('guided');
                }}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>Em đã hiểu – Sang Luyện tập!</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  setExploreUnderstood(false);
                  setInteractiveChecked(false);
                  setSelectedInteractiveChoice(null);
                }}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Học lại ví dụ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: LUYỆN TẬP CÓ HƯỚNG DẪN (5 BƯỚC SƯ PHẠM) ===================== */}
      {activeTab === 'guided' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-amber-50 px-4 py-3 rounded-2xl border border-amber-200">
            <div>
              <span className="text-xs font-black uppercase text-amber-800">
                Phần 1: Luyện tập có hướng dẫn
              </span>
              <p className="text-xs font-bold text-slate-600">
                Làm từng câu một. Nếu chưa đúng sẽ có gợi ý, không lo bị trừ điểm đâu nhé!
              </p>
            </div>
            <div className="text-xs font-black text-amber-900 bg-white px-3 py-1 rounded-full border border-amber-300">
              Câu {guidedIndex + 1} / {lesson.guidedExercises.length}
            </div>
          </div>

          {lesson.guidedExercises.length > 0 && (
            <ExerciseCard
              key={lesson.guidedExercises[guidedIndex].id}
              question={lesson.guidedExercises[guidedIndex]}
              onAnswerResult={handleExerciseResult}
              isLast={guidedIndex === lesson.guidedExercises.length - 1}
              onNextQuestion={() => {
                if (guidedIndex < lesson.guidedExercises.length - 1) {
                  setGuidedIndex(guidedIndex + 1);
                } else {
                  setActiveTab('self');
                }
              }}
            />
          )}

          {/* Bộ chọn câu hỏi nhanh */}
          <div className="flex flex-wrap gap-2 pt-2 justify-center">
            {lesson.guidedExercises.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  sounds.playPop();
                  setGuidedIndex(i);
                }}
                className={`w-9 h-9 rounded-xl font-black text-xs transition cursor-pointer ${
                  guidedIndex === i
                    ? 'bg-amber-500 text-white shadow-md scale-110'
                    : 'bg-white hover:bg-amber-100 text-slate-700 border border-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 3: TỰ LUYỆN (PHÂN HÓA 4 MỨC ĐỘ) ===================== */}
      {activeTab === 'self' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-sky-50 px-4 py-3 rounded-2xl border border-sky-200">
            <div>
              <span className="text-xs font-black uppercase text-sky-800">
                Phần 2: Tự luyện tập
              </span>
              <p className="text-xs font-bold text-slate-600">
                Bộ câu hỏi mới để em củng cố và nâng cao tư duy toán học!
              </p>
            </div>
            <div className="text-xs font-black text-sky-900 bg-white px-3 py-1 rounded-full border border-sky-300">
              Câu {selfIndex + 1} / {lesson.selfPracticeExercises.length}
            </div>
          </div>

          {lesson.selfPracticeExercises.length > 0 ? (
            <ExerciseCard
              key={lesson.selfPracticeExercises[selfIndex].id}
              question={lesson.selfPracticeExercises[selfIndex]}
              onAnswerResult={handleExerciseResult}
              isLast={selfIndex === lesson.selfPracticeExercises.length - 1}
              onNextQuestion={() => {
                if (selfIndex < lesson.selfPracticeExercises.length - 1) {
                  setSelfIndex(selfIndex + 1);
                } else {
                  setActiveTab('reallife');
                }
              }}
            />
          ) : (
            <div className="bg-white p-6 rounded-2xl text-center text-sm font-bold text-slate-500">
              Chưa có câu hỏi tự luyện cho bài này. Em hãy chuyển sang phần Vận dụng nhé!
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2 justify-center">
            {lesson.selfPracticeExercises.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  sounds.playPop();
                  setSelfIndex(i);
                }}
                className={`w-9 h-9 rounded-xl font-black text-xs transition cursor-pointer ${
                  selfIndex === i
                    ? 'bg-sky-500 text-white shadow-md scale-110'
                    : 'bg-white hover:bg-sky-100 text-slate-700 border border-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===================== TAB 4: VẬN DỤNG THỰC TẾ & TỔNG KẾT ===================== */}
      {(activeTab === 'reallife' || activeTab === 'summary') && (
        <div className="space-y-6">
          {/* Tình huống thực tế */}
          <div className="bg-white rounded-3xl p-6 border-3 border-amber-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h3 className="text-lg font-black text-slate-800">
                Toán học quanh em: Tình huống thực tế
              </h3>
            </div>

            {lesson.realLifeApplications.map((app) => (
              <div key={app.id} className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                <div className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                  {app.title}
                </div>
                <p className="text-sm font-bold text-slate-700">{app.scenario}</p>
                <div className="p-3 bg-white rounded-xl border border-emerald-100 text-sm font-black text-emerald-950">
                  ❓ Câu hỏi: {app.question}
                </div>
                <div className="text-xs font-bold text-slate-600 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                  <div className="font-extrabold text-emerald-800 mb-1">Cách suy nghĩ và lời giải:</div>
                  {app.solutionSteps.map((step, idx) => (
                    <div key={idx}>• {step}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Phần Tổng kết bài học */}
          <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👑</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">
                  Tổng kết bài: Em đã học được gì?
                </h3>
                <p className="text-xs sm:text-sm font-bold text-amber-100">
                  Những kỹ năng em đã làm chủ trong bài {lesson.title}
                </p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 space-y-2">
              {lesson.summaryPoints.map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-black text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Các nút hành động cuối bài */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              {!isLessonCompleted ? (
                <button
                  type="button"
                  onClick={handleFinishLesson}
                  className="px-6 py-3 bg-white hover:bg-amber-100 text-amber-950 font-black text-base rounded-2xl shadow-lg transition cursor-pointer flex items-center gap-2"
                >
                  <Award className="w-5 h-5 text-amber-600" />
                  <span>Nhận 5 ⭐ và hoàn thành bài!</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm font-black text-white bg-emerald-600/80 px-4 py-2 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Em đã hoàn thành bài học này!</span>
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    setActiveTab('guided');
                    setGuidedIndex(0);
                  }}
                  className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl border border-white/40 transition cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Ôn tập bài này
                </button>

                {lesson.id < 36 && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playPop();
                      onNextLesson(lesson.id + 1);
                    }}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Sang Bài {lesson.id + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
