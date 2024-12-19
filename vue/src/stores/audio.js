import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAudioStore = defineStore('audio', () => {
  // Reactive state properties
  const isMuted = ref(false);
  const backgroundMusic = new Audio('/public/audio/background-music.mp3');
  const victorySound = new Audio('/public/audio/victory-sfx.mp3');

  // Initialization logic
  const init = () => {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
    victorySound.volume = 1;
  };

  // Play background music
  const playBackgroundMusic = () => {
    backgroundMusic.currentTime = 0;
    if (!isMuted.value) {
      backgroundMusic.play().catch((err) => {
        console.warn('Autoplay Blocked:', err);
      });
    }
  };

  // Stop background music
  const stopBackgroundMusic = () => {
    backgroundMusic.pause();
  };

  // Play victory sound
  const playVictorySound = () => {
    if (!isMuted.value) {
      victorySound.play().catch((err) => {
        console.warn('Autoplay Blocked:', err);
      });
    }
  };

  // Toggle mute
  const toggleMute = () => {
    isMuted.value = !isMuted.value;
    backgroundMusic.muted = isMuted.value;
    victorySound.muted = isMuted.value;
  };

  // Computed property to get mute status
  const isAudioMuted = computed(() => isMuted.value);

  // Initialize the audio settings when the store is created
  init();

  // Return all reactive properties and methods
  return {
    isMuted,
    backgroundMusic,
    victorySound,
    playBackgroundMusic,
    stopBackgroundMusic,
    playVictorySound,
    toggleMute,
    isAudioMuted,
  };
});
