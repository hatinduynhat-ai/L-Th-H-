import React, { useState } from 'react';
import {
  Gamepad2,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  ShoppingCart,
  Timer,
  Compass,
  Shapes,
  FlaskConical,
  Trees,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface Props {
  onAddStars: (stars: number) => void;
  onBack: () => void;
}

export const GamesCenter: React.FC<Props> = ({ onAddStars, onBack }) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  // Mini-Game 1: Siêu thị Toán học
  const [marketCart, setMarketCart] = useState<{ id: string; name: string; price: number; icon: string }[]>([]);
  const marketItems = [
    { id: '1', name: 'Quả dưa hấu', price: 25, icon: '🍉' },
    { id: '2', name: 'Hộp sữa tươi', price: 10, icon: '🥛' },
    { id: '3', name: 'Gói bánh quy', price: 15, icon: '🍪' },
    { id: '4', name: 'Bút chì màu', price: 5, icon: '✏️' },
    { id: '5', name: 'Vở ô ly', price: 8, icon: '📓' },
    { id: '6', name: 'Quả cam vàng', price: 7, icon: '🍊' },
  ];
  const cartTotal = marketCart.reduce((sum, item) => sum + item.price, 0);

  // Mini-Game 2: Đường đua phép tính (Racing)
  const [raceStep, setRaceStep] = useState(0);
  const raceQuestions = [
    { q: '9 + 6 = ?', a: 15, options: [14, 15, 16] },
    { q: '14 - 8 = ?', a: 6, options: [5, 6, 7] },
    { q: '8 + 7 = ?', a: 15, options: [15, 16, 17] },
    { q: '18 - 9 = ?', a: 9, options: [8, 9, 10] },
    { q: '25 + 30 = ?', a: 55, options: [45, 55, 65] },
  ];
  const [raceFeedback, setRaceFeedback] = useState<string | null>(null);

  // Mini-Game 4: Ghép đôi thần tốc (Memory match)
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<{ id: string; pairId: string; text: string }[]>([]);
  const matchCards = [
    { id: 'c1', pairId: 'p1', text: '8 + 5' },
    { id: 'c2', pairId: 'p1', text: '13' },
    { id: 'c3', pairId: 'p2', text: '12 - 7' },
    { id: 'c4', pairId: 'p2', text: '5' },
    { id: 'c5', pairId: 'p3', text: '9 + 7' },
    { id: 'c6', pairId: 'p3', text: '16' },
    { id: 'c7', pairId: 'p4', text: '15 - 6' },
    { id: 'c8', pairId: 'p4', text: '9' },
  ];

  // Mini-Game 5: Vườn cây con số (Plant growth)
  const [treeStage, setTreeStage] = useState(0); // 0 to 4
  const treeProblems = [
    { q: 'Tưới hạt mầm: 7 + 4 = ?', a: 11, options: [10, 11, 12] },
    { q: 'Cây nảy chồi: 13 - 5 = ?', a: 8, options: [7, 8, 9] },
    { q: 'Cây đơm hoa: 8 + 8 = ?', a: 16, options: [15, 16, 17] },
    { q: 'Cây kết trái ngọt: 17 - 9 = ?', a: 8, options: [8, 9, 10] },
  ];

  // Mini-Game 6: Xây thành phố hình học
  const [cityScore, setCityScore] = useState(0);
  const [cityQuestionIdx, setCityQuestionIdx] = useState(0);
  const cityQuestions = [
    { q: 'Hình nào có 4 cạnh?', options: ['Hình tam giác', 'Hình tứ giác', 'Hình tròn'], a: 1 },
    { q: 'Đường thẳng không bị giới hạn ở đâu?', options: ['Ở cả hai phía', 'Ở một đầu', 'Ở điểm giữa'], a: 0 },
    { q: 'Đoạn thẳng AB có mấy điểm mút?', options: ['1 điểm', '2 điểm', '3 điểm'], a: 1 },
    { q: 'Ba điểm cùng nằm trên một đường thẳng gọi là gì?', options: ['Ba điểm vuông góc', 'Ba điểm thẳng hàng', 'Ba điểm tam giác'], a: 1 },
  ];

  // Mini-Game 7: Đồng hồ vui nhộn
  const [clockScore, setClockScore] = useState(0);
  const [clockIdx, setClockIdx] = useState(0);
  const clockQuizzes = [
    { q: 'Nam đi ngủ lúc 9 giờ 30 phút tối. Đồng hồ điện tử chỉ mấy giờ?', options: ['21:30', '09:30', '19:30'], a: 0 },
    { q: 'Một ngày có bao nhiêu giờ?', options: ['12 giờ', '24 giờ', '60 giờ'], a: 1 },
    { q: 'Khi kim phút chỉ số 3 là hơn bao nhiêu phút?', options: ['15 phút', '30 phút', '5 phút'], a: 0 },
    { q: 'Khi kim phút chỉ số 6 là hơn bao nhiêu phút?', options: ['15 phút', '30 phút (rưỡi)', '45 phút'], a: 1 },
  ];

  // Mini-Game 8: Bé làm nhà khoa học (Kg & Lít)
  const [scienceScore, setScienceScore] = useState(0);
  const [scienceIdx, setScienceIdx] = useState(0);
  const scienceQuizzes = [
    { q: 'Con gà nặng 2 kg, con ngỗng nặng 5 kg. Cả hai con nặng bao nhiêu kg?', options: ['7 kg', '8 kg', '10 kg'], a: 0 },
    { q: 'Can có 10 l nước mắm, rót ra 4 l. Trong can còn lại bao nhiêu lít?', options: ['6 l', '7 l', '14 l'], a: 0 },
    { q: 'Đĩa cân thăng bằng: bên trái có túi gạo, bên phải có 2 quả cân 2 kg. Túi gạo nặng mấy kg?', options: ['2 kg', '4 kg', '6 kg'], a: 1 },
    { q: 'Rót đầy hai ca 1 lít thì được bao nhiêu lít nước?', options: ['1 lít', '2 lít', '3 lít'], a: 1 },
  ];

  const gamesList = [
    {
      id: 'market',
      title: '1. Siêu thị Toán học',
      description: 'Đi siêu thị mini, chọn món hàng yêu thích và tính hóa đơn!',
      icon: '🛒',
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'race',
      title: '2. Đường đua phép tính',
      description: 'Trả lời đúng các phép cộng trừ để xe đua phóng nhanh về đích!',
      icon: '🏎️',
      color: 'from-rose-500 to-red-600',
    },
    {
      id: 'match',
      title: '3. Ghép đôi thần tốc',
      description: 'Lật thẻ và ghép đôi phép tính với kết quả chính xác!',
      icon: '🃏',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      id: 'tree',
      title: '4. Vườn cây con số',
      description: 'Mỗi phép tính đúng là một giọt nước tưới cây lớn lên nở hoa kết trái!',
      icon: '🌳',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'city',
      title: '5. Xây thành phố hình học',
      description: 'Nhận biết điểm, đoạn thẳng, đường cong, tứ giác để xây cao ốc!',
      icon: '🏰',
      color: 'from-sky-500 to-blue-600',
    },
    {
      id: 'clock',
      title: '6. Đồng hồ vui nhộn',
      description: 'Đọc giờ, xoay kim và chọn thời gian đúng theo tình huống sinh hoạt.',
      icon: '⏰',
      color: 'from-yellow-400 to-amber-600',
    },
    {
      id: 'science',
      title: '7. Bé làm nhà khoa học',
      description: 'Cân đo đong đếm với Ki-lô-gam (kg) và Lít (l) cực kỳ thú vị!',
      icon: '🧪',
      color: 'from-teal-400 to-cyan-600',
    },
    {
      id: 'maze',
      title: '8. Robot tìm kho báu',
      description: 'Giải các bài toán số học mở các cánh cổng bí mật trong mê cung!',
      icon: '🗝️',
      color: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header Games Center */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border-3 border-amber-200 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              if (activeGameId) setActiveGameId(null);
              else onBack();
            }}
            className="w-10 h-10 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-black uppercase text-amber-700 tracking-wider">
              Học mà chơi – Chơi mà học
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              {activeGameId
                ? gamesList.find((g) => g.id === activeGameId)?.title
                : 'Thử Thách Toán Vui (8 Trò Chơi Giáo Dục)'}
            </h2>
          </div>
        </div>

        {activeGameId && (
          <button
            onClick={() => {
              sounds.playPop();
              setActiveGameId(null);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Chọn trò chơi khác
          </button>
        )}
      </div>

      {/* DANH SÁCH 8 TRÒ CHƠI KHI CHƯA CHỌN */}
      {!activeGameId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {gamesList.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                sounds.playPop();
                setActiveGameId(game.id);
              }}
              className="p-5 rounded-3xl bg-white hover:bg-amber-50/60 border-3 border-slate-200 hover:border-amber-400 transition-all cursor-pointer group shadow-sm hover:shadow-xl transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} text-white flex items-center justify-center text-3xl shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                  {game.icon}
                </div>
                <h3 className="font-black text-base text-slate-800 group-hover:text-amber-800 transition-colors">
                  {game.title}
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1 line-clamp-2">
                  {game.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-600">
                <span>Chơi ngay</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== GAME 1: SIÊU THỊ TOÁN HỌC ==================== */}
      {activeGameId === 'market' && (
        <div className="bg-white rounded-3xl p-6 border-3 border-amber-300 shadow-lg space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-200">
            <div>
              <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
                <span>🛒 Giỏ hàng của em</span>
                <span className="text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-extrabold">
                  {marketCart.length} món đồ
                </span>
              </h3>
              <p className="text-xs font-bold text-slate-600">
                Bấm vào các món đồ trên kệ để mua và tính tổng số tiền (nghìn đồng giả lập)!
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-500">Tổng hóa đơn:</span>
              <div className="text-2xl font-black text-rose-600 font-mono">
                {cartTotal} nghìn đồng
              </div>
            </div>
          </div>

          {/* Kệ hàng */}
          <div>
            <div className="text-sm font-black text-slate-700 mb-3">Kệ hàng hôm nay:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {marketItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playPop();
                    setMarketCart([...marketCart, item]);
                  }}
                  className="p-3 bg-slate-50 hover:bg-amber-100 rounded-2xl border-2 border-slate-200 hover:border-amber-400 text-center transition cursor-pointer group shadow-xs"
                >
                  <span className="text-4xl block group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className="text-xs font-black text-slate-800 block mt-1 truncate">
                    {item.name}
                  </span>
                  <span className="text-xs font-extrabold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200 inline-block mt-1">
                    {item.price}k
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Chi tiết giỏ hàng */}
          {marketCart.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-700">
                <span>Các món đã chọn:</span>
                <button
                  onClick={() => {
                    sounds.playPop();
                    setMarketCart([]);
                  }}
                  className="text-rose-600 hover:underline cursor-pointer"
                >
                  Xóa giỏ hàng
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {marketCart.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-xs"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    <span className="font-black text-amber-700">({item.price}k)</span>
                  </span>
                ))}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => {
                    sounds.playFanfare();
                    sounds.playStar();
                    onAddStars(2);
                    alert(`Tuyệt vời! Em đã thanh toán thành công hóa đơn ${cartTotal}k và nhận được 2 ⭐!`);
                    setMarketCart([]);
                  }}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl shadow-md cursor-pointer transition"
                >
                  💳 Thanh toán hóa đơn ({cartTotal}k) & Nhận 2 ⭐
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== GAME 2: ĐƯỜNG ĐUA PHÉP TÍNH ==================== */}
      {activeGameId === 'race' && (
        <div className="bg-white rounded-3xl p-6 border-3 border-rose-300 shadow-lg space-y-6">
          <div className="flex items-center justify-between bg-rose-50 p-4 rounded-2xl border border-rose-200">
            <div>
              <h3 className="text-lg font-black text-rose-950">🏎️ Đường Đua Phép Tính</h3>
              <p className="text-xs font-bold text-slate-600">
                Trả lời đúng để xe đua của bạn tiến lên vạch đích!
              </p>
            </div>
            <div className="text-sm font-black text-rose-700 bg-white px-3 py-1 rounded-xl border border-rose-300">
              Chặng {raceStep + 1} / {raceQuestions.length}
            </div>
          </div>

          {/* Đường đua với vạch kẻ và xe đua */}
          <div className="relative bg-slate-800 rounded-2xl p-4 overflow-hidden border-2 border-slate-900">
            {/* Vạch kẻ đường đứt đoạn */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b-2 border-dashed border-amber-300 pointer-events-none" />

            <div className="relative flex items-center justify-between py-6">
              {/* Vị trí xe */}
              <div
                className="absolute transition-all duration-500 text-4xl select-none"
                style={{
                  left: `${(raceStep / raceQuestions.length) * 85}%`,
                }}
              >
                🏎️
              </div>

              {/* Vạch đích */}
              <div className="ml-auto text-2xl" title="Vạch đích">
                🏁
              </div>
            </div>
          </div>

          {/* Câu hỏi đua xe */}
          {raceStep < raceQuestions.length ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
              <span className="text-xs font-black uppercase text-rose-700 tracking-wider">
                Câu hỏi chặng {raceStep + 1}
              </span>
              <h4 className="text-3xl font-black text-slate-800">
                {raceQuestions[raceStep].q}
              </h4>

              <div className="flex flex-wrap justify-center gap-3">
                {raceQuestions[raceStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (opt === raceQuestions[raceStep].a) {
                        sounds.playCorrect();
                        setRaceFeedback('Đúng rồi! Xe phóng vèo vèo! 🚀');
                        if (raceStep + 1 === raceQuestions.length) {
                          sounds.playFanfare();
                          onAddStars(3);
                        }
                        setRaceStep(raceStep + 1);
                      } else {
                        sounds.playWrong();
                        setRaceFeedback('Chưa đúng rồi! Em thử chọn lại nhé!');
                      }
                    }}
                    className="px-8 py-3 bg-white hover:bg-rose-50 text-slate-800 hover:text-rose-900 font-black text-xl rounded-2xl border-2 border-slate-300 hover:border-rose-400 shadow-sm cursor-pointer transition transform hover:scale-105"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {raceFeedback && (
                <div className="text-xs font-extrabold text-amber-700">{raceFeedback}</div>
              )}
            </div>
          ) : (
            <div className="p-8 bg-emerald-50 rounded-2xl border-2 border-emerald-300 text-center space-y-3">
              <span className="text-5xl block animate-bounce">🏆</span>
              <h4 className="text-2xl font-black text-emerald-900">
                Chúc mừng! Em đã về đích xuất sắc!
              </h4>
              <p className="text-sm font-bold text-emerald-700">
                Em nhận được <strong className="text-amber-600 font-black text-base">+3 ⭐</strong> vào bảng thành tích!
              </p>
              <button
                onClick={() => {
                  sounds.playPop();
                  setRaceStep(0);
                  setRaceFeedback(null);
                }}
                className="mt-3 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-xl cursor-pointer transition"
              >
                Chạy lại đường đua
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== GAME 3: GHÉP ĐÔI THẦN TỐC ==================== */}
      {activeGameId === 'match' && (
        <div className="bg-white rounded-3xl p-6 border-3 border-purple-300 shadow-lg space-y-6">
          <div className="flex items-center justify-between bg-purple-50 p-4 rounded-2xl border border-purple-200">
            <div>
              <h3 className="text-lg font-black text-purple-950">🃏 Ghép Đôi Thần Tốc</h3>
              <p className="text-xs font-bold text-slate-600">
                Tìm cặp thẻ có phép tính và kết quả bằng nhau!
              </p>
            </div>
            <div className="text-sm font-black text-purple-800 bg-white px-3 py-1 rounded-xl border border-purple-300">
              Đã ghép: {matchedPairs.length} / 4 cặp
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {matchCards.map((card) => {
              const isMatched = matchedPairs.includes(card.pairId);
              const isSelected = selectedCards.some((c) => c.id === card.id);

              return (
                <button
                  key={card.id}
                  disabled={isMatched}
                  onClick={() => {
                    sounds.playPop();
                    if (isSelected || selectedCards.length >= 2) return;

                    const newSelected = [...selectedCards, card];
                    setSelectedCards(newSelected);

                    if (newSelected.length === 2) {
                      if (newSelected[0].pairId === newSelected[1].pairId) {
                        sounds.playCorrect();
                        setMatchedPairs((prev) => [...prev, newSelected[0].pairId]);
                        setSelectedCards([]);
                        if (matchedPairs.length + 1 === 4) {
                          sounds.playFanfare();
                          onAddStars(3);
                        }
                      } else {
                        sounds.playWrong();
                        setTimeout(() => setSelectedCards([]), 900);
                      }
                    }
                  }}
                  className={`h-24 rounded-2xl font-black text-lg transition-all cursor-pointer flex items-center justify-center border-3 shadow-xs ${
                    isMatched
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-400 opacity-70 cursor-not-allowed'
                      : isSelected
                      ? 'bg-purple-500 text-white border-purple-700 scale-105 shadow-md'
                      : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-slate-300 hover:border-purple-300'
                  }`}
                >
                  {isMatched || isSelected ? card.text : '❓'}
                </button>
              );
            })}
          </div>

          {matchedPairs.length === 4 && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-center font-black text-emerald-900">
              🎉 Giỏi lắm! Em đã ghép đúng toàn bộ thẻ và nhận được 3 ⭐!
            </div>
          )}
        </div>
      )}

      {/* ==================== GAME 4: VƯỜN CÂY CON SỐ ==================== */}
      {activeGameId === 'tree' && (
        <div className="bg-white rounded-3xl p-6 border-3 border-emerald-300 shadow-lg space-y-6">
          <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
            <div>
              <h3 className="text-lg font-black text-emerald-950">🌳 Vườn Cây Con Số</h3>
              <p className="text-xs font-bold text-slate-600">
                Mỗi câu trả lời đúng sẽ giúp cây lớn lên và đơm hoa kết trái!
              </p>
            </div>
            <div className="text-sm font-black text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-300">
              Cấp độ {treeStage + 1} / 4
            </div>
          </div>

          {/* Cây hoạt hình lớn lên theo giai đoạn */}
          <div className="bg-gradient-to-b from-sky-100 to-emerald-100 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[180px] border-2 border-emerald-200">
            <span className="text-7xl sm:text-8xl select-none transition-all transform hover:scale-110">
              {treeStage === 0 && '🌱'}
              {treeStage === 1 && '🌿'}
              {treeStage === 2 && '🌸'}
              {treeStage >= 3 && '🍎🌳'}
            </span>
            <div className="text-xs font-black text-emerald-900 mt-2 bg-white/80 px-3 py-1 rounded-full border border-emerald-200">
              {treeStage === 0 && 'Giai đoạn 1: Hạt mầm nảy mầm'}
              {treeStage === 1 && 'Giai đoạn 2: Cây non xanh tươi'}
              {treeStage === 2 && 'Giai đoạn 3: Đơm hoa ngát hương'}
              {treeStage >= 3 && 'Giai đoạn 4: Quả ngọt sai trĩu cành!'}
            </div>
          </div>

          {treeStage < treeProblems.length ? (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <h4 className="text-xl font-black text-slate-800">
                {treeProblems[treeStage].q}
              </h4>
              <div className="flex justify-center gap-3">
                {treeProblems[treeStage].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (opt === treeProblems[treeStage].a) {
                        sounds.playCorrect();
                        sounds.playStar();
                        const next = treeStage + 1;
                        setTreeStage(next);
                        if (next === treeProblems.length) {
                          sounds.playFanfare();
                          onAddStars(3);
                        }
                      } else {
                        sounds.playWrong();
                      }
                    }}
                    className="px-6 py-2.5 bg-white hover:bg-emerald-100 text-slate-800 font-black rounded-xl border-2 border-slate-300 hover:border-emerald-400 text-base cursor-pointer shadow-xs transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-100 rounded-2xl text-center text-emerald-900 font-black">
              🌟 Vườn cây đã thu hoạch bội thu quả ngọt! Em nhận được +3 ⭐!
            </div>
          )}
        </div>
      )}

      {/* ==================== GAME 5: XÂY THÀNH PHỐ HÌNH HỌC ==================== */}
      {activeGameId === 'city' && (
        <div className="bg-white rounded-3xl p-6 border-3 border-sky-300 shadow-lg space-y-6">
          <div className="flex items-center justify-between bg-sky-50 p-4 rounded-2xl border border-sky-200">
            <div>
              <h3 className="text-lg font-black text-sky-950">🏰 Xây Thành Phố Hình Học</h3>
              <p className="text-xs font-bold text-slate-600">
                Nhận biết các hình khối để xây dựng những tòa lâu đài nguy nga!
              </p>
            </div>
            <div className="text-sm font-black text-sky-800 bg-white px-3 py-1 rounded-xl border border-sky-300">
              Câu {cityQuestionIdx + 1} / {cityQuestions.length}
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
            <h4 className="text-xl font-black text-slate-800">
              {cityQuestions[cityQuestionIdx].q}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cityQuestions[cityQuestionIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i === cityQuestions[cityQuestionIdx].a) {
                      sounds.playCorrect();
                      setCityScore(cityScore + 1);
                      if (cityQuestionIdx + 1 < cityQuestions.length) {
                        setCityQuestionIdx(cityQuestionIdx + 1);
                      } else {
                        sounds.playFanfare();
                        onAddStars(2);
                        alert('Em đã xây xong thành phố hình học tráng lệ!');
                      }
                    } else {
                      sounds.playWrong();
                    }
                  }}
                  className="p-3.5 bg-white hover:bg-sky-50 text-slate-800 font-bold rounded-xl border-2 border-slate-200 hover:border-sky-400 text-sm cursor-pointer shadow-xs transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== GAME 6: ĐỒNG HỒ VUI NHỘN ==================== */}
      {activeGameId === 'clock' && (
        <div className="bg-white rounded-3xl p-6 border-3 border-yellow-300 shadow-lg space-y-6">
          <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
            <div>
              <h3 className="text-lg font-black text-yellow-950">⏰ Đồng Hồ Vui Nhộn</h3>
              <p className="text-xs font-bold text-slate-600">
                Thử tài xem giờ và sắp xếp thời gian biểu hàng ngày!
              </p>
            </div>
            <div className="text-sm font-black text-yellow-800 bg-white px-3 py-1 rounded-xl border border-yellow-300">
              Câu {clockIdx + 1} / {clockQuizzes.length}
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
            <h4 className="text-xl font-black text-slate-800">
              {clockQuizzes[clockIdx].q}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {clockQuizzes[clockIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i === clockQuizzes[clockIdx].a) {
                      sounds.playCorrect();
                      setClockScore(clockScore + 1);
                      if (clockIdx + 1 < clockQuizzes.length) {
                        setClockIdx(clockIdx + 1);
                      } else {
                        sounds.playFanfare();
                        onAddStars(2);
                        alert('Chúc mừng! Em xem giờ rất chuẩn xác!');
                      }
                    } else {
                      sounds.playWrong();
                    }
                  }}
                  className="p-3.5 bg-white hover:bg-yellow-50 text-slate-800 font-bold rounded-xl border-2 border-slate-200 hover:border-yellow-400 text-sm cursor-pointer shadow-xs transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== GAME 7: BÉ LÀM NHÀ KHOA HỌC ==================== */}
      {activeGameId === 'science' && (
        <div className="bg-white rounded-3xl p-6 border-3 border-teal-300 shadow-lg space-y-6">
          <div className="flex items-center justify-between bg-teal-50 p-4 rounded-2xl border border-teal-200">
            <div>
              <h3 className="text-lg font-black text-teal-950">🧪 Bé Làm Nhà Khoa Học</h3>
              <p className="text-xs font-bold text-slate-600">
                Đo lường, cân nặng kg và đong nước lít trong phòng thí nghiệm nhí!
              </p>
            </div>
            <div className="text-sm font-black text-teal-800 bg-white px-3 py-1 rounded-xl border border-teal-300">
              Câu {scienceIdx + 1} / {scienceQuizzes.length}
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
            <h4 className="text-xl font-black text-slate-800">
              {scienceQuizzes[scienceIdx].q}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {scienceQuizzes[scienceIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i === scienceQuizzes[scienceIdx].a) {
                      sounds.playCorrect();
                      setScienceScore(scienceScore + 1);
                      if (scienceIdx + 1 < scienceQuizzes.length) {
                        setScienceIdx(scienceIdx + 1);
                      } else {
                        sounds.playFanfare();
                        onAddStars(2);
                        alert('Nhà khoa học nhí đã xuất sắc hoàn thành các phép đo lường!');
                      }
                    } else {
                      sounds.playWrong();
                    }
                  }}
                  className="p-3.5 bg-white hover:bg-teal-50 text-slate-800 font-bold rounded-xl border-2 border-slate-200 hover:border-teal-400 text-sm cursor-pointer shadow-xs transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== GAME 8: ROBOT TÌM KHO BÁU ==================== */}
      {activeGameId === 'maze' && (
        <div className="bg-white rounded-3xl p-6 border-3 border-rose-300 shadow-lg space-y-6 text-center">
          <div className="p-8 bg-rose-50 rounded-2xl border border-rose-200 space-y-4">
            <span className="text-6xl block select-none animate-bounce">🗝️🤖💎</span>
            <h3 className="text-2xl font-black text-rose-950">
              Robot Tìm Kho Báu: Vượt Mê Cung Số
            </h3>
            <p className="text-sm font-bold text-slate-700 max-w-lg mx-auto">
              Rô-bốt cần đi qua các phép tính đúng: 25 + 6 = 31, 40 - 12 = 28, 9 + 8 = 17 để mở chiếc rương vàng!
            </p>
            <button
              onClick={() => {
                sounds.playFanfare();
                onAddStars(3);
                alert('Rô-bốt đã tìm thấy rương kho báu! Em được thưởng +3 ⭐!');
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-base rounded-2xl shadow-lg hover:scale-105 transition cursor-pointer"
            >
              Mở Rương Kho Báu (+3 ⭐)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
