'use client';

import { useRouter } from 'next/navigation';
import { playButtonClickSound } from '@/utils/sound';

export default function StageSelectPage() {
  const router = useRouter();

  const stages = Array.from({ length: 10 }, (_, i) => i + 1);
  const unlockedStages = [1]; // 잠금 해제된 스테이지 목록

  const handleStageSelect = (stageNumber: number) => {
    // 잠금 해제된 스테이지만 선택 가능
    if (!unlockedStages.includes(stageNumber)) {
      return;
    }
    playButtonClickSound();
    // 스테이지를 선택하면 해당 스테이지의 첫 번째 챕터로 이동
    router.push(`/game/stage/${stageNumber}/1`);
  };

  const handleBack = () => {
    playButtonClickSound();
    router.push('/');
  };

  const isLocked = (stageNumber: number) => {
    return !unlockedStages.includes(stageNumber);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header
        className="flex items-center justify-center h-14 px-4 shrink-0"
        style={{ backgroundColor: '#FEE500' }}
      >
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-4 text-sm text-[#3C1E1E] hover:underline"
        >
          ← 처음으로
        </button>
        <h1 className="text-lg font-bold text-[#3C1E1E] tracking-tight">
          보이스피싱 예방 게임
        </h1>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-8 py-10">
        <div className="text-center mb-10">
          <h2 className="text-xl font-semibold text-[#191919]">스테이지 선택</h2>
          <p className="text-sm text-[#6B6B6B] mt-1">챕터를 선택하세요</p>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-10">
          {stages.map((stage) => {
            const locked = isLocked(stage);
            return (
              <button
                key={stage}
                onClick={() => handleStageSelect(stage)}
                disabled={locked}
                className={`
                  aspect-square rounded-2xl shadow-sm transition-all duration-200 
                  flex flex-col items-center justify-center relative border
                  ${locked 
                    ? 'bg-[#EEEEEE] border-[#E8E8E8] cursor-not-allowed opacity-70' 
                    : 'bg-white border-[#E8E8E8] hover:border-[#FEE500]/50 hover:bg-[#FFFEF7] text-[#3C1E1E] hover:shadow-md hover:scale-105 active:scale-95'
                  }
                `}
              >
                {locked ? (
                  <>
                    <svg 
                      className="w-10 h-10 text-[#9E9E9E] mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                      />
                    </svg>
                    <span className="text-[#9E9E9E] text-base font-semibold">
                      Stage {stage}
                    </span>
                  </>
                ) : (
                  <>
                    <span 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1"
                      style={{ backgroundColor: '#FEE500' }}
                    >
                      🎮
                    </span>
                    <span className="text-lg font-semibold text-[#3C1E1E]">
                      Stage {stage}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleBack}
            className="px-8 py-3 text-[#3C1E1E] text-base font-semibold rounded-2xl shadow-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#FEE500' }}
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
}
