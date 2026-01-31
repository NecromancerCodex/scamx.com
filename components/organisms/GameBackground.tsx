import React from 'react';

interface GameBackgroundProps {
  children: React.ReactNode;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({ children }) => {
  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100 overflow-hidden">
      {/* 배경 요소들 - 우울하고 걱정스러운 분위기 */}
      <div className="absolute inset-0">
        {/* 왼쪽 건물 - 어두운 회색 */}
        <div className="absolute left-0 top-0 w-1/3 h-full bg-gray-500/30">
          <div className="absolute top-10 left-4 w-8 h-10 bg-gray-600/40 rounded"></div>
          <div className="absolute top-24 left-4 w-8 h-10 bg-gray-600/40 rounded"></div>
          <div className="absolute top-10 left-16 w-8 h-10 bg-gray-600/40 rounded"></div>
          <div className="absolute top-24 left-16 w-8 h-10 bg-gray-600/40 rounded"></div>
        </div>
        
        {/* 중앙 건물 - 더 어두운 회색 */}
        <div className="absolute left-1/3 top-0 w-1/4 h-3/4 bg-gray-600/30">
          <div className="absolute top-20 left-4 w-6 h-8 bg-gray-700/40 rounded"></div>
          <div className="absolute top-32 left-4 w-6 h-8 bg-gray-700/40 rounded"></div>
        </div>
        
        {/* 오른쪽 건물 - 탈색된 회색 */}
        <div className="absolute right-0 top-0 w-1/3 h-2/3 bg-gray-400/30 rounded-tl-3xl">
          <div className="absolute top-16 right-8 w-12 h-12 bg-gray-500/40 rounded-full"></div>
          <div className="absolute top-32 right-4 w-10 h-8 bg-gray-600/40 rounded"></div>
        </div>
        
        {/* 하늘 - 탈색된 회색/보라색 톤 */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-400/20 via-gray-300/10 to-transparent">
          <div className="absolute top-10 left-1/4 w-20 h-10 bg-gray-500/20 rounded-full"></div>
          <div className="absolute top-20 right-1/4 w-16 h-8 bg-gray-500/20 rounded-full"></div>
        </div>
      </div>
      
      {/* 콘텐츠 */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
