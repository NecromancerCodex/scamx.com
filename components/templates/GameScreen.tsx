import React from 'react';
import { GameBackground } from '../organisms/GameBackground';
import { Character3D } from '../organisms/Character3D';
import { DialogueSystem } from '../organisms/DialogueSystem';

interface GameScreenProps {
  characterName: string;
  dialogue: string;
  onDialogueAdvance?: () => void;
  onUtilityClick?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  characterName,
  dialogue,
  onDialogueAdvance,
  onUtilityClick,
}) => {
  return (
    <GameBackground>
      <Character3D />
      <DialogueSystem
        characterName={characterName}
        dialogue={dialogue}
        onAdvance={onDialogueAdvance}
        onUtilityClick={onUtilityClick}
      />
    </GameBackground>
  );
};
