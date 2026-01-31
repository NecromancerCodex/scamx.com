import React from 'react';

interface CharacterNameProps {
  name: string;
}

export const CharacterName: React.FC<CharacterNameProps> = ({ name }) => {
  return (
    <div className="bg-gray-600/90 px-4 py-2 rounded-tl-lg rounded-tr-lg border-b border-gray-500/50">
      <span className="text-gray-100 font-medium">{name}</span>
    </div>
  );
};
