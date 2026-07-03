import React, { useState, useEffect } from 'react';
import { Player, DeckConfiguration } from '../types';
import { calculateRoundPoints } from '../utils/deckScoring';
import { getRemainingPoints, handleShootMoon } from '../utils/scoreValidation';
import ShootMoonButton from './ShootMoonButton';
import ScoreSlider from './ScoreSlider';

interface RoundEntryProps {
  players: Player[];
  onSubmit: (scores: { playerId: string; roundScore: number }[]) => void;
  deckConfig: DeckConfiguration;
}

const emptyScores = (players: Player[]) =>
  Object.fromEntries(players.map(p => [p.id, 0]));

export default function RoundEntry({ players, onSubmit, deckConfig }: RoundEntryProps) {
  const [scores, setScores] = useState<{ [key: string]: number }>(emptyScores(players));

  const roundPoints = calculateRoundPoints(deckConfig);

  useEffect(() => {
    setScores(emptyScores(players));
  }, [players]);

  const currentScores = Object.entries(scores).map(([playerId, roundScore]) => ({
    playerId,
    roundScore,
  }));

  const remainingPoints = getRemainingPoints(currentScores, roundPoints);
  const shooterId = currentScores.find(
    score => score.roundScore === roundPoints.totalPoints
  )?.playerId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(currentScores);
    setScores(emptyScores(players));
  };

  const handleScoreChange = (playerId: string, value: number) => {
    const newValue = Math.max(0, Math.min(value, roundPoints.totalPoints));
    setScores(prev => ({
      ...prev,
      [playerId]: newValue,
    }));
  };

  const onShootMoon = () => {
    if (!shooterId) return;
    onSubmit(handleShootMoon(currentScores, shooterId, roundPoints));
    setScores(emptyScores(players));
  };

  return (
    <form onSubmit={handleSubmit} className="panel p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Enter Round Scores</h2>

      <div className="mb-4 p-4 bg-felt-800/70 border border-felt-700/40 rounded-lg">
        <p className="text-sm font-medium mb-2">Round Points:</p>
        <ul className="space-y-1 text-sm">
          <li>
            ♥ Hearts: {roundPoints.heartsPoints} points ({roundPoints.heartsPoints} cards)
          </li>
          <li>♠ Queen of Spades: {roundPoints.queenPoints} points</li>
          <li>Total Available: {roundPoints.totalPoints} points</li>
          <li className={remainingPoints === 0 ? 'text-emerald-400' : 'text-yellow-400'}>
            Remaining: {remainingPoints} points
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {players.map(player => (
          <ScoreSlider
            key={player.id}
            playerId={player.id}
            playerName={player.name}
            value={scores[player.id] || 0}
            max={(scores[player.id] || 0) + remainingPoints}
            remainingPoints={remainingPoints}
            onChange={handleScoreChange}
          />
        ))}
      </div>

      {shooterId ? (
        <ShootMoonButton onShootMoon={onShootMoon} />
      ) : (
        <button
          type="submit"
          className="btn-primary w-full py-2 px-4"
          disabled={remainingPoints !== 0}
        >
          {remainingPoints === 0 ? 'Submit Round' : `Distribute ${remainingPoints} more points`}
        </button>
      )}
    </form>
  );
}
