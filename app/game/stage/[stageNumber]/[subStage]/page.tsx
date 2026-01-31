'use client';

import { useParams, useRouter } from 'next/navigation';
import { StageScreen } from '@/components/organisms/StageScreen';
import { playButtonClickSound } from '@/utils/sound';

// 챕터별 이벤트 대화 데이터
// 형식: "스테이지.챕터" (예: "1.1" = Stage 1의 Chapter 1)
const chapterEvents: Record<string, { characterName: string; text: string }> = {
  '1.1': {
    characterName: '주디',
    text: '오또케 오또케 프로젝트가 해킹 당했어!!',
  },
  // 다른 챕터 이벤트도 여기에 추가 가능
};

// 챕터별 정답 데이터
const chapterAnswers: Record<string, string> = {
  '1.1': '프론트에 엑세스 토큰과 리프레쉬 토큰을 두지않는다.',
  // 다른 챕터 정답도 여기에 추가 가능
};

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const stageNumber = params?.stageNumber as string; // 스테이지 번호 (1, 2, 3...)
  const chapterNumber = params?.subStage as string; // 챕터 번호 (1, 2, 3...)

  // 챕터 표기: "스테이지.챕터" 형식 (예: "1.1", "1.2", "2.1")
  const chapterId = `${stageNumber}.${chapterNumber}`;
  
  // 파일명 형식: stage1/stage1_1_ask.mp4
  // 스테이지별 폴더에 챕터별 비디오 파일이 있음
  const askVideoSrc = `/stage${stageNumber}/stage${stageNumber}_${chapterNumber}_ask.mp4`;
  const goodVideoSrc = `/stage${stageNumber}/stage${stageNumber}_${chapterNumber}_good.mp4`;
  // bad 비디오 파일명 형식: stage_1_1_bad.mp4 (언더스코어 위치 주의)
  const badVideoSrc = `/stage${stageNumber}/stage_${stageNumber}_${chapterNumber}_bad.mp4`;
  const eventDialogue = chapterEvents[chapterId];
  const correctAnswer = chapterAnswers[chapterId];

  const handleAnswerSubmit = (answer: string, isCorrect: boolean) => {
    // 정답/오답에 따라 good/bad 비디오 재생은 StageScreen에서 처리
  };

  const handleNextChapter = () => {
    playButtonClickSound();
    const nextChapterNumber = parseInt(chapterNumber) + 1;
    router.push(`/game/stage/${stageNumber}/${nextChapterNumber}`);
  };

  return (
    <StageScreen
      eventDialogue={eventDialogue}
      askVideoSrc={askVideoSrc}
      goodVideoSrc={goodVideoSrc}
      badVideoSrc={badVideoSrc}
      correctAnswer={correctAnswer}
      onAnswerSubmit={handleAnswerSubmit}
      onNextChapter={handleNextChapter}
      stageNumber={chapterId}
    />
  );
}
