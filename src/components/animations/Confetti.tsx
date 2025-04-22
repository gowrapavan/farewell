import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ trigger }) => {
  const fireConfetti = useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF577F', '#FF884B', '#FFBD4A', '#FFE15D'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#4D96FF', '#6C63FF', '#9C9EFE', '#A66CFF'],
      });
    }, 250);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (trigger) {
      fireConfetti();
    }
  }, [trigger, fireConfetti]);
  
  return null;
};

export default Confetti;