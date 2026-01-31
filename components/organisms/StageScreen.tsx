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
  const [answer, setAnswer] = useState('');
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

  const handleSubmit = () => {
    if (!answer.trim()) return;
    
    const trimmedAnswer = answer.trim();
    const isCorrect = correctAnswer ? trimmedAnswer === correctAnswer.trim() : false;
    
    setIsCorrectAnswer(isCorrect);
    
    // 정답/오답에 따라 결과 비디오 설정
    if (isCorrect && goodVideoSrc) {
      setResultVideoSrc(goodVideoSrc);
      setPhase('result');
    } else if (!isCorrect && badVideoSrc) {
      setResultVideoSrc(badVideoSrc);
      setPhase('result');
    }
    
    onAnswerSubmit(trimmedAnswer, isCorrect);
    setAnswer('');
  };

  const handleRetry = () => {
    playButtonClickSound();
    // 처음 상태로 리셋
    setAnswer('');
    setIsCorrectAnswer(false);
    setResultVideoSrc('');
    setReplayCount(prev => prev + 1);
    setPhase(eventDialogue ? 'event' : 'ask');
  };

  const handleReplayQuestion = () => {
    playButtonClickSound();
    // 문제 다시보기: 이벤트 대화와 ask 비디오 다시 재생
    setAnswer('');
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
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex flex-col">
      {/* 상단: 동영상 재생 영역 */}
      {currentVideoSrc && (
        <div className="flex-[0.65] flex items-center justify-center pt-8 pb-4 min-h-0 relative">
          <div className="w-[75%] h-full bg-gradient-to-br from-gray-700 via-gray-600 to-gray-700 rounded-xl overflow-hidden shadow-2xl border border-gray-500/30">
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
              className="absolute top-12 right-[14%] px-6 py-2 bg-gradient-to-r from-gray-700/90 to-gray-600/90 hover:from-gray-600 hover:to-gray-500 text-white text-sm font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-gray-500/50 backdrop-blur-sm"
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
        <div className="flex-[0.25] w-[75%] mx-auto mb-4 min-h-[200px] flex-shrink-0">
          <DialogueBox characterName="주디" dialogue="어떻게 해결하면 좋을까...?" />
        </div>
      )}
      
      {showSuccessDialogue && (
        <div className="flex-[0.25] w-[75%] mx-auto mb-4 min-h-[200px] flex-shrink-0">
          <DialogueBox
            characterName="주디"
            dialogue="고마워 너덕분에 앞으로 실수 안할꺼같아"
          />
        </div>
      )}
      
      {showFailDialogue && (
        <div className="flex-[0.25] w-[75%] mx-auto mb-4 min-h-[200px] flex-shrink-0">
          <DialogueBox
            characterName="주디"
            dialogue="어쩔 수 없지 뭐... 나랑 이 직업이 안맞나봐....."
          />
        </div>
      )}
      
      {/* 정답 입력창 */}
      {showInput && (
        <div className="w-[75%] mx-auto mb-6">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            placeholder="답변을 입력하세요..."
            className="w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-500 text-white text-center text-lg font-medium rounded-lg border-2 border-gray-400/50 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-300 shadow-lg transition-all hover:from-gray-500 hover:to-gray-400"
          />
        </div>
      )}
      
      {/* 다음 챕터 버튼 */}
      {showNextButton && onNextChapter && (
        <div className="w-[75%] mx-auto mb-6 flex justify-center">
          <button
            onClick={onNextChapter}
            className="px-10 py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white text-xl font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-gray-500/50"
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
            className="px-10 py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white text-xl font-semibold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 border-2 border-gray-500/50"
          >
            다시 시도하기
          </button>
        </div>
      )}
      
      {/* 챕터 번호 표시 */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg z-20 border border-gray-600/50 shadow-lg">
        <span className="text-lg font-semibold">Chapter {stageNumber}</span>
      </div>
    </div>
  );
};
