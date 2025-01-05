import React, { useEffect, useState } from 'react';
import { Moon } from 'lucide-react';

interface ScoreAnimationProps {
  playerName: string;
  show: boolean;
  onComplete: () => void;
}

export default function ScoreAnimation({ playerName, show, onComplete }: ScoreAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show && !isAnimating) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div className="bg-gray-900/80 p-6 rounded-lg text-center animate-bounce">
        <Moon className="w-12 h-12 mx-auto mb-2 text-yellow-400" />
        <p className="text-white text-lg">
          {playerName} ate the moon!
        </p>
      </div>
    </div>
  );
}