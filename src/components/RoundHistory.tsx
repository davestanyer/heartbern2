import { Round, Player } from '../types';
import RoundActions from './RoundActions';

interface RoundHistoryProps {
  rounds: Round[];
  players: Player[];
  onDeleteRound: (round: Round) => void;
}

export default function RoundHistory({ rounds, players, onDeleteRound }: RoundHistoryProps) {
  return (
    <div className="panel p-4">
      <h2 className="text-xl font-bold mb-4">Round History</h2>
      {rounds.length === 0 && (
        <p className="text-sm text-emerald-200/60 py-4 text-center">
          No rounds yet — deal the cards and enter the first scores.
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-emerald-200/60">
              <th className="p-2">Round</th>
              {players.map((player) => (
                <th key={player.id} className="p-2">{player.name}</th>
              ))}
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => (
              <tr key={round.roundId} className="border-t border-felt-700/50">
                <td className="p-2">{round.roundNumber}</td>
                {players.map((player) => (
                  <td key={player.id} className="p-2">
                    {round.scores.find((s) => s.playerId === player.id)?.roundScore || 0}
                  </td>
                ))}
                <td className="p-2">
                  <RoundActions
                    round={round}
                    onDelete={onDeleteRound}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}