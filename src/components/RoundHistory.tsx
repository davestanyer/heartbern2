import React from 'react';
import { Round, Player } from '../types';
import RoundActions from './RoundActions';

interface RoundHistoryProps {
  rounds: Round[];
  players: Player[];
  onEditRound: (roundNumber: number) => void;
  onDeleteRound: (roundNumber: number) => void;
}

export default function RoundHistory({ rounds, players, onEditRound, onDeleteRound }: RoundHistoryProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Round History</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="p-2">Round</th>
              {players.map((player) => (
                <th key={player.id} className="p-2">{player.name}</th>
              ))}
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round) => (
              <tr key={round.roundNumber} className="border-t border-gray-700">
                <td className="p-2">{round.roundNumber}</td>
                {players.map((player) => (
                  <td key={player.id} className="p-2">
                    {round.scores.find((s) => s.playerId === player.id)?.roundScore || 0}
                  </td>
                ))}
                <td className="p-2">
                  <RoundActions
                    roundNumber={round.roundNumber}
                    onEdit={onEditRound}
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