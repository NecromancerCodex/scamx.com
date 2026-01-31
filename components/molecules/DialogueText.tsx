import React from 'react';
import { Text } from '../atoms/Text';

interface DialogueTextProps {
  text: string;
}

export const DialogueText: React.FC<DialogueTextProps> = ({ text }) => {
  return (
    <div className="px-4 py-3">
      <Text className="text-white leading-relaxed" size="lg">
        {text}
      </Text>
    </div>
  );
};
