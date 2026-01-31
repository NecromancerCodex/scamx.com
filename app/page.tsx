'use client';

import { useRouter } from 'next/navigation';
import { playButtonClickSound } from '@/utils/sound';

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-300 via-gray-200 to-gray-100 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-full bg-gray-500/30" />
        <div className="absolute top-0 left-1/3 w-1/4 h-3/4 bg-gray-600/30" />
        <div className="absolute top-0 right-0 w-1/3 h-2/3 bg-gray-400/30 rounded-tl-3xl" />
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-gray-400/20 via-gray-300/10 to-transparent">
          <div className="absolute top-10 left-1/4 w-20 h-10 bg-gray-500/20 rounded-full" />
          <div className="absolute top-20 right-1/4 w-16 h-8 bg-gray-500/20 rounded-full" />
        </div>
      </div>
      <div className="relative z-10 flex flex-col gap-6">
        <button
          onClick={() => {
            playButtonClickSound();
            router.push('/game/stage-select');
          }}
          className="px-14 py-5 bg-gray-700 hover:bg-gray-800 text-gray-100 text-xl font-semibold rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-gray-600"
        >
          보이스피싱예방게임
        </button>
        <button
          onClick={() => {
            playButtonClickSound();
            router.push('/scam-agent');
          }}
          className="px-14 py-5 bg-gray-700 hover:bg-gray-800 text-gray-100 text-xl font-semibold rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95 border border-gray-600"
        >
          스캠분류에이전트
        </button>
      </div>
    </div>
  );
}
