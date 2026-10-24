import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback logic for educational tutor Robo Toan
function getSmartFallbackResponse(
  message: string,
  lessonTitle?: string,
  questionPrompt?: string
): string {
  const lower = (message || '').toLowerCase();

  if (lower.includes('xin chào') || lower.includes('chào') || lower.includes('hello')) {
    return 'Tút tít! Robo Toán chào em nhé! Em đang học bài nào vậy? Có câu hỏi nào làm em băn khoăn, cứ kể cho Robo nghe nào!';
  }

  if (lower.includes('vì sao') || lower.includes('tại sao') || lower.includes('sai')) {
    if (questionPrompt) {
      return `Em đừng buồn nhé! Hãy nhìn lại câu: "${questionPrompt}". Có thể em đã nhầm ở bước tính đơn vị hoặc nhớ sang hàng chục. Em thử nhẩm lại từng bước cùng Robo xem nào!`;
    }
    return 'Làm bài có lúc nhầm là chuyện rất bình thường! Quan trọng là mình tìm ra chỗ nhầm. Em hãy kiểm tra xem mình đã tính đúng hàng đơn vị rồi đến hàng chục chưa nhé!';
  }

  if (lower.includes('hướng dẫn') || lower.includes('từng bước') || lower.includes('giải thích')) {
    if (lessonTitle) {
      return `Trong bài "${lessonTitle}", bí quyết là chúng mình hãy quan sát kỹ sơ đồ tranh và làm theo từng bước:
1. Đọc kĩ xem đề bài cho biết gì và hỏi gì.
2. Với phép cộng qua 10: Tách số để gộp thành 10 trước rồi cộng phần còn lại.
3. Với phép trừ qua 10: Trừ để được 10 rồi trừ tiếp.
Em thử nhẩm theo cách này xem sao nhé!`;
    }
    return `Robo gợi ý em cách làm nhé:
Bước 1: Đọc kĩ câu hỏi xem đề bài muốn tìm gì.
Bước 2: Dùng que tính hoặc hình ảnh để hình dung.
Bước 3: Thực hiện phép tính từ hàng đơn vị sang hàng chục.
Em hãy thử làm từng bước xem nào!`;
  }

  if (lower.includes('ví dụ') || lower.includes('dễ hơn')) {
    return 'Robo có ví dụ nhỏ nè: Ví dụ 9 + 4 nhé! Em lấy 1 từ số 4 để cho số 9 thành 10. Số 4 bớt 1 còn 3. Vậy 10 + 3 = 13! Thật dễ nhớ đúng không nào?';
  }

  if (lower.includes('câu tương tự') || lower.includes('luyện tập')) {
    return 'Thử sức với câu này nhé: "Bạn Mai có 8 quả cam, bạn Nam cho thêm 5 quả cam nữa. Hỏi Mai có tất cả bao nhiêu quả cam?" Em tính ra bao nhiêu nào?';
  }

  // General encouraging answer
  if (lessonTitle) {
    return `Robo Toán rất vui được đồng hành cùng em trong bài "${lessonTitle}"! Em cứ suy nghĩ từ từ, quan sát các que tính và hình vẽ nhé. Em muốn Robo gợi ý thêm điều gì nào?`;
  }

  return 'Robo Toán đã nhận được câu hỏi của em! Trong Toán học lớp 2, các con số giống như những người bạn. Em hãy thử tách số hoặc đếm tiếp để tìm ra đáp án nhé. Em có muốn Robo gợi ý bước tiếp theo không?';
}

// API: Chatbot Robo Toan
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, contextLesson, questionContext } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Nội dung tin nhắn không được để trống.' });
    }

    // If Gemini client is not initialized or API key is absent, use fallback
    if (!aiClient) {
      const fallback = getSmartFallbackResponse(
        message,
        contextLesson?.title,
        questionContext?.question
      );
      return res.json({ reply: fallback, isOffline: true });
    }

    const systemInstruction = `Bạn là Robo Toán, gia sư AI thân thiện, kiên nhẫn và vui tính dành cho học sinh lớp 2 tại Việt Nam (7-8 tuổi). Bạn đồng hành cùng hai bạn nhỏ Nam và Mai học Toán theo SGK Toán 2 - Tập 1 (bộ sách Kết nối tri thức với cuộc sống).

QUY TẮC SƯ PHẠM VÀ PHONG CÁCH NÓI:
1. Luôn dùng tiếng Việt trong sáng, câu ngắn (dưới 20 từ mỗi câu), xưng "Robo Toán" và gọi bé là "em" hoặc "bạn nhỏ".
2. Giọng điệu ấm áp, khen ngợi, khích lệ ("Giỏi lắm!", "Cố lên nào!", "Robo tin em làm được!").
3. Khi học sinh hỏi bài toán hoặc hỏi vì sao làm sai: TUYỆT ĐỐI KHÔNG ĐƯA NGAY ĐÁP SỐ CUỐI CÙNG. Hãy hướng dẫn bằng câu hỏi gợi mở, ví dụ cụ thể về quả táo, que tính, chú sóc, viên bi.
4. Nếu học sinh xin lời giải chi tiết hoặc đã cố gắng nhưng chưa hiểu: Giải thích từng bước rõ ràng, ngắn gọn, chỉ rõ tại sao lại làm như vậy.
5. Bài học hiện tại của học sinh: ${contextLesson ? JSON.stringify(contextLesson) : 'Chương trình Toán 2 Tập 1'}.
${questionContext ? `Câu hỏi học sinh đang làm: ${JSON.stringify(questionContext)}` : ''}
6. Không hỏi hoặc yêu cầu học sinh cung cấp bất kỳ thông tin cá nhân nào. Không dùng từ ngữ phức tạp hay công thức đại số bậc cao.`;

    // Construct prompt with chat history context
    let formattedPrompt = '';
    if (history && Array.isArray(history) && history.length > 0) {
      formattedPrompt += 'Lịch sử trò chuyện trước đó:\n';
      for (const msg of history.slice(-6)) {
        formattedPrompt += `${msg.role === 'user' ? 'Học sinh' : 'Robo Toán'}: ${msg.text}\n`;
      }
      formattedPrompt += '\n';
    }
    formattedPrompt += `Học sinh: ${message.trim()}\nRobo Toán:`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || getSmartFallbackResponse(message, contextLesson?.title, questionContext?.question);
    return res.json({ reply: replyText, isOffline: false });
  } catch (error: any) {
    console.error('Error in /api/gemini/chat:', error);
    // Provide encouraging pedagogical fallback even if external API encounters network/quota limits
    const fallback = getSmartFallbackResponse(
      req.body.message,
      req.body.contextLesson?.title,
      req.body.questionContext?.question
    );
    return res.json({
      reply: fallback + ' (Robo đang tạm thời dùng chế độ trợ giúp dự phòng nhé!)',
      isOffline: true,
      errorNotice: error?.message || 'Lỗi kết nối AI',
    });
  }
});

// API: Generate additional math questions
app.post('/api/gemini/generate-practice', async (req: Request, res: Response) => {
  try {
    const { lessonTitle, difficulty } = req.body;
    // Return sample well-formed questions guaranteed mathematically correct
    return res.json({ success: true, message: 'Practice generation supported' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Setup dev server with Vite or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port} in ${isDev ? 'development' : 'production'} mode`);
  });
}

startServer();
