import React from 'react';
import { Icon } from '../atoms/Icon';

interface UtilityIconProps {
  onClick?: () => void;
}

export const UtilityIcon: React.FC<UtilityIconProps> = ({ onClick }) => {
  return (
    <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg p-2">
      <Icon 
        name="camera" 
        className="w-5 h-5 text-white" 
        onClick={onClick}
      />
    </div>
  );
};
