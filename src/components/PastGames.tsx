import { useState } from 'react';
import { Trophy, Trash2, X } from 'lucide-react';
import { CompletedGame } from '../types';
import { clearGameHistory } from '../utils/storage';
import ModalOverlay from './ModalOverlay';

interface PastGamesProps {
  games: CompletedGame[];
  onClose: () => void;
  onHistoryCleared: () => void;
}

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ''
    : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function PastGames({ games, onClose, onHistoryCleared }: PastGamesProps) {
  const [confirmingClear, setConfirmingClear] = useState(false);

  const winCounts = games.reduce<Record<string, number>>((counts, game) => {
    counts[game.winnerName] = (counts[game.winnerName] ?? 0) + 1;
    return counts;
  }, {});
  const hallOfFame = Object.entries(winCounts).sort((a, b) => b[1] - a[1]);

  const handleClear = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      return;
    }
    clearGameHistory();
    onHistoryCleared();
  };

  return (
    <ModalOverlay labelledBy="past-games-title" onDismiss={onClose}>
      <div className="panel p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 id="past-games-title" className="text-xl font-bold">
            Past Games
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-felt-700 transition-colors"
            aria-label="Close past games"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {games.length === 0 ? (
          <p className="text-emerald-200/60 py-8 text-center">
            No finished games yet. Play a game to the end and it will show up here.
          </p>
        ) : (
          <>
            <div className="bg-felt-800/70 border border-felt-700/40 rounded-lg p-4 mb-4">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                Hall of Fame
              </h3>
              <ul className="space-y-1 text-sm">
                {hallOfFame.map(([name, wins]) => (
                  <li key={name} className="flex justify-between">
                    <span>{name}</span>
                    <span className="tabular-nums">
                      {wins} {wins === 1 ? 'win' : 'wins'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="space-y-3 mb-4">
              {games.map(game => (
                <li
                  key={game.id}
                  className="bg-felt-800/50 border border-felt-700/40 rounded-lg p-3"
                >
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="font-semibold">🏆 {game.winnerName}</span>
                    <span className="text-xs text-emerald-200/60">
                      {formatDate(game.endedAt)} · {game.roundsPlayed} rounds · to{' '}
                      {game.endGameTarget}
                    </span>
                  </div>
                  <p className="text-sm text-emerald-200/80">
                    {game.standings
                      .map(entry => `${entry.name} ${entry.totalScore}`)
                      .join(' · ')}
                  </p>
                </li>
              ))}
            </ul>

            <button
              onClick={handleClear}
              className="btn-danger w-full py-2 px-4 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              {confirmingClear ? 'Tap again to confirm' : 'Clear history'}
            </button>
          </>
        )}
      </div>
    </ModalOverlay>
  );
}
