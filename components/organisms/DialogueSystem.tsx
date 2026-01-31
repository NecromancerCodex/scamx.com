import React from 'react';
import { DialogueBox } from '../molecules/DialogueBox';
import { UtilityIcon } from '../molecules/UtilityIcon';

interface DialogueSystemProps {
  characterName: string;
  dialogue: string;
  onAdvance?: () => void;
  onUtilityClick?: () => void;
}

export const DialogueSystem: React.FC<DialogueSystemProps> = ({
  characterName,
  dialogue,
  onAdvance,
  onUtilityClick,
}) => {
  return (
    <>
      <DialogueBox
        characterName={characterName}
        dialogue={dialogue}
        onAdvance={onAdvance}
      />
      <UtilityIcon onClick={onUtilityClick} />
    </>
  );
};
