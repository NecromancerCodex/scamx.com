'use client';

import { useParams, useRouter } from 'next/navigation';
import { StageScreen } from '@/components/organisms/StageScreen';

// 스테이지별 이벤트 대화 데이터
const stageEvents: Record<string, { characterName: string; text: string }> = {
  '1.1': {
    characterName: '인철',
    text: '해킹당했어 어또케 어또케',
  },
  // 다른 스테이지 이벤트도 여기에 추가 가능
};

export default function StagePage() {
  const params = useParams();
  const router = useRouter();
  const stage = params?.stage as string;

  // stage는 "1.1", "1.2", ... "1.10" 형식
  const stageNumber = stage || '1.1';
  // 파일명 형식: stage1_1_ask.mp4
  const askVideoSrc = `/stage1/stage1_${stageNumber.replace('.', '_')}_ask.mp4`;
  const eventDialogue = stageEvents[stageNumber];

  const handleAnswerSubmit = (answer: string) => {
    console.log(`Stage ${stageNumber} 답변:`, answer);
    // 답변 처리 로직
    // 정답이면 good 비디오, 오답이면 bad 비디오 재생
    // 또는 다음 스테이지로 이동
  };

  return (
    <StageScreen
      eventDialogue={eventDialogue}
      askVideoSrc={askVideoSrc}
      onAnswerSubmit={handleAnswerSubmit}
      stageNumber={stageNumber}
    />
  );
}
