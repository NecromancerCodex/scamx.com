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
    <div className="relative w-full h-screen bg-gray-200 overflow-hidden flex items-center justify-center">
      {/* 단색 배경 */}
      
      {/* 메인 콘텐츠 컨테이너 */}
      <div className="w-full max-w-6xl px-8 py-12">
        {/* 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            스테이지 선택
          </h1>
        </div>
        
        {/* 스테이지 그리드 - 5열 2행, 균일한 크기 */}
        <div className="grid grid-cols-5 gap-5 mb-10">
          {stages.map((stage) => {
            const locked = isLocked(stage);
            return (
              <button
                key={stage}
                onClick={() => handleStageSelect(stage)}
                disabled={locked}
                className={`
                  aspect-square rounded-xl shadow-lg transition-all duration-200 
                  flex flex-col items-center justify-center relative
                  ${locked 
                    ? 'bg-gray-500 cursor-not-allowed opacity-60' 
                    : 'bg-gray-700 hover:bg-gray-800 text-white hover:shadow-xl hover:scale-105 active:scale-95'
                  }
                `}
              >
                {locked ? (
                  <>
                    {/* 잠금 아이콘 */}
                    <svg 
                      className="w-12 h-12 text-gray-400 mb-2" 
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
                    <span className="text-gray-400 text-lg font-semibold">
                      Stage {stage}
                    </span>
                  </>
                ) : (
                  <span className="text-xl font-semibold">
                    Stage {stage}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={handleBack}
            className="px-10 py-3 bg-gray-600 hover:bg-gray-700 text-white text-lg font-medium rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
}
