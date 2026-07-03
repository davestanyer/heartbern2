import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LineChart } from 'lucide-react';
import { Player, Round } from '../types';
import ScoreChart from './ScoreChart';
import GameStats from './GameStats';

interface GameInsightsProps {
  players: Player[];
  rounds: Round[];
  endGameTarget: number;
  roundTotalPoints: number;
}

export default function GameInsights({
  players,
  rounds,
  endGameTarget,
  roundTotalPoints,
}: GameInsightsProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'chart' | 'stats'>('chart');

  return (
    <div className="panel mt-6">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-xl font-bold flex items-center gap-2">
          <LineChart className="w-5 h-5 text-rose-400" aria-hidden="true" />
          Game Insights
        </span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <div className="flex gap-2 mb-3" role="tablist" aria-label="Insight views">
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'chart'}
                  onClick={() => setTab('chart')}
                  className={`chip ${tab === 'chart' ? '!bg-rose-600 !border-rose-500' : ''}`}
                >
                  Score chart
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'stats'}
                  onClick={() => setTab('stats')}
                  className={`chip ${tab === 'stats' ? '!bg-rose-600 !border-rose-500' : ''}`}
                >
                  Player stats
                </button>
              </div>

              {tab === 'chart' ? (
                <ScoreChart players={players} rounds={rounds} endGameTarget={endGameTarget} />
              ) : (
                <GameStats
                  players={players}
                  rounds={rounds}
                  roundTotalPoints={roundTotalPoints}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
