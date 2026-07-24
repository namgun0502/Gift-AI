import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for gift recommendation and card letter generation
app.post("/api/recommend", async (req, res) => {
  try {
    const {
      relationship,
      ageGender,
      personalityInterests,
      occasion,
      budget,
      senderName,
      recipientName,
    } = req.body;

    if (!relationship || !ageGender || !personalityInterests || !occasion) {
      return res.status(400).json({
        error: "관계, 나이/성별, 성향/관심사, 기념일 정보는 필수 입력 항목입니다.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY가 설정되지 않았습니다. AI Studio Secrets 설정을 확인해주세요.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `
[받는 사람 정보 및 상황]
1. 받는 사람과의 관계: ${relationship}
2. 나이 및 성별: ${ageGender}
3. 성향 및 취향/관심사: ${personalityInterests}
4. 기념일/상황: ${occasion}
${budget ? `5. 희망 예산대: ${budget}` : ''}
${senderName ? `6. 보내는 사람 이름/호칭: ${senderName}` : ''}
${recipientName ? `7. 받는 사람 이름/호칭: ${recipientName}` : ''}

위 정보를 바탕으로 받는 사람에게 딱 맞는 선물 3가지와 모바일 카드에 적을 편지 문구 3가지를 추천해 주세요.

[선물 추천 작성 규칙]
반드시 정확히 3가지 선물 아이템을 추천해야 합니다:
1번 옵션: 실용적이고 안정적인 선택 (Practical/Safe option)
2번 옵션: 유니크하고 기발한 아이템 (Unique/Creative option)
3번 옵션: 특별한 경험 또는 감성형 선물 (Experience/Emotional option)

각 선물마다:
- title: 선물 이름
- category: 선물 카테고리 (예: 가전/패션/경험/디저트/리빙/뷰티 등)
- priceRange: 예상 가격대 (예: 5만원~10만원 대)
- reason: 받는 사람의 성향과 기념일에 맞춘 구체적이고 기발하며 명확한 추천 이유
- tip: 선물할 때 센스 있게 전달하는 꿀팁 (포장, 함께 전할 말, 센스 있는 디테일)

[모바일 카드 편지 문구 작성 규칙]
3가지 스타일의 모바일 카드 메시지 작성:
1. emotional: 감성적이고 감동적인 스타일의 모바일 카드 문구 (공백 포함 150-250자)
2. witty: 위트 있고 센스 넘치는 재치 있는 스타일의 문구 (공백 포함 150-250자)
3. formal: 정중하고 격식 있는 고마움을 전하는 문구 (공백 포함 150-250자)

- 카드 문구는 한국어로 작성하고, 줄바꿈(\\n)을 적절히 써서 모바일 화면에서 읽기 좋은 카드 형태로 작성하세요.
- 보내는 사람(${senderName || '보내는 이'})과 받는 사람(${recipientName || '받는 이'})의 관계와 호칭이 자연스럽게 녹아들도록 작성하세요.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "당신은 대한민국 최고의 선물 큐레이터이자 감성 카피라이터입니다. 받는 사람의 성향과 상황을 완벽히 분석하여 감동과 센스가 넘치는 선물 및 모바일 카드 문구를 추천합니다.",
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            giftRecommendations: {
              type: Type.ARRAY,
              description: "정확히 3가지의 차별화된 선물 추천 목록",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "선물 이름" },
                  category: {
                    type: Type.STRING,
                    description: "선물 카테고리 (예: 가전/패션/경험/디저트)",
                  },
                  priceRange: {
                    type: Type.STRING,
                    description: "예상 가격대 (예: 5만원~10만원 대)",
                  },
                  reason: {
                    type: Type.STRING,
                    description:
                      "이 선물을 추천하는 구체적이고 기발한 이유 (받는 사람의 성향 및 기념일 맞춤)",
                  },
                  tip: {
                    type: Type.STRING,
                    description: "선물할 때 센스 있게 전달하는 꿀팁",
                  },
                },
                required: ["title", "category", "priceRange", "reason", "tip"],
              },
            },
            cardLetters: {
              type: Type.OBJECT,
              properties: {
                emotional: {
                  type: Type.STRING,
                  description:
                    "감성적이고 감동적인 스타일의 모바일 카드 문구 (공백 포함 150-250자)",
                },
                witty: {
                  type: Type.STRING,
                  description:
                    "위트 있고 센스 넘치는 재치 있는 스타일의 문구 (공백 포함 150-250자)",
                },
                formal: {
                  type: Type.STRING,
                  description:
                    "정중하고 격식 있는 고마움을 전하는 문구 (공백 포함 150-250자)",
                },
              },
              required: ["emotional", "witty", "formal"],
            },
          },
          required: ["giftRecommendations", "cardLetters"],
        },
      },
    });

    if (!response.text) {
      throw new Error("Gemini 응답 생성이 올바르지 않습니다.");
    }

    const data = JSON.parse(response.text);
    return res.json(data);
  } catch (error: any) {
    console.error("API error in /api/recommend:", error);
    return res.status(500).json({
      error: error.message || "선물 추천 생성 중 오류가 발생했습니다.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
