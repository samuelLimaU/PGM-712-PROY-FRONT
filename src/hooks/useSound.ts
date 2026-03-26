let isUnlocked = false;

export const useSound = () => {
  const unlockAudio = () => {
    if (isUnlocked) return;

    const audio = new Audio("/sounds/click_btn_ui.mp3");
    audio.volume = 0;
    audio.play().then(() => {
      isUnlocked = true;
    }).catch(() => {});
  };

  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const playClick = () => playSound("/sounds/click_btn_ui.mp3");

  return {
    playClick,
    unlockAudio,
  };
};