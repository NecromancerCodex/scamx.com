/**
 * 버튼 클릭 사운드 재생 유틸리티
 */
let clickSound: HTMLAudioElement | null = null;

export const playButtonClickSound = () => {
  try {
    // 사운드 객체가 없으면 생성
    if (!clickSound) {
      clickSound = new Audio('/mixkit-select-click-1109.wav');
      clickSound.volume = 0.5; // 볼륨 조절 (0.0 ~ 1.0)
    }
    
    // 현재 재생 중이면 처음부터 다시 재생
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {
      // 재생 실패 시 무시 (사용자가 아직 상호작용하지 않았을 수 있음)
    });
  } catch (error) {
    // 에러 발생 시 무시
  }
};

/**
 * BGM 재생 유틸리티
 */
let bgmSound: HTMLAudioElement | null = null;

export const playBGM = (src: string, volume: number = 0.3) => {
  try {
    // 기존 BGM이 있고 다른 소스면 정지
    if (bgmSound && bgmSound.src !== `${window.location.origin}${src}`) {
      stopBGM();
    }
    
    // BGM 객체가 없거나 다른 소스면 생성
    if (!bgmSound || bgmSound.src !== `${window.location.origin}${src}`) {
      bgmSound = new Audio(src);
      bgmSound.volume = volume;
      bgmSound.loop = true;
    }
    
    // 재생 중이 아니면 재생
    if (bgmSound.paused) {
      bgmSound.play().catch(() => {
        // 재생 실패 시 무시
      });
    }
  } catch (error) {
    // 에러 발생 시 무시
  }
};

export const stopBGM = () => {
  try {
    if (bgmSound) {
      bgmSound.pause();
      bgmSound.currentTime = 0;
    }
  } catch (error) {
    // 에러 발생 시 무시
  }
};
