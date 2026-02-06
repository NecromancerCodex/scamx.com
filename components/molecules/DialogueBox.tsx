import React from 'react';

interface DialogueBoxProps {
  characterName: string;
  dialogue: string;
  onAdvance?: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  characterName,
  dialogue,
  onAdvance,
}) => {
  return (
    <div
      className="w-full h-full bg-white backdrop-blur-sm rounded-2xl border border-[#E8E8E8] shadow-sm overflow-hidden relative p-6 cursor-pointer"
      onClick={onAdvance}
      onKeyDown={(e) => e.key === 'Enter' && onAdvance?.()}
      role="button"
      tabIndex={0}
    >
      {characterName && (
        <div className="absolute top-6 left-6">
          <span className="inline-block px-3 py-1 rounded-lg font-semibold text-lg text-[#3C1E1E] bg-[#FEE500]">
            {characterName}
          </span>
        </div>
      )}
      <div className="w-full h-full flex items-center justify-center">
        {dialogue ? (
          <p className="text-[#191919] text-xl leading-relaxed text-center px-4">{dialogue}</p>
        ) : (
          <span className="text-[#6B6B6B] text-2xl font-medium">대화 창</span>
        )}
      </div>
    </div>
  );
};
