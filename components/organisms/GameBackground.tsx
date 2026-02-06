import React from 'react';

interface GameBackgroundProps {
  children: React.ReactNode;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({ children }) => {
  return (
    <div className="relative w-full h-screen bg-[#FAFAFA] overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 w-1/3 h-full bg-[#F5F5F5]"></div>
        <div className="absolute left-1/3 top-0 w-1/4 h-3/4 bg-[#EEEEEE]"></div>
        <div className="absolute right-0 top-0 w-1/3 h-2/3 bg-[#F0F0F0] rounded-tl-3xl"></div>
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#FEE500]/10 to-transparent">
          <div className="absolute top-10 left-1/4 w-20 h-10 bg-[#FEE500]/20 rounded-full"></div>
          <div className="absolute top-20 right-1/4 w-16 h-8 bg-[#FEE500]/15 rounded-full"></div>
        </div>
      </div>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
