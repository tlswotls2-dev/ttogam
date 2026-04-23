import { useCallback, useMemo, useRef } from 'react';

const SOUND_URLS = {
  discover: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  reward: 'https://assets.mixkit.co/active_storage/sfx/1430/1430-preview.mp3',
};

const createFallbackTone = (frequency = 660, durationMs = 120) => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.05;

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + durationMs / 1000);
};

/**
 * 이벤트별 사운드 재생 훅입니다.
 * 네트워크/기기 제약으로 오디오 재생이 실패하면 짧은 톤으로 대체합니다.
 */
export function useSound() {
  const audioRef = useRef({});

  const getAudio = useCallback((eventType) => {
    if (!audioRef.current[eventType]) {
      audioRef.current[eventType] = new Audio(SOUND_URLS[eventType]);
      audioRef.current[eventType].preload = 'auto';
      audioRef.current[eventType].volume = 0.5;
    }
    return audioRef.current[eventType];
  }, []);

  const play = useCallback(
    async (eventType) => {
      try {
        const audio = getAudio(eventType);
        audio.currentTime = 0;
        await audio.play();
      } catch {
        if (eventType === 'reward') createFallbackTone(520, 180);
        else if (eventType === 'success') createFallbackTone(760, 220);
        else createFallbackTone(640, 140);
      }
    },
    [getAudio],
  );

  return useMemo(() => ({ play }), [play]);
}
