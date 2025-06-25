// utils/sounds.ts
export const playMessageSound = () => {
  const audio = new Audio('/sounds/message-sound.mp3');
  audio.volume = 0.5; 
  audio.play().catch(e => console.log("Ses çalınamadı:", e));
};