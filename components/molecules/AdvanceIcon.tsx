import React from 'react';
import { Icon } from '../atoms/Icon';

interface AdvanceIconProps {
  onClick?: () => void;
}

export const AdvanceIcon: React.FC<AdvanceIconProps> = ({ onClick }) => {
  return (
    <div className="absolute right-4 bottom-4">
      <Icon 
        name="advance" 
        className="w-6 h-6 text-white" 
        onClick={onClick}
      />
    </div>
  );
};
