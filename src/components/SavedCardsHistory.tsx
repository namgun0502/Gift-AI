import React from "react";
import { Bookmark, Trash2, Calendar, User, Gift, ArrowRight } from "lucide-react";
import { SavedCard } from "../types";

interface SavedCardsHistoryProps {
  savedCards: SavedCard[];
  onSelectSavedCard: (card: SavedCard) => void;
  onDeleteSavedCard: (id: string) => void;
  onClearAll: () => void;
}

export const SavedCardsHistory: React.FC<SavedCardsHistoryProps> = ({
  savedCards,
  onSelectSavedCard,
  onDeleteSavedCard,
  onClearAll,
}) => {
  const [showConfirmClear, setShowConfirmClear] = React.useState(false);

  if (savedCards.length === 0) {
    return (
      <div className="bg-white rounded-none p-10 text-center border border-black/10 shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-none border border-black/20 bg-[#F9F7F2] text-black/80 flex items-center justify-center mx-auto">
          <Bookmark className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#1A1A1A]">
          보관함에 저장된 카드가 없습니다
        </h3>
        <p className="text-xs text-black/60 max-w-sm mx-auto">
          마음에 드는 선물 추천과 모바일 카드가 있다면 하단의 [보관함 저장] 버튼을 눌러 보관해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-none p-6 sm:p-8 shadow-sm border border-black/10 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-4">
        <div className="flex items-center space-x-2">
          <Bookmark className="w-5 h-5 text-black/80" />
          <h2 className="text-xl font-bold text-[#1A1A1A]">
            카드 보관함 ({savedCards.length}개)
          </h2>
        </div>

        {showConfirmClear ? (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 px-3 py-1.5">
            <span className="text-xs font-bold text-red-800">모두 삭제하시겠습니까?</span>
            <button
              onClick={() => {
                onClearAll();
                setShowConfirmClear(false);
              }}
              className="text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-2.5 py-0.5 transition cursor-pointer"
            >
              삭제
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              className="text-xs font-medium text-black/70 hover:text-black px-1.5 cursor-pointer"
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmClear(true)}
            className="text-xs font-bold tracking-wider text-black/40 hover:text-red-600 transition cursor-pointer"
          >
            전체 삭제
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedCards.map((item) => {
          const selectedLetter =
            item.response.cardLetters[item.selectedLetterType] ||
            item.response.cardLetters.emotional;

          return (
            <div
              key={item.id}
              className="bg-[#F9F7F2] hover:bg-[#F3EFE6] rounded-none p-5 border border-black/15 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-black/50 mb-2">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                  <span className="px-2 py-0.5 rounded-none bg-black text-white font-bold text-[9px] uppercase tracking-wider">
                    {item.request.occasion}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1A1A1A] mb-1">
                  <User className="w-3.5 h-3.5 text-black/70" />
                  <span className="font-editorial-serif text-sm">
                    To. {item.request.recipientName || item.request.relationship}
                  </span>
                  <span className="text-black/50 font-sans font-normal text-xs">
                    ({item.request.ageGender})
                  </span>
                </div>

                <div className="text-xs space-y-1.5 my-3">
                  <p className="line-clamp-1 font-semibold text-amber-900 flex items-center">
                    <Gift className="w-3 h-3 mr-1 shrink-0" />
                    추천 1순위: {item.response.giftRecommendations[0]?.title}
                  </p>
                  <p className="line-clamp-2 text-black/80 font-editorial-serif italic text-xs bg-white p-3 border border-black/10">
                    "{selectedLetter}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between">
                <button
                  onClick={() => onSelectSavedCard(item)}
                  className="inline-flex items-center text-xs font-bold tracking-wider text-black hover:underline cursor-pointer"
                >
                  <span>다시 보기 / 카드 열기</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>

                <button
                  onClick={() => onDeleteSavedCard(item.id)}
                  className="text-black/40 hover:text-red-600 p-1 rounded transition cursor-pointer"
                  title="삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
