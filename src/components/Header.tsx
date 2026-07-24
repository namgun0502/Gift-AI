import React from "react";
import { Gift, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-black/10 bg-[#F9F7F2]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-none border border-black/20 bg-white flex items-center justify-center shadow-xs">
            <Gift className="w-5 h-5 text-black/80" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] tracking-[0.2em] font-bold text-black/50">
                선물 큐레이션 AI
              </span>
              <span className="text-black/30">·</span>
              <span className="text-[10px] tracking-[0.15em] font-bold text-black/70">
                맞춤 선물 & 편지 카드
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-editorial-serif font-bold text-[#1A1A1A] tracking-tight">
              선물 AI <span className="font-sans not-italic text-xs font-semibold text-black/60 ml-1">The Gift Curator</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-bold tracking-[0.1em] px-3 py-1 bg-white border border-black/10 text-black/80 flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3 h-3 text-amber-600" />
            AI 맞춤 추천
          </span>
        </div>
      </div>
    </header>
  );
};

