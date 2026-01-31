import React from 'react';
import { VideoPlayer } from '../atoms/VideoPlayer';

interface VideoStageProps {
  videoSrc: string;
  onVideoEnd?: () => void;
  className?: string;
}

export const VideoStage: React.FC<VideoStageProps> = ({
  videoSrc,
  onVideoEnd,
  className = '',
}) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <VideoPlayer
        src={videoSrc}
        autoPlay={true}
        loop={false}
        onEnded={onVideoEnd}
        className="w-full h-full object-contain"
      />
    </div>
  );
};
