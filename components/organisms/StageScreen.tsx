import React, { useState, useEffect } from 'react';
import { VideoStage } from '../molecules/VideoStage';
import { DialogueBox } from '../molecules/DialogueBox';
import { playButtonClickSound, playBGM, stopBGM } from '@/utils/sound';

interface StageScreenProps {
  eventDialogue?: {
    characterName: string;
    text: string;
  };
  askVideoSrc: string;
  goodVideoSrc?: string;
  badVideoSrc?: string;
  correctAnswer?: string;
  onAnswerSubmit: (answer: string, isCorrect: boolean) => void;
  onNextChapter?: () => void;
  stageNumber: string;
}

type GamePhase = 'event' | 'ask' | 'input' | 'result' | 'complete';

export const StageScreen: React.FC<StageScreenProps> = ({
  eventDialogue,
  askVideoSrc,
  goodVideoSrc,
  badVideoSrc,
  correctAnswer,
  onAnswerSubmit,
  onNextChapter,
  stageNumber,
}) => {
  const [phase, setPhase] = useState<GamePhase>(eventDialogue ? 'event' : 'ask');
  const [resultVideoSrc, setResultVideoSrc] = useState<string>('');
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  // 스테이지 1일 때 BGM 재생
  useEffect(() => {
    const stageNum = stageNumber.split('.')[0];
    if (stageNum === '1') {
      playBGM('/dark-cyberpunk-i-free-background-music-i-free-music-lab-release-469493.mp3', 0.3);
    }

    // 컴포넌트 언마운트 시 BGM 정지
    return () => {
      const currentStageNum = stageNumber.split('.')[0];
      if (currentStageNum === '1') {
        stopBGM();
      }
    };
  }, [stageNumber]);

  const handleAskVideoEnd = () => {
    setPhase('input');
  };

  const handleResultVideoEnd = () => {
    setPhase('complete');
  };

  // O/X 퀴즈: 의심스러운 전화인가요?
  const isOXQuiz = correctAnswer && ['O', 'X'].includes(correctAnswer.trim().toUpperCase());

  const handleOXSelect = (choice: 'O' | 'X') => {
    playButtonClickSound();
    const expected = correctAnswer?.trim().toUpperCase() as 'O' | 'X';
    const isCorrect = expected === choice;

    setIsCorrectAnswer(isCorrect);

    if (isCorrect && goodVideoSrc) {
      setResultVideoSrc(goodVideoSrc);
      setPhase('result');
    } else if (!isCorrect && badVideoSrc) {
      setResultVideoSrc(badVideoSrc);
      setPhase('result');
    }

    onAnswerSubmit(choice, isCorrect);
  };

  const handleRetry = () => {
    playButtonClickSound();
    setIsCorrectAnswer(false);
    setResultVideoSrc('');
    setReplayCount(prev => prev + 1);
    setPhase(eventDialogue ? 'event' : 'ask');
  };

  const handleReplayQuestion = () => {
    playButtonClickSound();
    setReplayCount(prev => prev + 1);
    setPhase(eventDialogue ? 'event' : 'ask');
  };

  // 현재 표시할 비디오 결정
  let currentVideoSrc = '';
  let onVideoEnd = () => {};
  
  if (phase === 'event' || phase === 'ask' || phase === 'input') {
    currentVideoSrc = askVideoSrc;
    onVideoEnd = handleAskVideoEnd;
  } else if (phase === 'result' || phase === 'complete') {
    currentVideoSrc = resultVideoSrc;
    onVideoEnd = handleResultVideoEnd;
  }

  // 대화 표시 여부
  const showDialogue = phase === 'event' && eventDialogue;
  const showEmptyDialogue = phase === 'input';
  const showSuccessDialogue = (phase === 'result' || phase === 'complete') && isCorrectAnswer;
  const showFailDialogue = (phase === 'result' || phase === 'complete') && !isCorrectAnswer;
  
  // 입력창 표시 여부
  const showInput = phase === 'event' || phase === 'input';
  
  // 다음 챕터 버튼 표시 여부
  const showNextButton = phase === 'complete' && isCorrectAnswer;
  
  // 다시 시도 버튼 표시 여부
  const showRetryButton = phase === 'complete' && !isCorrectAnswer;
  
  // 문제 다시보기 버튼 표시 여부
  const showReplayButton = phase === 'input';

  return (
    <div className="relative w-full h-screen bg-[#FAFAFA] overflow-hidden flex flex-col">
      {/* 상단: 동영상 재생 영역 */}
      {currentVideoSrc && (
        <div className="flex-[0.65] flex items-center justify-center pt-8 pb-4 min-h-0 relative">
          <div className="w-[75%] h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E8E8E8]">
            <VideoStage
              key={`${currentVideoSrc}-${replayCount}`}
              videoSrc={currentVideoSrc}
              onVideoEnd={onVideoEnd}
              className="w-full h-full"
            />
          </div>
          {/* 문제 다시보기 버튼 - 비디오 영역 우측 상단 */}
          {showReplayButton && (
            <button
              onClick={handleReplayQuestion}
              className="absolute top-12 right-[14%] px-6 py-2 text-[#3C1E1E] text-sm font-semibold rounded-xl shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 border border-[#E8E8E8] bg-white"
              style={{ backgroundColor: '#FEE500' }}
            >
              문제 다시보기
            </button>
          )}
        </div>
      )}
      
      {/* 하단: 대화 창 */}
      {showDialogue && (
        <div className="flex-[0.25] w-[75%] mx-auto mb-4 min-h-[200px] flex-shrink-0">
          <DialogueBox
            characterName={eventDialogue.characterName}
            dialogue={eventDialogue.text}
          />
        </div>
      )}
      
      {showEmptyDialogue && (
        <div className="flex-[0.25] w-[75%] mx-auto mb-4 min-h-[120px] flex-shrink-0">
          <DialogueBox characterName="퀴즈" dialogue="의심스러운 전화인가요?" />
        </div>
      )}
      
      {showSuccessDialogue && (
        <div className="flex-[0.25] w-[75%] mx-auto mb-4 min-h-[200px] flex-shrink-0">
          <DialogueBox
            characterName="정답"
            dialogue="잘했어요! 보이스피싱에 속지 않았어요. 금전 요구 시 반드시 본인 확인을 하세요."
          />
        </div>
      )}
      
      {showFailDialogue && (
        <div className="flex-[0.25] w-[75%] mx-auto mb-4 min-h-[200px] flex-shrink-0">
          <DialogueBox
            characterName="주의"
            dialogue="조심하세요. 금전을 요구하는 전화는 보이스피싱일 수 있어요. 직접 만나서 확인한 뒤에만 도와주세요."
          />
        </div>
      )}
      
      {/* O/X 퀴즈 버튼 */}
      {showInput && isOXQuiz && (
        <div className="w-[75%] mx-auto mb-6 flex justify-center gap-6">
          <button
            type="button"
            onClick={() => handleOXSelect('O')}
            className="w-28 h-28 rounded-full text-4xl font-bold text-[#3C1E1E] shadow-sm border-2 border-[#E8E8E8] transition-all hover:scale-105 active:scale-95 hover:border-[#FEE500]/60"
            style={{ backgroundColor: '#FEE500' }}
          >
            O
          </button>
          <button
            type="button"
            onClick={() => handleOXSelect('X')}
            className="w-28 h-28 rounded-full text-4xl font-bold text-[#3C1E1E] bg-white shadow-sm border-2 border-[#E8E8E8] transition-all hover:scale-105 active:scale-95 hover:bg-[#FFFEF7] hover:border-[#FEE500]/40"
          >
            X
          </button>
        </div>
      )}
      
      {/* 다음 챕터 버튼 */}
      {showNextButton && onNextChapter && (
        <div className="w-[75%] mx-auto mb-6 flex justify-center">
          <button
            onClick={onNextChapter}
            className="px-10 py-4 text-[#3C1E1E] text-xl font-semibold rounded-2xl shadow-sm transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#FEE500' }}
          >
            다음 챕터로 이동
          </button>
        </div>
      )}
      
      {/* 다시 시도 버튼 */}
      {showRetryButton && (
        <div className="w-[75%] mx-auto mb-6 flex justify-center">
          <button
            onClick={handleRetry}
            className="px-10 py-4 bg-white text-[#3C1E1E] text-xl font-semibold rounded-2xl shadow-sm border border-[#E8E8E8] transition-all duration-200 hover:bg-[#FFFEF7] hover:border-[#FEE500]/40 active:scale-95"
          >
            다시 시도하기
          </button>
        </div>
      )}
      
      {/* 챕터 번호 표시 */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#3C1E1E] px-4 py-2 rounded-xl z-20 border border-[#E8E8E8] shadow-sm">
        <span className="text-lg font-semibold">Chapter {stageNumber}</span>
      </div>
    </div>
  );
};
