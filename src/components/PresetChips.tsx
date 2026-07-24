import React from "react";

interface PresetChipsProps {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  allowCustom?: boolean;
}

export const PresetChips: React.FC<PresetChipsProps> = ({
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <div className="flex flex-wrap gap-1.5 my-2">
      {options.map((opt) => {
        const isSelected = selectedValue === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(isSelected ? "" : opt)}
            className={`px-3 py-1 rounded-none text-xs font-medium transition-all duration-150 cursor-pointer ${
              isSelected
                ? "bg-[#1A1A1A] text-white border border-black shadow-xs font-semibold"
                : "bg-white text-black/70 border border-black/15 hover:border-black/40 hover:bg-[#F2EFE9]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};
