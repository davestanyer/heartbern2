import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Share2, Check } from 'lucide-react';
import { Player } from '../types';
import { formatGameSummary, shareGameSummary } from '../utils/share';
import ModalOverlay from './ModalOverlay';

interface GameOverProps {
  players: Player[];
  roundsPlayed: number;
  endGameTarget: number;
  onRestart: () => void;
}

const medals = ['🥇', '🥈', '🥉'];

export default function GameOver({
  players,
  roundsPlayed,
  endGameTarget,
  onRestart,
}: GameOverProps) {
  const [shareState, setShareState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const standings = [...players].sort((a, b) => a.totalScore - b.totalScore);
  const winner = standings[0];

  useEffect(() => {
    const burst = (originX: number) =>
      confetti({
        particleCount: 90,
        spread: 70,
        startVelocity: 45,
        origin: { x: originX, y: 0.7 },
        colors: ['#f43f5e', '#fbbf24', '#34d399', '#f8fafc'],
      });
    burst(0.2);
    const timer = setTimeout(() => burst(0.8), 350);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    const summary = formatGameSummary(players, roundsPlayed, endGameTarget);
    const outcome = await shareGameSummary(summary);
    if (outcome === 'copied') {
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2500);
    } else if (outcome === 'failed') {
      setShareState('failed');
      setTimeout(() => setShareState('idle'), 2500);
    }
  };

  return (
    <ModalOverlay labelledBy="game-over-title">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="panel p-8 max-w-md w-full text-center"
      >
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" aria-hidden="true" />
        <h2 id="game-over-title" className="text-2xl font-bold mb-2">
          Game Over!
        </h2>
        <p className="text-xl mb-6">
          🎉 {winner.name} wins with {winner.totalScore} points! 🎉
        </p>

        <ol className="text-left space-y-1 mb-6">
          {standings.map((player, index) => (
            <li
              key={player.id}
              className={`flex justify-between items-center px-3 py-1.5 rounded-lg ${
                index === 0 ? 'bg-emerald-900/60' : 'bg-felt-800/70'
              }`}
            >
              <span>
                <span className="inline-block w-7" aria-hidden="true">
                  {medals[index] ?? `${index + 1}.`}
                </span>
                {player.name}
              </span>
              <span className="tabular-nums">{player.totalScore}</span>
            </li>
          ))}
        </ol>

        <div className="flex gap-3 justify-center">
          <button onClick={handleShare} className="btn-secondary py-2 px-5 flex items-center gap-2">
            {shareState === 'copied' ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" /> Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" aria-hidden="true" />
                {shareState === 'failed' ? 'Share failed' : 'Share results'}
              </>
            )}
          </button>
          <button onClick={onRestart} className="btn-primary py-2 px-5">
            Start New Game
          </button>
        </div>
      </motion.div>
    </ModalOverlay>
  );
}
