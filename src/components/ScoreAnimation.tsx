import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ScoreAnimationProps {
  playerName: string;
  show: boolean;
  onComplete: () => void;
}

export default function ScoreAnimation({ playerName, show, onComplete }: ScoreAnimationProps) {
  useEffect(() => {
    if (!show) return;

    confetti({
      particleCount: 60,
      spread: 90,
      startVelocity: 35,
      origin: { y: 0.4 },
      colors: ['#fbbf24', '#f59e0b', '#fde68a', '#f43f5e'],
    });

    const timer = setTimeout(onComplete, 2400);
    return () => clearTimeout(timer);
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-40"
      role="status"
      aria-live="polite"
    >
      <motion.span
        aria-hidden="true"
        className="absolute text-6xl"
        initial={{ x: '-60vw', y: '20vh', rotate: -20, opacity: 0 }}
        animate={{ x: '60vw', y: '-25vh', rotate: 25, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.2, ease: 'easeInOut' }}
      >
        🌙
      </motion.span>
      <motion.div
        className="bg-felt-900/90 border border-yellow-500/40 px-8 py-6 rounded-xl text-center shadow-card"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <p className="text-3xl mb-2" aria-hidden="true">
          🤤🌙
        </p>
        <p className="text-white text-lg font-semibold">{playerName} ate the moon!</p>
      </motion.div>
    </div>
  );
}
