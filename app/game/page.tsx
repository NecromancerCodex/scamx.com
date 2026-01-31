'use client';

import { useState } from 'react';
import { GameScreen } from '@/components/templates/GameScreen';

export default function GamePage() {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  
  const dialogues = [
    {
      characterName: '인철',
      text: '응 ? 뭐라고 ? 잘 안들렸는데 .',
    },
    // 추가 대화를 여기에 넣을 수 있습니다
  ];

  const currentDialogue = dialogues[dialogueIndex] || dialogues[0];

  const handleAdvance = () => {
    if (dialogueIndex < dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      // 대화가 끝났을 때의 처리
      console.log('대화 종료');
    }
  };

  const handleUtilityClick = () => {
    // 유틸리티 기능 (스크린샷, 메뉴 등)
    console.log('Utility clicked');
  };

  return (
    <GameScreen
      characterName={currentDialogue.characterName}
      dialogue={currentDialogue.text}
      onDialogueAdvance={handleAdvance}
      onUtilityClick={handleUtilityClick}
    />
  );
}
