import React from 'react';

interface DialogueBoxProps {
  characterName: string;
  dialogue: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  characterName,
  dialogue,
}) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 backdrop-blur-sm rounded-xl border-2 border-gray-500/50 shadow-2xl overflow-hidden relative p-6">
      {/* 캐릭터 이름 - 상단 왼쪽 */}
      {characterName && (
        <div className="absolute top-6 left-6">
          <span className="text-white font-semibold text-xl drop-shadow-lg">{characterName}</span>
        </div>
      )}
      
      {/* 대사 - 정확히 중앙 */}
      <div className="w-full h-full flex items-center justify-center">
        {dialogue ? (
          <p className="text-white text-xl leading-relaxed drop-shadow-md text-center px-4">{dialogue}</p>
        ) : (
          <span className="text-white text-2xl font-medium drop-shadow-lg">대화 창</span>
        )}
      </div>
    </div>
  );
};
