'use client';

import { useRouter } from 'next/navigation';
import { playButtonClickSound } from '@/utils/sound';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* 카카오톡 스타일 상단 바 */}
      <header
        className="flex items-center justify-center h-14 px-4 shrink-0"
        style={{ backgroundColor: '#FEE500' }}
      >
        <h1 className="text-lg font-bold text-[#3C1E1E] tracking-tight">
          ScamX
        </h1>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <p className="text-[#191919] text-center text-base mb-2 font-medium">
          스캠·피싱 예방을 도와드려요
        </p>
        <p className="text-[#6B6B6B] text-center text-sm mb-10">
          게임으로 배우거나, 메시지를 분석해 보세요
        </p>

        <div className="w-full max-w-sm flex flex-col gap-4">
          {/* 보이스피싱예방게임 - 카카오 노란 버튼 */}
          <button
            onClick={() => {
              playButtonClickSound();
              router.push('/game/stage-select');
            }}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-base text-[#3C1E1E] transition-all active:scale-[0.98] shadow-sm border border-[#E8E8E8] bg-white hover:bg-[#FFFEF7] hover:border-[#FEE500]/40"
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <span className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: '#FEE500' }}>
                🎮
              </span>
              보이스피싱 예방 게임
            </span>
          </button>

          {/* 스캠분류 에이전트 - 카카오 노란 강조 버튼 */}
          <button
            onClick={() => {
              playButtonClickSound();
              router.push('/scam-agent');
            }}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-base text-[#3C1E1E] bg-[#FEE500] hover:bg-[#F5DC00] transition-all active:scale-[0.98] shadow-[0_2px_12px_rgba(254,229,0,0.35)] hover:shadow-[0_4px_16px_rgba(254,229,0,0.4)]"
          >
            <span className="flex items-center justify-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-lg">
                🔍
              </span>
              스캠분류 에이전트
            </span>
          </button>
        </div>

        {/* 관리자 진입만 메인에 노출 */}
        <div className="mt-12 w-full max-w-sm text-center">
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-[#9E9E9E] hover:text-[#3C1E1E] transition-colors"
          >
            관리자
          </button>
        </div>
      </main>
    </div>
  );
}
