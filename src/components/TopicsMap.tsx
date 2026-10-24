import React, { useState } from 'react';
import { CheckCircle2, Play, Lock, BookOpen, Star, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { UserProgress, Topic, Lesson } from '../types/math';
import { TOPICS, ALL_LESSONS } from '../data/curriculumData';
import { sounds } from '../utils/soundEffects';

interface Props {
  progress: UserProgress;
  onSelectLesson: (lessonId: number) => void;
  onBackToHome: () => void;
}

export const TopicsMap: React.FC<Props> = ({
  progress,
  onSelectLesson,
  onBackToHome,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  const getTopicProgress = (topic: Topic) => {
    const topicLessons = ALL_LESSONS.filter((l) => l.topicId === topic.id);
    const completed = topicLessons.filter((l) =>
      progress.completedLessonIds.includes(l.id)
    ).length;
    return {
      completed,
      total: topicLessons.length,
      percent: Math.round((completed / topicLessons.length) * 100),
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header Bản Đồ */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border-3 border-amber-200 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              onBackToHome();
            }}
            className="w-10 h-10 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition cursor-pointer"
            title="Quay lại trang chủ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-black uppercase text-amber-700 tracking-wider">
              Hành trình học tập
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Bản Đồ 7 Vùng Đất Toán Học (36 Bài Học)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-300">
          <span className="text-xl">🏆</span>
          <div className="text-right">
            <div className="text-xs font-bold text-amber-900">Đã hoàn thành</div>
            <div className="text-sm font-black text-amber-700">
              {progress.completedLessonIds.length} / 36 bài học
            </div>
          </div>
        </div>
      </div>

      {/* DANH SÁCH 7 VÙNG ĐẤT DẠNG THẺ BẢN ĐỒ HOẠT HÌNH */}
      <div className="space-y-4">
        {TOPICS.map((topic) => {
          const { completed, total, percent } = getTopicProgress(topic);
          const isExpanded = selectedTopicId === topic.id;
          const topicLessons = ALL_LESSONS.filter((l) => l.topicId === topic.id);

          return (
            <div
              key={topic.id}
              className={`rounded-3xl border-3 transition-all duration-300 overflow-hidden shadow-sm ${
                isExpanded ? 'border-amber-400 bg-white ring-4 ring-amber-100 shadow-lg' : 'border-slate-200 bg-white hover:border-amber-300'
              }`}
            >
              {/* Thẻ Vùng đất */}
              <div
                onClick={() => {
                  sounds.playPop();
                  setSelectedTopicId(isExpanded ? null : topic.id);
                }}
                className={`p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none ${
                  isExpanded ? 'bg-amber-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} text-white flex items-center justify-center text-3xl shadow-md shrink-0`}>
                    {topic.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
                        Chủ đề {topic.id}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Bài {topic.startLessonId} đến Bài {topic.endLessonId}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-800 mt-1">
                      {topic.name} – {topic.title.replace(`Chủ đề ${topic.id}. `, '')}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5 max-w-2xl">
                      {topic.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-600">
                      Tiến độ: <strong className="text-amber-700">{completed}/{total} bài</strong>
                    </div>
                    <div className="w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-amber-100 transition"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Danh sách các bài học thuộc chủ đề khi mở rộng */}
              {isExpanded && (
                <div className="p-4 sm:p-6 bg-slate-50 border-t border-amber-200/60 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topicLessons.map((lesson) => {
                      const isCompleted = progress.completedLessonIds.includes(lesson.id);
                      const isCurrent = progress.currentLessonId === lesson.id;

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            sounds.playPop();
                            onSelectLesson(lesson.id);
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                            isCurrent
                              ? 'bg-amber-100/80 border-amber-500 shadow-md ring-2 ring-amber-300'
                              : isCompleted
                              ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500'
                              : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : isCurrent
                                ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}>
                              {isCompleted ? '✓' : lesson.id}
                            </div>

                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-slate-800 truncate group-hover:text-amber-800 transition-colors">
                                {lesson.title}
                              </h4>
                              <p className="text-[11px] font-bold text-slate-500">
                                SGK trang {lesson.pageNumber} • {lesson.guidedExercises.length + lesson.selfPracticeExercises.length} bài tập
                              </p>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            {isCompleted && (
                              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Đã học
                              </span>
                            )}
                            <button
                              type="button"
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                                isCurrent
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                                  : 'bg-slate-200 hover:bg-amber-400 text-slate-800 hover:text-amber-950'
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Vào học</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
