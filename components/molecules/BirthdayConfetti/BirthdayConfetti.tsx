import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface BirthdayConfettiProps {
  delay?: number;
  reset?: () => void;
}

const BirthdayConfetti: React.FC<BirthdayConfettiProps> = ({ delay = 0, reset }) => {
  useEffect(() => {
    if (!reset) confetti.reset();

    const timer = setTimeout(() => {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        void confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        void confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, reset]);

  return null;
};

export default BirthdayConfetti;
