import React from 'react';
import { Player } from '../types';
import { Crown, Moon } from 'lucide-react';

interface ScoreboardProps {
  players: Player[];
  rounds: number;
}

export default function Scoreboard({ players, rounds }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => a.totalScore - b.totalScore);
  const lowestScore = sortedPlayers[0]?.totalScore;
  const highestScore = sortedPlayers[sortedPlayers.length - 1]?.totalScore;

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Current Standings</h2>
      <div className="space-y-2">
        {sortedPlayers.map((player, index) => (
          <div
            key={player.id}
            className={`flex justify-between items-center p-2 rounded ${
              index === 0 ? 'bg-blue-900' : 'bg-gray-700'
            }`}
          >
            <span className="font-medium flex items-center gap-3">
              {player.name}
              {rounds > 0 && (
                <span className="flex items-center gap-2">
                  {player.totalScore === lowestScore && ' 👑 '}
                  {player.totalScore === highestScore && ' 🤤  🌙 '}
                </span>
              )}
            </span>
            <span className="text-lg">{player.totalScore}</span>
          </div>
        ))}
      </div>
    </div>
  );
}