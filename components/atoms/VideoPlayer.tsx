import React, { useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = true,
  loop = false,
  onEnded,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentSrcRef = useRef<string>('');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // src가 실제로 변경되었을 때만 재생
    if (currentSrcRef.current === src) {
      return;
    }

    currentSrcRef.current = src;

    // 비디오 로드 및 재생
    const loadAndPlay = async () => {
      try {
        // 기존 재생 정지
        video.pause();
        video.currentTime = 0;
        
        // src 설정
        video.src = src;
        video.load();
        
        // autoPlay가 true면 재생
        if (autoPlay) {
          await video.play();
        }
      } catch (err) {
        // 비디오 로드/재생 실패 시 무시
      }
    };

    loadAndPlay();

    // 클린업: 컴포넌트 언마운트 시 완전히 정지
    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.src = '';
        video.load();
        currentSrcRef.current = '';
      }
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      loop={loop}
      onEnded={onEnded}
      className={className}
      playsInline
      preload="none"
    />
  );
};
