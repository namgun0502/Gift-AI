import React, { useState, useEffect, useRef } from "react";
import {
  Gift,
  Sparkles,
  Heart,
  Bookmark,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Header } from "./components/Header";
import { GiftForm } from "./components/GiftForm";
import { GiftCardItem } from "./components/GiftCardItem";
import { MobileCardViewer } from "./components/MobileCardViewer";
import { SavedCardsHistory } from "./components/SavedCardsHistory";
import { RecommendRequest, RecommendResponse, SavedCard } from "./types";

const LOADING_TIPS = [
  "💡 받는 사람의 최근 관심사와 라이프스타일을 분석하는 중...",
  "🎁 기발함과 실용성을 갖춘 최고의 선물 3가지를 엄선하고 있어요...",
  "✍️ 받는 사람과의 관계에 깊은 울림을 줄 감성·위트·격식 편지를 작성하는 중...",
  "✨ 감동과 센스가 모두 느껴지는 모바일 카드를 다듬고 있습니다...",
];

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentRequest, setCurrentRequest] = useState<RecommendRequest | null>(null);
  const [currentResponse, setCurrentResponse] = useState<RecommendResponse | null>(null);

  const [activeTab, setActiveTab] = useState<"gifts" | "card" | "saved">("gifts");
  const [selectedGiftTitle, setSelectedGiftTitle] = useState<string>("");

  const resultsRef = useRef<HTMLDivElement>(null);

  const [savedCards, setSavedCards] = useState<SavedCard[]>(() => {
    try {
      const stored = localStorage.getItem("gift_ai_saved_cards");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Cycle loading tips during AI generation
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  // Persist saved cards
  useEffect(() => {
    try {
      localStorage.setItem("gift_ai_saved_cards", JSON.stringify(savedCards));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [savedCards]);

  const handleFormSubmit = async (formData: RecommendRequest) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSelectedGiftTitle("");

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "선물 추천을 불러오지 못했습니다.");
        }
        setCurrentRequest(formData);
        setCurrentResponse(data);
        setActiveTab("gifts");
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        const rawText = await res.text();
        console.error("Non-JSON API response:", rawText);
        if (!res.ok) {
          throw new Error("서버 응답 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        } else {
          throw new Error("응답 형식이 올바르지 않습니다.");
        }
      }
    } catch (err: any) {
      console.error("Error generating recommendations:", err);
      setErrorMsg(
        err.message ||
          "AI 서비스 호출 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGiftForCard = (title: string) => {
    setSelectedGiftTitle(title);
    setActiveTab("card");
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleSaveCardHistory = (
    selectedType: "emotional" | "witty" | "formal",
    theme: string,
    customText: string
  ) => {
    if (!currentRequest || !currentResponse) return;

    // Create a deep copy with updated selected text
    const updatedResponse: RecommendResponse = {
      ...currentResponse,
      cardLetters: {
        ...currentResponse.cardLetters,
        [selectedType]: customText,
      },
    };

    const newSaved: SavedCard = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      request: currentRequest,
      response: updatedResponse,
      selectedLetterType: selectedType,
      cardTheme: theme,
    };

    setSavedCards((prev) => [newSaved, ...prev]);
  };

  const handleSelectSavedCard = (saved: SavedCard) => {
    setCurrentRequest(saved.request);
    setCurrentResponse(saved.response);
    setActiveTab("card");
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleDeleteSavedCard = (id: string) => {
    setSavedCards((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSaved = () => {
    setSavedCards([]);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1A1A] font-sans selection:bg-amber-100 selection:text-black pb-20">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-black/10 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-black/15 text-xs font-bold tracking-[0.1em] text-black/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI 맞춤 선물 큐레이션 & 모바일 편지 카드</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial-serif font-bold text-[#1A1A1A] tracking-tight leading-tight">
            특별한 날을 위한 완벽한 선물의 기술
          </h2>
          <p className="text-xs sm:text-sm text-black/70 leading-relaxed font-sans max-w-lg mx-auto">
            관계, 나이, 성별, 취향과 특별한 기념일을 분석하여 <br className="hidden sm:inline" />
            기발한 3가지 맞춤 선물과 감성·위트·격식 모바일 편지 카드를 큐레이션합니다.
          </p>
        </div>

        {/* Input Form */}
        <GiftForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        {/* Loading Banner */}
        {isLoading && (
          <div className="bg-white rounded-none p-8 text-center border border-black/20 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-none bg-[#1A1A1A] text-white flex items-center justify-center mx-auto shadow-xs">
              <RefreshCw className="w-5 h-5 animate-spin text-amber-300" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">
              AI가 맞춤 선물과 편지를 구성하고 있습니다...
            </h3>
            <p className="text-xs font-medium text-black/70 tracking-wider transition-all duration-300">
              {LOADING_TIPS[loadingTipIndex]}
            </p>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="bg-white border-2 border-red-800 text-red-950 p-5 rounded-none flex items-start space-x-3 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold tracking-wider">선물 추천 생성 중 오류가 발생했습니다</p>
              <p className="mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Results Container */}
        {currentResponse && currentRequest && (
          <div ref={resultsRef} className="space-y-8 pt-2">
            {/* Navigation Tabs */}
            <div className="flex border border-black/15 justify-between items-center bg-white p-2 shadow-xs">
              <div className="flex space-x-1 sm:space-x-2">
                <button
                  onClick={() => setActiveTab("gifts")}
                  className={`px-4 py-2.5 rounded-none text-xs font-bold tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "gifts"
                      ? "bg-[#1A1A1A] text-white border border-black"
                      : "text-black/60 hover:text-black hover:bg-black/5"
                  }`}
                >
                  <Gift className="w-4 h-4" />
                  <span>추천 선물 3선</span>
                </button>

                <button
                  onClick={() => setActiveTab("card")}
                  className={`px-4 py-2.5 rounded-none text-xs font-bold tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${
                    activeTab === "card"
                      ? "bg-[#1A1A1A] text-white border border-black"
                      : "text-black/60 hover:text-black hover:bg-black/5"
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>모바일 편지 카드</span>
                </button>
              </div>

              <button
                onClick={() => setActiveTab("saved")}
                className={`px-3 py-2 rounded-none text-xs font-bold tracking-wider transition flex items-center space-x-1 cursor-pointer ${
                  activeTab === "saved"
                    ? "bg-[#1A1A1A] text-white border border-black"
                    : "text-black/50 hover:text-black hover:bg-black/5"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>카드 보관함 ({savedCards.length})</span>
              </button>
            </div>

            {/* TAB 1: Gifts List */}
            {activeTab === "gifts" && (
              <div className="space-y-6">
                <div className="bg-white p-4 border border-black/10 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0" />
                    <div>
                      <span className="font-bold text-black uppercase tracking-wider text-xs">
                        [{currentRequest.relationship} / {currentRequest.ageGender}]
                      </span>
                      <span className="text-black/70 ml-2">
                        맞춤 큐레이션 결과입니다. 마음에 드는 선물로 카드를 완성해보세요.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {currentResponse.giftRecommendations.map((gift, idx) => (
                    <GiftCardItem
                      key={idx}
                      gift={gift}
                      index={idx}
                      recipientName={currentRequest.recipientName || currentRequest.relationship}
                      onSelectForCard={handleSelectGiftForCard}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Mobile Card Viewer */}
            {activeTab === "card" && (
              <MobileCardViewer
                cardLetters={currentResponse.cardLetters}
                senderName={currentRequest.senderName || "보내는 이"}
                recipientName={currentRequest.recipientName || currentRequest.relationship}
                occasion={currentRequest.occasion}
                selectedGiftTitle={selectedGiftTitle}
                onSaveCardHistory={handleSaveCardHistory}
              />
            )}

            {/* TAB 3: Saved Cards History */}
            {activeTab === "saved" && (
              <SavedCardsHistory
                savedCards={savedCards}
                onSelectSavedCard={handleSelectSavedCard}
                onDeleteSavedCard={handleDeleteSavedCard}
                onClearAll={handleClearAllSaved}
              />
            )}
          </div>
        )}

        {/* If no active result yet, show saved cards or tips */}
        {!currentResponse && savedCards.length > 0 && (
          <SavedCardsHistory
            savedCards={savedCards}
            onSelectSavedCard={handleSelectSavedCard}
            onDeleteSavedCard={handleDeleteSavedCard}
            onClearAll={handleClearAllSaved}
          />
        )}
      </main>
    </div>
  );
}
