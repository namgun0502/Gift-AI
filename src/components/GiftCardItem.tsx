import React, { useState } from "react";
import {
  ShieldCheck,
  Lightbulb,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Tag,
  Gift,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { GiftRecommendation } from "../types";

interface GiftCardItemProps {
  gift: GiftRecommendation;
  index: number;
  recipientName?: string;
  onSelectForCard?: (giftTitle: string) => void;
}

const OPTION_TYPES = [
  {
    label: "1. 실용적 & 안성맞춤",
    subtitle: "실패 없는 차분한 베스트 선택",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    icon: ShieldCheck,
    accentBorder: "border-l-4 border-l-blue-500",
  },
  {
    label: "2. 기발함 & 유니크",
    subtitle: "트렌디하고 감탄을 부르는 센스",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Lightbulb,
    accentBorder: "border-l-4 border-l-purple-500",
  },
  {
    label: "3. 감성 & 특별한 경험",
    subtitle: "마음을 오래 남기는 기억형 선물",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
    icon: Sparkles,
    accentBorder: "border-l-4 border-l-rose-500",
  },
];

export const GiftCardItem: React.FC<GiftCardItemProps> = ({
  gift,
  index,
  recipientName,
  onSelectForCard,
}) => {
  const [copied, setCopied] = useState(false);
  const optionMeta = OPTION_TYPES[index % 3];
  const IconComponent = optionMeta.icon;

  const handleSearchNaver = () => {
    const query = encodeURIComponent(gift.title);
    window.open(`https://search.shopping.naver.com/search/all?query=${query}`, "_blank");
  };

  const handleCopy = () => {
    const textToCopy = `[선물 추천] ${gift.title}\n카테고리: ${gift.category}\n가격대: ${gift.priceRange}\n추천 이유: ${gift.reason}\n전달 꿀팁: ${gift.tip}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDarkCard = index % 3 === 1; // Middle card gets dark editorial emphasis

  return (
    <div
      className={`rounded-none p-6 shadow-sm border transition-all duration-200 flex flex-col justify-between space-y-4 ${
        isDarkCard
          ? "bg-[#1A1A1A] text-white border-black"
          : "bg-white text-[#1A1A1A] border-black/15 hover:border-black/30"
      }`}
    >
      <div>
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-current/10">
          <span
            className={`inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] ${
              isDarkCard ? "text-amber-300" : "text-black/60"
            }`}
          >
            <IconComponent className="w-3.5 h-3.5 mr-1.5" />
            {optionMeta.label}
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <span
              className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${
                isDarkCard
                  ? "bg-white/10 text-white/80 border-white/20"
                  : "bg-black/5 text-black/70 border-black/10"
              }`}
            >
              <Tag className="w-3 h-3 mr-1 inline" />
              {gift.category}
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${
                isDarkCard
                  ? "bg-amber-400/20 text-amber-200 border-amber-400/40"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              {gift.priceRange}
            </span>
          </div>
        </div>

        {/* Gift Title */}
        <h3 className="text-xl sm:text-2xl font-editorial-serif italic font-normal tracking-tight leading-snug flex items-start gap-2 mb-3">
          <Gift
            className={`w-5 h-5 shrink-0 mt-1 ${
              isDarkCard ? "text-amber-300" : "text-black/80"
            }`}
          />
          <span>{gift.title}</span>
        </h3>

        {/* Reason Box */}
        <div
          className={`mt-4 p-4 rounded-none border ${
            isDarkCard
              ? "bg-white/5 border-white/10 text-white/80"
              : "bg-[#F9F7F2] border-black/10 text-black/80"
          }`}
        >
          <div className="flex items-center space-x-1.5 text-[10px] font-bold tracking-[0.1em] mb-1.5 opacity-80">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>추천 이유 및 분석</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            {gift.reason}
          </p>
        </div>

        {/* Sense Tip Box */}
        <div
          className={`mt-3 p-4 rounded-none border ${
            isDarkCard
              ? "bg-amber-500/10 border-amber-500/30 text-amber-100"
              : "bg-amber-50/80 border-amber-200/80 text-amber-950"
          }`}
        >
          <div className="flex items-center space-x-1.5 text-[10px] font-bold tracking-[0.1em] mb-1.5 opacity-90">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>선물 전달 꿀팁</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            {gift.tip}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className={`pt-4 border-t flex flex-wrap items-center justify-between gap-2 ${
          isDarkCard ? "border-white/10" : "border-black/10"
        }`}
      >
        <button
          onClick={handleSearchNaver}
          className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] border transition cursor-pointer ${
            isDarkCard
              ? "border-white/30 text-white hover:bg-white hover:text-black"
              : "border-black/30 text-black hover:bg-black hover:text-white"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 mr-1" />
          네이버 쇼핑 검색
          <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
        </button>

        <div className="flex items-center space-x-2">
          {onSelectForCard && (
            <button
              onClick={() => onSelectForCard(gift.title)}
              className={`inline-flex items-center px-3 py-1.5 text-[10px] font-bold tracking-[0.1em] border transition cursor-pointer ${
                isDarkCard
                  ? "bg-amber-400 text-black border-amber-400 hover:bg-amber-300"
                  : "bg-black text-white border-black hover:bg-black/80"
              }`}
            >
              <Gift className="w-3.5 h-3.5 mr-1" />
              이 선물로 편지 작성
            </button>
          )}

          <button
            onClick={handleCopy}
            className={`inline-flex items-center px-2.5 py-1.5 text-[10px] font-bold tracking-wider transition cursor-pointer ${
              isDarkCard
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-black/60 hover:text-black hover:bg-black/5"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                복사완료
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1" />
                복사
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
