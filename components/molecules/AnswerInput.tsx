import React from 'react';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = '답변을 입력하세요...',
  disabled = false,
}) => {
  return (
    <div className="w-full h-full bg-teal-700/90 backdrop-blur-sm rounded-xl flex flex-col border-2 border-teal-600/70 shadow-2xl relative overflow-hidden">
      {/* 대화 창 텍스트 - 중앙 상단 */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-white text-2xl font-medium">대화 창</span>
      </div>
      
      {/* 정답 인풋 박스 - 대화창 중앙 하단에 배치 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[70%]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-6 py-4 bg-orange-500 text-white text-center text-lg font-medium rounded-lg border-2 border-orange-600 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
    </div>
  );
};
