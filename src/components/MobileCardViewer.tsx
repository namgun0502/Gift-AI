import React, { useState, useRef } from "react";
import {
  Heart,
  Smile,
  Award,
  Copy,
  Check,
  Download,
  Bookmark,
  Edit3,
  Sparkles,
  Palette,
  Type,
  Maximize2,
  Gift,
} from "lucide-react";
import { CardLetters } from "../types";

interface MobileCardViewerProps {
  cardLetters: CardLetters;
  senderName?: string;
  recipientName?: string;
  occasion?: string;
  selectedGiftTitle?: string;
  onSaveCardHistory?: (
    selectedType: "emotional" | "witty" | "formal",
    theme: string,
    customText: string
  ) => void;
}

export const CARD_THEMES = [
  {
    id: "editorial_cream",
    name: "📜 클래식 크림",
    bg: "bg-[#F9F7F2]",
    border: "border-black/20",
    text: "text-[#1A1A1A]",
    accent: "text-black/80 bg-black/5 border border-black/10",
    canvasBg: ["#F9F7F2", "#F3EFE6", "#EBE7DC"],
    textColor: "#1A1A1A",
  },
  {
    id: "editorial_dark",
    name: "🌌 밤하늘 차콜",
    bg: "bg-[#1A1A1A]",
    border: "border-amber-400/30",
    text: "text-white",
    accent: "text-amber-300 bg-amber-400/10 border border-amber-400/20",
    canvasBg: ["#1A1A1A", "#242424", "#121212"],
    textColor: "#FFFFFF",
  },
  {
    id: "romantic_rose",
    name: "🌸 블러시 로즈",
    bg: "bg-[#FAF3F3]",
    border: "border-rose-200",
    text: "text-rose-950",
    accent: "text-rose-800 bg-rose-100/60 border border-rose-200",
    canvasBg: ["#FAF3F3", "#F5E6E6", "#EED8D8"],
    textColor: "#4C0519",
  },
  {
    id: "sage_press",
    name: "🌿 세이지 그린",
    bg: "bg-[#F3F6F3]",
    border: "border-emerald-200",
    text: "text-emerald-950",
    accent: "text-emerald-800 bg-emerald-100/60 border border-emerald-200",
    canvasBg: ["#F3F6F3", "#E3EBE3", "#D2E0D2"],
    textColor: "#064E3B",
  },
  {
    id: "lavender_fog",
    name: "🍇 라벤더 포그",
    bg: "bg-[#F6F3F9]",
    border: "border-purple-200",
    text: "text-purple-950",
    accent: "text-purple-800 bg-purple-100/60 border border-purple-200",
    canvasBg: ["#F6F3F9", "#ECE4F3", "#E0D2EC"],
    textColor: "#3B0764",
  },
  {
    id: "midnight_amber",
    name: "🕯️ 미드나잇 앰버",
    bg: "bg-[#1C1713]",
    border: "border-amber-600/40",
    text: "text-amber-100",
    accent: "text-amber-300 bg-amber-900/40 border border-amber-600/30",
    canvasBg: ["#1C1713", "#28201A", "#14100D"],
    textColor: "#FEF3C7",
  },
  {
    id: "ocean_breeze",
    name: "🌊 오션 브리즈",
    bg: "bg-[#F1F6F9]",
    border: "border-sky-200",
    text: "text-sky-950",
    accent: "text-sky-800 bg-sky-100/70 border border-sky-200",
    canvasBg: ["#F1F6F9", "#E1EEF5", "#D0E4F0"],
    textColor: "#082F49",
  },
  {
    id: "vintage_paper",
    name: "📜 빈티지 앤틱",
    bg: "bg-[#F4EBE1]",
    border: "border-amber-900/30",
    text: "text-[#3B2F2F]",
    accent: "text-amber-900 bg-amber-900/10 border border-amber-900/20",
    canvasBg: ["#F4EBE1", "#EADCCF", "#DFCDBE"],
    textColor: "#3B2F2F",
  },
  {
    id: "sunset_glow",
    name: "🌅 코랄 선셋",
    bg: "bg-[#FFF6F0]",
    border: "border-orange-200",
    text: "text-orange-950",
    accent: "text-orange-800 bg-orange-100/70 border border-orange-200",
    canvasBg: ["#FFF6F0", "#FFEAD9", "#FFDEC4"],
    textColor: "#431407",
  },
];

export const FONT_OPTIONS = [
  {
    id: "gowun_batang",
    name: "고운 바탕 (아날로그 명조)",
    className: "font-gowun-batang",
    canvasFont: "Gowun Batang, 'Noto Serif KR', serif",
  },
  {
    id: "gowun_dodum",
    name: "고운 돋움 (정갈한 돋움)",
    className: "font-gowun-dodum",
    canvasFont: "Gowun Dodum, 'Noto Sans KR', sans-serif",
  },
  {
    id: "nanum_pen",
    name: "감성 손글씨 (따뜻한 펜)",
    className: "font-nanum-pen text-base sm:text-lg",
    canvasFont: "Nanum Pen Script, cursive",
  },
  {
    id: "noto_serif",
    name: "클래식 명조",
    className: "font-noto-serif",
    canvasFont: "Noto Serif KR, serif",
  },
  {
    id: "editorial_serif",
    name: "플레이페어 명조",
    className: "font-editorial-serif",
    canvasFont: "Playfair Display, Noto Serif KR, serif",
  },
  {
    id: "modern_sans",
    name: "깔끔 고딕",
    className: "font-sans",
    canvasFont: "Plus Jakarta Sans, Noto Sans KR, sans-serif",
  },
];

export const FONT_SIZE_OPTIONS = [
  {
    id: "sm",
    name: "작게",
    badge: "13px",
    cssClass: "text-xs sm:text-sm leading-relaxed",
    canvasFontSize: 17,
    canvasLineHeight: 28,
  },
  {
    id: "md",
    name: "보통",
    badge: "15px",
    cssClass: "text-sm sm:text-base leading-relaxed",
    canvasFontSize: 20,
    canvasLineHeight: 34,
  },
  {
    id: "lg",
    name: "크게",
    badge: "18px",
    cssClass: "text-base sm:text-lg leading-relaxed",
    canvasFontSize: 23,
    canvasLineHeight: 39,
  },
  {
    id: "xl",
    name: "아주 크게",
    badge: "21px",
    cssClass: "text-lg sm:text-xl leading-relaxed",
    canvasFontSize: 26,
    canvasLineHeight: 44,
  },
];

export const STAMPS = [
  { id: "heart", symbol: "❤️", label: "하트" },
  { id: "gift", symbol: "🎁", label: "선물" },
  { id: "sparkle", symbol: "✨", label: "반짝" },
  { id: "flower", symbol: "🌸", label: "꽃" },
  { id: "champagne", symbol: "🥂", label: "축하" },
  { id: "clover", symbol: "🍀", label: "행운" },
];

export const MobileCardViewer: React.FC<MobileCardViewerProps> = ({
  cardLetters,
  senderName = "보내는 이",
  recipientName = "받는 이",
  occasion = "기념일",
  selectedGiftTitle,
  onSaveCardHistory,
}) => {
  const [activeTab, setActiveTab] = useState<"emotional" | "witty" | "formal">(
    "emotional"
  );
  const [selectedThemeId, setSelectedThemeId] = useState("editorial_cream");
  const [selectedFontId, setSelectedFontId] = useState("gowun_batang");
  const [selectedFontSizeId, setSelectedFontSizeId] = useState("md");
  const [selectedStamp, setSelectedStamp] = useState("❤️");

  const [toText, setToText] = useState(recipientName || "소중한 사람에게");
  const [fromText, setFromText] = useState(senderName || "마음을 담아");
  const [giftTitleText, setGiftTitleText] = useState(selectedGiftTitle || "");

  // Editable Letter Text
  const [letterDrafts, setLetterDrafts] = useState<CardLetters>({ ...cardLetters });
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const currentTheme =
    CARD_THEMES.find((t) => t.id === selectedThemeId) || CARD_THEMES[0];
  const currentFont =
    FONT_OPTIONS.find((f) => f.id === selectedFontId) || FONT_OPTIONS[0];
  const currentFontSize =
    FONT_SIZE_OPTIONS.find((s) => s.id === selectedFontSizeId) || FONT_SIZE_OPTIONS[1];

  const currentLetterContent = letterDrafts[activeTab] || "";

  const handleCopyText = () => {
    const fullText = `[모바일 편지 카드]\nTo. ${toText}\n\n${currentLetterContent}\n\nFrom. ${fromText}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToHistory = () => {
    if (onSaveCardHistory) {
      onSaveCardHistory(activeTab, selectedThemeId, currentLetterContent);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    }
  };

  // HTML5 Canvas generation for downloading image
  const handleDownloadImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 600;
    const height = 900;
    canvas.width = width;
    canvas.height = height;

    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    const colors = currentTheme.canvasBg;
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.5, colors[1]);
    grad.addColorStop(1, colors[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw inner card border frame
    ctx.strokeStyle = currentTheme.textColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.globalAlpha = 1.0;

    // Draw Stamp Icon
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillText(selectedStamp, width / 2, 100);

    // Draw Occasion / Gift Title tag if exists
    ctx.font = `bold 18px ${currentFont.canvasFont}`;
    ctx.fillStyle = currentTheme.textColor;
    ctx.fillText(`[ ${occasion} ]`, width / 2, 140);

    if (giftTitleText) {
      ctx.font = `16px ${currentFont.canvasFont}`;
      ctx.fillText(`🎁 추천 선물: ${giftTitleText}`, width / 2, 170);
    }

    // Draw To
    ctx.textAlign = "left";
    ctx.font = `bold 24px ${currentFont.canvasFont}`;
    ctx.fillStyle = currentTheme.textColor;
    ctx.fillText(`To. ${toText}`, 70, 230);

    // Draw Letter Lines with configured Font Family and Size
    ctx.font = `${currentFontSize.canvasFontSize}px ${currentFont.canvasFont}`;
    const lines = currentLetterContent.split("\n");
    let startY = 280;
    const lineHeight = currentFontSize.canvasLineHeight;

    lines.forEach((line) => {
      // Word wrap if line is too long
      const maxCharsPerLine = Math.floor(460 / (currentFontSize.canvasFontSize * 0.9));
      if (line.length > maxCharsPerLine) {
        let chunk = "";
        for (let i = 0; i < line.length; i++) {
          chunk += line[i];
          if (chunk.length >= maxCharsPerLine || i === line.length - 1) {
            ctx.fillText(chunk, 70, startY);
            startY += lineHeight;
            chunk = "";
          }
        }
      } else {
        ctx.fillText(line, 70, startY);
        startY += lineHeight;
      }
    });

    // Draw From
    ctx.textAlign = "right";
    ctx.font = `bold 22px ${currentFont.canvasFont}`;
    ctx.fillText(`From. ${fromText}`, width - 70, height - 80);

    // Download Canvas
    const link = document.createElement("a");
    link.download = `MobileCard_${toText}_${activeTab}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="bg-white rounded-none border border-black/10 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-5">
        <div>
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-black/60 mb-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" /> 모바일 편지 카드
          </span>
          <h2 className="text-xl sm:text-2xl font-editorial-serif font-bold text-[#1A1A1A]">
            감성 모바일 편지 카드
          </h2>
        </div>

        {/* Tab Style Switcher */}
        <div className="flex bg-[#F9F7F2] p-1 border border-black/15 rounded-none space-x-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("emotional")}
            className={`px-3 py-1.5 rounded-none text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
              activeTab === "emotional"
                ? "bg-[#1A1A1A] text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>감성·감동</span>
          </button>
          <button
            onClick={() => setActiveTab("witty")}
            className={`px-3 py-1.5 rounded-none text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
              activeTab === "witty"
                ? "bg-[#1A1A1A] text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <span>위트·재치</span>
          </button>
          <button
            onClick={() => setActiveTab("formal")}
            className={`px-3 py-1.5 rounded-none text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
              activeTab === "formal"
                ? "bg-[#1A1A1A] text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-400" />
            <span>정중·격식</span>
          </button>
        </div>
      </div>

      {/* Customizer Toolbar */}
      <div className="bg-[#F9F7F2] border border-black/10 p-4 space-y-4 text-xs">
        {/* 1. Theme Selector (9 themes) */}
        <div>
          <span className="font-bold tracking-wider text-[11px] text-black/80 flex items-center mb-2">
            <Palette className="w-3.5 h-3.5 mr-1 text-amber-700" /> 카드 테마 (9가지 스타일):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
            {CARD_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedThemeId(t.id)}
                className={`px-2.5 py-1.5 text-[11px] font-medium border text-left truncate transition cursor-pointer flex items-center justify-between ${
                  selectedThemeId === t.id
                    ? "bg-[#1A1A1A] text-white border-black font-semibold shadow-2xs"
                    : "bg-white border-black/15 text-black/80 hover:bg-[#EAE8E3]"
                }`}
              >
                <span>{t.name}</span>
                {selectedThemeId === t.id && <Check className="w-3 h-3 text-amber-400 ml-1 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Font Family & Font Size Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-black/10">
          {/* Font Family */}
          <div>
            <span className="font-bold tracking-wider text-[11px] text-black/80 flex items-center mb-2">
              <Type className="w-3.5 h-3.5 mr-1 text-amber-700" /> 글씨체 (폰트):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFontId(f.id)}
                  className={`px-2.5 py-1 text-[11px] border transition cursor-pointer ${
                    selectedFontId === f.id
                      ? "bg-[#1A1A1A] text-white border-black font-bold"
                      : "bg-white border-black/15 text-black/70 hover:bg-[#EAE8E3]"
                  }`}
                >
                  <span className={f.className}>{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <span className="font-bold tracking-wider text-[11px] text-black/80 flex items-center mb-2">
              <Maximize2 className="w-3.5 h-3.5 mr-1 text-amber-700" /> 글씨 크기:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FONT_SIZE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedFontSizeId(s.id)}
                  className={`px-3 py-1 text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                    selectedFontSizeId === s.id
                      ? "bg-[#1A1A1A] text-white border-black"
                      : "bg-white border-black/15 text-black/70 hover:bg-[#EAE8E3]"
                  }`}
                >
                  <span>{s.name}</span>
                  <span className={`text-[9px] opacity-60 ${selectedFontSizeId === s.id ? "text-amber-300" : ""}`}>
                    ({s.badge})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Stamp & Names */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-black/10">
          <div className="sm:col-span-1">
            <label className="text-[10px] font-bold tracking-wider text-black/70 block mb-1">스탬프 이모지</label>
            <div className="flex space-x-1">
              {STAMPS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStamp(s.symbol)}
                  className={`w-7 h-7 flex items-center justify-center text-sm border transition cursor-pointer ${
                    selectedStamp === s.symbol
                      ? "bg-[#1A1A1A] text-white border-black"
                      : "bg-white border-black/15 hover:bg-[#EAE8E3]"
                  }`}
                  title={s.label}
                >
                  {s.symbol}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-black/70 block mb-1">받는 사람 (To)</label>
            <input
              type="text"
              value={toText}
              onChange={(e) => setToText(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-black/20 bg-white focus:outline-none focus:border-black text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-black/70 block mb-1">보내는 사람 (From)</label>
            <input
              type="text"
              value={fromText}
              onChange={(e) => setFromText(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-black/20 bg-white focus:outline-none focus:border-black text-xs"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold tracking-wider text-black/70 block mb-1">선택한 선물 (선택)</label>
            <input
              type="text"
              value={giftTitleText}
              onChange={(e) => setGiftTitleText(e.target.value)}
              placeholder="예: 프리미엄 티 세트"
              className="w-full px-2.5 py-1.5 border border-black/20 bg-white focus:outline-none focus:border-black text-xs"
            />
          </div>
        </div>
      </div>

      {/* Main Mobile Card Mockup */}
      <div className="flex justify-center my-6">
        <div
          ref={cardRef}
          className={`w-full max-w-sm rounded-none p-8 shadow-sm border ${currentTheme.border} ${currentTheme.bg} transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[480px]`}
        >
          {/* Top Decorative Stamp */}
          <div className="absolute top-4 right-4 text-2xl opacity-90 select-none">
            {selectedStamp}
          </div>

          <div>
            {/* Card Badge */}
            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 text-[10px] tracking-wider font-bold ${currentTheme.accent}`}
              >
                {occasion} 에디션
              </span>
              {giftTitleText && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium tracking-wider truncate max-w-[200px] ${currentTheme.accent}`}
                >
                  <Gift className="w-3 h-3 mr-1 shrink-0 opacity-80" />
                  {giftTitleText}
                </span>
              )}
            </div>

            {/* To Header */}
            <div className="mb-6 pb-2 border-b border-current/10">
              <p className={`text-lg font-bold tracking-tight ${currentFont.className} ${currentTheme.text}`}>
                To. {toText}
              </p>
            </div>

            {/* Letter Body */}
            {isEditing ? (
              <textarea
                value={currentLetterContent}
                onChange={(e) =>
                  setLetterDrafts({
                    ...letterDrafts,
                    [activeTab]: e.target.value,
                  })
                }
                rows={7}
                className={`w-full p-3 bg-white/90 border border-black/30 rounded-none text-black focus:outline-none resize-none ${currentFont.className} ${currentFontSize.cssClass}`}
              />
            ) : (
              <p
                className={`whitespace-pre-line tracking-normal ${currentFont.className} ${currentFontSize.cssClass} ${currentTheme.text}`}
              >
                {currentLetterContent}
              </p>
            )}
          </div>

          {/* From Footer */}
          <div className="mt-8 pt-4 border-t border-current/15 flex items-center justify-between">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`text-[10px] tracking-wider font-bold opacity-80 hover:opacity-100 flex items-center gap-1 bg-current/10 px-2 py-1 rounded-none cursor-pointer ${currentTheme.text}`}
            >
              <Edit3 className="w-3 h-3" />
              {isEditing ? "완료" : "문구 직접 수정"}
            </button>

            <p className={`text-base font-bold text-right ${currentFont.className} ${currentTheme.text}`}>
              From. {fromText}
            </p>
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          onClick={handleCopyText}
          className="flex-1 min-w-[140px] py-3.5 px-4 rounded-none text-xs font-bold tracking-wider text-black bg-white border border-black/30 hover:bg-black hover:text-white transition flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>복사 완료!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>전체 문구 복사</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownloadImage}
          className="flex-1 min-w-[160px] py-3.5 px-4 rounded-none text-xs font-bold tracking-wider text-white bg-[#1A1A1A] hover:bg-black border border-black transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>모바일 카드 이미지 저장</span>
        </button>

        {onSaveCardHistory && (
          <button
            onClick={handleSaveToHistory}
            className="py-3.5 px-4 rounded-none text-xs font-bold tracking-wider text-black/80 bg-[#F9F7F2] border border-black/20 hover:bg-black hover:text-white transition flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
            <span>{savedNotice ? "저장 완료!" : "보관함 저장"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
