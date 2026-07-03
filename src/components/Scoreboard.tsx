import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowUp, Flame } from 'lucide-react';
import { Player, Round } from '../types';
import { recalculateTotalScores } from '../utils/roundUtils';

interface ScoreboardProps {
  players: Player[];
  rounds: Round[];
  endGameTarget: number;
}

const DANGER_ZONE_MARGIN = 15;

const byScore = (a: Player, b: Player) => a.totalScore - b.totalScore;

export default function Scoreboard({ players, rounds, endGameTarget }: ScoreboardProps) {
  const sortedPlayers = [...players].sort(byScore);
  const lowestScore = sortedPlayers[0]?.totalScore;
  const highestScore = sortedPlayers[sortedPlayers.length - 1]?.totalScore;

  // Standings before the most recent round, to show who moved up or down.
  const previousRanks = new Map<string, number>();
  if (rounds.length > 0) {
    const previousPlayers = recalculateTotalScores(players, rounds.slice(0, -1));
    [...previousPlayers].sort(byScore).forEach((player, index) => {
      previousRanks.set(player.id, index);
    });
  }

  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Current Standings</h2>
        <span className="text-sm text-emerald-200/60">
          Round {rounds.length} · to {endGameTarget}
        </span>
      </div>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {sortedPlayers.map((player, index) => {
            const previousRank = previousRanks.get(player.id);
            const movement = previousRank === undefined ? 0 : previousRank - index;
            const inDangerZone =
              player.totalScore >= endGameTarget - DANGER_ZONE_MARGIN;

            return (
              <motion.li
                key={player.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className={`flex justify-between items-center p-2 rounded-lg border ${
                  index === 0
                    ? 'bg-emerald-900/60 border-emerald-600/40'
                    : inDangerZone
                      ? 'bg-red-950/60 border-red-700/40'
                      : 'bg-felt-800/70 border-felt-700/40'
                }`}
              >
                <span className="font-medium flex items-center gap-2">
                  <span className="text-emerald-200/50 text-sm w-5">{index + 1}.</span>
                  {player.name}
                  {rounds.length > 0 && (
                    <span className="flex items-center gap-1">
                      {player.totalScore === lowestScore && <span aria-label="leader">👑</span>}
                      {player.totalScore === highestScore && (
                        <span aria-label="highest score">🤤🌙</span>
                      )}
                      {inDangerZone && (
                        <Flame
                          className="w-4 h-4 text-red-400"
                          aria-label="close to the target score"
                        />
                      )}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-2">
                  {movement > 0 && (
                    <ArrowUp className="w-4 h-4 text-emerald-400" aria-label="moved up" />
                  )}
                  {movement < 0 && (
                    <ArrowDown className="w-4 h-4 text-red-400" aria-label="moved down" />
                  )}
                  <span className="text-lg tabular-nums">{player.totalScore}</span>
                </span>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
