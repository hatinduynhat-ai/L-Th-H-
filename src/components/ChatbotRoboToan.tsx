import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minimize2, Maximize2, Trash2, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import { ChatMessage, Lesson, ExerciseQuestion } from '../types/math';
import { sounds } from '../utils/soundEffects';

interface Props {
  currentLesson?: Lesson;
  currentQuestion?: ExerciseQuestion | null;
  onOpenPracticeQuestion?: () => void;
}

export const ChatbotRoboToan: React.FC<Props> = ({
  currentLesson,
  currentQuestion,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: 'Tút tít! Xin chào bạn nhỏ! 👋 Robo Toán rất vui được đồng hành cùng em. Em đang học bài nào hay có câu hỏi gì cần Robo hướng dẫn không nào?',
      timestamp: Date.now(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isLoading) return;

    sounds.playPop();
    setErrorNotice(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: newHistory.slice(-8),
          contextLesson: currentLesson
            ? {
                title: currentLesson.title,
                summary: currentLesson.summaryCard.sampleExample,
              }
            : undefined,
          questionContext: currentQuestion
            ? {
                question: currentQuestion.question,
                hint1: currentQuestion.hintLevel1,
                hint2: currentQuestion.hintLevel2,
                steps: currentQuestion.explanationSteps,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Lỗi máy chủ (${response.status})`);
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Robo Toán đã sẵn sàng lắng nghe câu hỏi tiếp theo của em!',
        timestamp: Date.now(),
        isOffline: data.isOffline,
      };

      setMessages((prev) => [...prev, botMsg]);
      sounds.playStar();
    } catch (err: any) {
      console.error('Chatbot error:', err);
      setErrorNotice('Chưa thể kết nối tới Robo Toán trực tuyến. Em hãy kiểm tra mạng hoặc thử lại nhé!');
      // Add a friendly local response so the student is never stranded
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        text: 'Tút tít! Robo Toán đây rồi! Trong lúc chờ kết nối lại mạng, em hãy đọc kĩ đề bài, dùng que tính hoặc sơ đồ để tìm đáp án nhé. Em muốn Robo đưa ra ví dụ dễ hơn không?',
        timestamp: Date.now(),
        isOffline: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    sounds.playPop();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: 'Cuộc trò chuyện đã được làm mới! Em muốn hỏi Robo điều gì tiếp theo nào?',
        timestamp: Date.now(),
      },
    ]);
    setErrorNotice(null);
  };

  const quickPrompts = [
    'Vì sao con làm sai?',
    'Giải thích bài này bằng hình ảnh',
    'Cho con một ví dụ dễ hơn',
    'Hãy hướng dẫn con từng bước',
    'Cho con một câu tương tự để luyện tập',
  ];

  return (
    <>
      {/* Nút tròn nổi góc phải màn hình */}
      {!isOpen && (
        <button
          onClick={() => {
            sounds.playPop();
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-extrabold px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer border-3 border-amber-300 group"
          title="Nhấn để trò chuyện với Robo Toán"
        >
          <div className="relative">
            <span className="text-2xl group-hover:animate-bounce inline-block">🤖</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <span className="hidden sm:inline text-sm font-black drop-shadow-xs">Hỏi Robo Toán</span>
        </button>
      )}

      {/* Cửa sổ Chatbot Docked */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 shadow-2xl bg-white rounded-3xl border-3 border-sky-400 flex flex-col overflow-hidden ${
            isMinimized
              ? 'bottom-5 right-5 w-72 h-14'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] max-h-[85vh] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 p-3.5 text-white flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-xl border border-white/30">
                🤖
              </div>
              <div>
                <h3 className="font-black text-sm sm:text-base leading-tight flex items-center gap-1.5">
                  Robo Toán
                  <span className="text-[10px] bg-emerald-400/90 text-emerald-950 font-extrabold px-1.5 py-0.2 rounded-full">
                    Sẵn sàng
                  </span>
                </h3>
                <p className="text-[11px] text-sky-100 font-medium">Gia sư AI lớp 2 thân thiện</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition text-sky-100 hover:text-white cursor-pointer"
                title="Xóa nội dung trò chuyện"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsMinimized(!isMinimized);
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition text-sky-100 hover:text-white cursor-pointer"
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  sounds.playPop();
                  setIsOpen(false);
                }}
                className="p-1.5 hover:bg-white/20 rounded-lg transition text-sky-100 hover:text-white cursor-pointer"
                title="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Context banner nếu đang làm câu hỏi */}
              {currentLesson && (
                <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between shrink-0">
                  <span className="truncate">📚 {currentLesson.title}</span>
                  {currentQuestion && (
                    <span className="bg-amber-200/80 px-2 py-0.5 rounded text-[10px] shrink-0 font-extrabold">
                      Đang ở câu {currentQuestion.id}
                    </span>
                  )}
                </div>
              )}

              {/* Danh sách tin nhắn */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sm shrink-0 shadow-xs">
                        🤖
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm font-semibold shadow-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                      {msg.isOffline && (
                        <div className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1">
                          ⚡ Chế độ gia sư dự phòng
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold p-2 bg-white/80 rounded-xl border border-sky-100 w-fit">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-500" />
                    <span>Robo Toán đang suy nghĩ...</span>
                  </div>
                )}

                {errorNotice && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center justify-between">
                    <span>{errorNotice}</span>
                    <button
                      onClick={() => handleSendMessage()}
                      className="underline text-rose-800 font-black cursor-pointer ml-2"
                    >
                      Thử lại
                    </button>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Gợi ý câu hỏi nhanh (Quick Prompts) */}
              <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto shrink-0 flex gap-1.5 no-scrollbar">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-2.5 py-1 bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-800 text-xs font-extrabold rounded-full border border-sky-200 transition cursor-pointer disabled:opacity-50"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>

              {/* Form nhập tin nhắn */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hỏi Robo Toán bài này nhé..."
                    disabled={isLoading}
                    className="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 font-bold text-sm px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-sky-500 focus:outline-none transition disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white font-extrabold p-2.5 rounded-xl transition cursor-pointer disabled:cursor-not-allowed shadow-md hover:scale-105 active:scale-95"
                    title="Gửi câu hỏi"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
