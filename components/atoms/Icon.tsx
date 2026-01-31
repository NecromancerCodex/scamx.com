import React from 'react';

interface IconProps {
  name: 'advance' | 'camera';
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', onClick }) => {
  const iconMap = {
    advance: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
      </svg>
    ),
    camera: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 12.5c1.38 0 2.5-1.12 2.5-2.5S13.38 7.5 12 7.5 9.5 8.62 9.5 10s1.12 2.5 2.5 2.5zm0-3.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
        <path d="M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65H8.88c-.56 0-1.1.24-1.47.65L6.17 6H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 14H3V8h18v12z" />
      </svg>
    ),
  };

  return (
    <div onClick={onClick} className={onClick ? 'cursor-pointer' : ''}>
      {iconMap[name]}
    </div>
  );
};
