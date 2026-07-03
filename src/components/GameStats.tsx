import { Player, Round } from '../types';
import { buildPlayerStats } from '../utils/gameStats';

interface GameStatsProps {
  players: Player[];
  rounds: Round[];
  roundTotalPoints: number;
}

export default function GameStats({ players, rounds, roundTotalPoints }: GameStatsProps) {
  if (rounds.length === 0) {
    return (
      <p className="text-sm text-emerald-200/60 py-6 text-center">
        Stats appear once the first round is in.
      </p>
    );
  }

  const stats = buildPlayerStats(players, rounds, roundTotalPoints);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-emerald-200/60">
            <th className="p-2 font-medium">Player</th>
            <th className="p-2 font-medium text-right" title="Average points per round">
              Avg
            </th>
            <th className="p-2 font-medium text-right" title="Worst single round">
              Worst
            </th>
            <th className="p-2 font-medium text-right" title="Rounds with zero points">
              Clean
            </th>
            <th className="p-2 font-medium text-right" title="Likely Queen of Spades catches (13+ points in a round)">
              Q♠
            </th>
            <th className="p-2 font-medium text-right" title="Successful moon shots">
              🌙
            </th>
          </tr>
        </thead>
        <tbody>
          {stats.map(playerStats => (
            <tr key={playerStats.playerId} className="border-t border-felt-700/50">
              <td className="p-2 font-medium">{playerStats.name}</td>
              <td className="p-2 text-right tabular-nums">
                {playerStats.averagePerRound.toFixed(1)}
              </td>
              <td className="p-2 text-right tabular-nums">{playerStats.worstRound}</td>
              <td className="p-2 text-right tabular-nums">{playerStats.cleanRounds}</td>
              <td className="p-2 text-right tabular-nums">{playerStats.queenCatches}</td>
              <td className="p-2 text-right tabular-nums">{playerStats.moonShots}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-emerald-200/50 mt-2 px-2">
        Avg = points per round · Clean = zero-point rounds · Q♠ = rounds with 13+ points (likely
        caught the Queen) · 🌙 = moon shots
      </p>
    </div>
  );
}
