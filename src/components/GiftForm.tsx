import React, { useState } from "react";
import {
  Sparkles,
  Users,
  Calendar,
  Smile,
  Heart,
  Wallet,
  UserCheck,
  RotateCcw,
  Gift,
  User,
} from "lucide-react";
import { RecommendRequest } from "../types";
import { PresetChips } from "./PresetChips";

interface GiftFormProps {
  onSubmit: (formData: RecommendRequest) => void;
  isLoading: boolean;
}

const RELATIONSHIP_PRESETS = [
  "연인/배우자",
  "부모님",
  "친구",
  "직장 동료",
  "스승님/상사",
  "자녀/조카",
];

const AGE_PRESETS = [
  "20대 후반",
  "30대 초반",
  "50대",
  "10대",
  "60대 이상",
  "30대 후반",
  "40대",
  "영유아/어린이",
];

const GENDER_PRESETS = [
  "여성",
  "남성",
  "성별 무관",
];

const OCCASION_PRESETS = [
  "생일",
  "취업 축하",
  "승진/이직",
  "어버이날",
  "100일/기념일",
  "결혼 축하",
  "퇴직/감사",
  "집들이",
];

const INTEREST_PRESETS = [
  "실용주의",
  "캠핑/야외활동",
  "감성 카페/디저트",
  "헬스/운동",
  "요리/홈쿠킹",
  "IT/테크",
  "독서/자기계발",
  "뷰티/스킨케어",
  "인테리어/리빙",
];

const BUDGET_PRESETS = [
  "3만원 이하",
  "5만원~10만원 대",
  "10만원~20만원 대",
  "30만원 이상",
  "상관없음",
];

export const GiftForm: React.FC<GiftFormProps> = ({ onSubmit, isLoading }) => {
  const [relationship, setRelationship] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [personalityInterests, setPersonalityInterests] = useState("");
  const [occasion, setOccasion] = useState("");
  const [budget, setBudget] = useState("");
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");

  const handleInterestPresetClick = (interest: string) => {
    if (!personalityInterests) {
      setPersonalityInterests(interest);
    } else if (personalityInterests.includes(interest)) {
      const updated = personalityInterests
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== interest)
        .join(", ");
      setPersonalityInterests(updated);
    } else {
      setPersonalityInterests(`${personalityInterests}, ${interest}`);
    }
  };

  const handleReset = () => {
    setRelationship("");
    setAge("");
    setGender("");
    setPersonalityInterests("");
    setOccasion("");
    setBudget("");
    setSenderName("");
    setRecipientName("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relationship.trim() || (!age.trim() && !gender.trim()) || !personalityInterests.trim() || !occasion.trim()) {
      return;
    }
    const combinedAgeGender = [age.trim(), gender.trim()].filter(Boolean).join(" ");
    onSubmit({
      relationship: relationship.trim(),
      ageGender: combinedAgeGender,
      personalityInterests: personalityInterests.trim(),
      occasion: occasion.trim(),
      budget: budget.trim() || undefined,
      senderName: senderName.trim() || undefined,
      recipientName: recipientName.trim() || undefined,
    });
  };

  const isFormValid =
    relationship.trim() &&
    (age.trim() || gender.trim()) &&
    personalityInterests.trim() &&
    occasion.trim();

  return (
    <div className="bg-white rounded-none border border-black/10 shadow-sm overflow-hidden transition-all">
      <div className="bg-[#1A1A1A] p-6 text-white border-b border-black">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-flex items-center text-[10px] tracking-[0.25em] font-bold uppercase text-amber-300 mb-1">
              <Gift className="w-3.5 h-3.5 mr-1" /> AI 큐레이션 질문지
            </span>
            <h2 className="text-xl sm:text-2xl font-editorial-serif italic font-normal tracking-tight">
              받는 사람 정보 및 상황 입력
            </h2>
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              상황과 성향을 입력하시면 3가지 추천 선물과 맞춤 모바일 편지 카드가 생성됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            title="초기화"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-none transition text-white text-xs flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">초기화</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* 1. Relationship */}
        <div className="space-y-2">
          <label className="flex items-center text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
            <Users className="w-4 h-4 text-black/70 mr-2" />
            1. 받는 사람과의 관계 <span className="text-amber-600 ml-1">*</span>
          </label>
          <PresetChips
            options={RELATIONSHIP_PRESETS}
            selectedValue={relationship}
            onSelect={(val) => setRelationship(val)}
          />
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="예: 연인, 부모님, 직장 동료, 오랜 친구, 대학 후배 등"
            className="w-full px-4 py-2.5 rounded-none border border-black/20 focus:border-black outline-none text-sm transition bg-white"
            required
          />
        </div>

        {/* Separate Age & Gender Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. Age */}
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
              <UserCheck className="w-4 h-4 text-black/70 mr-2" />
              2. 나이 <span className="text-amber-600 ml-1">*</span>
            </label>
            <PresetChips
              options={AGE_PRESETS}
              selectedValue={age}
              onSelect={(val) => setAge(val)}
            />
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="예: 20대 후반, 30대 초반, 50대"
              className="w-full px-4 py-2.5 rounded-none border border-black/20 focus:border-black outline-none text-sm transition bg-white"
              required
            />
          </div>

          {/* 3. Gender */}
          <div className="space-y-2">
            <label className="flex items-center text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
              <User className="w-4 h-4 text-black/70 mr-2" />
              3. 성별 <span className="text-amber-600 ml-1">*</span>
            </label>
            <PresetChips
              options={GENDER_PRESETS}
              selectedValue={gender}
              onSelect={(val) => setGender(val)}
            />
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="예: 여성, 남성, 무관"
              className="w-full px-4 py-2.5 rounded-none border border-black/20 focus:border-black outline-none text-sm transition bg-white"
              required
            />
          </div>
        </div>

        {/* 4. Personality & Interests */}
        <div className="space-y-2">
          <label className="flex items-center text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
            <Smile className="w-4 h-4 text-black/70 mr-2" />
            4. 성향 및 취향/관심사 <span className="text-amber-600 ml-1">*</span>
          </label>
          <div className="flex flex-wrap gap-1.5 my-2">
            {INTEREST_PRESETS.map((interest) => {
              const isSelected = personalityInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestPresetClick(interest)}
                  className={`px-3 py-1 rounded-none text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#1A1A1A] text-white border border-black font-semibold"
                      : "bg-[#F9F7F2] text-black/70 hover:bg-[#EAE8E3] border border-black/15"
                  }`}
                >
                  + {interest}
                </button>
              );
            })}
          </div>
          <textarea
            value={personalityInterests}
            onChange={(e) => setPersonalityInterests(e.target.value)}
            rows={2}
            placeholder="예: 실용적인 것 선호, 캠핑 덕후, 감성적인 카페 인테리어 좋아함, 건강 챙김 등"
            className="w-full px-4 py-2.5 rounded-none border border-black/20 focus:border-black outline-none text-sm transition resize-none bg-white"
            required
          />
        </div>

        {/* 5. Occasion */}
        <div className="space-y-2">
          <label className="flex items-center text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A]">
            <Calendar className="w-4 h-4 text-black/70 mr-2" />
            5. 기념일 / 선물 목적 <span className="text-amber-600 ml-1">*</span>
          </label>
          <PresetChips
            options={OCCASION_PRESETS}
            selectedValue={occasion}
            onSelect={(val) => setOccasion(val)}
          />
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="예: 생일, 취업 축하, 승진, 어버이날, 100일 기념, 결혼 등"
            className="w-full px-4 py-2.5 rounded-none border border-black/20 focus:border-black outline-none text-sm transition bg-white"
            required
          />
        </div>

        {/* Optional Section: Budget & Names */}
        <div className="pt-4 border-t border-black/10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1 md:col-span-1">
            <label className="flex items-center text-[11px] font-bold uppercase tracking-wider text-black/70">
              <Wallet className="w-3.5 h-3.5 text-black/60 mr-1.5" />
              선호 예산대 (선택)
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="예: 5만원~10만원 대"
              className="w-full px-3 py-2 rounded-none border border-black/20 focus:border-black outline-none text-xs bg-white"
            />
            <div className="flex flex-wrap gap-1 mt-1">
              {BUDGET_PRESETS.slice(0, 3).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className="text-[10px] px-2 py-0.5 bg-[#F2EFE9] text-black/70 border border-black/10 hover:bg-black/10"
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-[11px] font-bold uppercase tracking-wider text-black/70">
              <Heart className="w-3.5 h-3.5 text-black/60 mr-1.5" />
              받는 사람 호칭 (선택)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="예: 지은이에게, 팀장님께, 어머니"
              className="w-full px-3 py-2 rounded-none border border-black/20 focus:border-black outline-none text-xs bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-[11px] font-bold uppercase tracking-wider text-black/70">
              <Sparkles className="w-3.5 h-3.5 text-black/60 mr-1.5" />
              보내는 사람 호칭 (선택)
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="예: 민수가, 막내 올림, 영희"
              className="w-full px-3 py-2 rounded-none border border-black/20 focus:border-black outline-none text-xs bg-white"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-4 px-6 rounded-none font-bold text-xs uppercase tracking-[0.25em] transition-all duration-200 flex items-center justify-center space-x-2 border border-black cursor-pointer ${
            isFormValid && !isLoading
              ? "bg-[#1A1A1A] text-white hover:bg-black shadow-sm"
              : "bg-black/10 text-black/40 border-black/10 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span>AI가 선물과 편지를 구상하는 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI 맞춤 선물 및 카드 생성하기</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

