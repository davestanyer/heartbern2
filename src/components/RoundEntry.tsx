import React, { useState, useEffect } from 'react';
import { Player, DeckConfiguration } from '../types';
import { calculateRoundPoints } from '../utils/deckScoring';
import { getRemainingPoints } from '../utils/scoreValidation';
import ShootMoonButton from './ShootMoonButton';
import ScoreSlider from './ScoreSlider'; // Import the new ScoreSlider component

interface RoundEntryProps {
  players: Player[];
  onSubmit: (scores: { playerId: string; roundScore: number }[]) => void;
  deckConfig: DeckConfiguration;
}

export default function RoundEntry({ players, onSubmit, deckConfig }: RoundEntryProps) {
  const [scores, setScores] = useState<{ [key: string]: number }>(
    Object.fromEntries(players.map(p => [p.id, 0]))
  );

  const roundPoints = calculateRoundPoints(deckConfig);

  useEffect(() => {
    setScores(Object.fromEntries(players.map(p => [p.id, 0])));
  }, [players]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roundScores = Object.entries(scores).map(([playerId, roundScore]) => ({
      playerId,
      roundScore,
    }));
    onSubmit(roundScores);

    setScores(Object.fromEntries(players.map(p => [p.id, 0])));
    
  };

  const handleScoreChange = (playerId: string, value: number) => {
    const newValue = Math.max(0, Math.min(value, roundPoints.totalPoints));
    setScores(prev => ({
      ...prev,
      [playerId]: newValue,
    }));
  };

  const currentScores = Object.entries(scores).map(([playerId, roundScore]) => ({
    playerId,
    roundScore,
  }));

  const remainingPoints = getRemainingPoints(currentScores, roundPoints);
  const hasPlayerWithAllPoints = Object.values(scores).some(
    score => score === roundPoints.totalPoints
  );

  const handleShootMoon = () => {
    if (hasPlayerWithAllPoints) {
      const shooterPlayerId = Object.entries(scores).find(
        ([_, score]) => score === roundPoints.totalPoints
      )?.[0];

      if (shooterPlayerId) {
        const moonShotScores = Object.entries(scores).map(([playerId, _]) => ({
          playerId,
          roundScore: playerId === shooterPlayerId ? 0 : roundPoints.totalPoints,
        }));
        onSubmit(moonShotScores);
        setScores(Object.fromEntries(players.map(p => [p.id, 0])));
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-lg p-4 mt-6 bg-gray-800`}
    >
      <h2 className="text-xl font-bold mb-4">
        Enter Round Scores
      </h2>

      <div className="mb-4 p-4 bg-gray-700 rounded-lg">
        <p className="text-sm font-medium mb-2">Round Points:</p>
        <ul className="space-y-1">
          <li>Hearts: {roundPoints.heartsPoints} points ({roundPoints.heartsPoints} cards)</li>
          <li>Queen of Spades: {roundPoints.queenPoints} points</li>
          <li>Total Available: {roundPoints.totalPoints} points</li>
          <li className="text-yellow-400">Remaining: {remainingPoints} points</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {players.map(player => (
          <ScoreSlider
            key={player.id}
            playerId={player.id}
            playerName={player.name}
            value={scores[player.id] || 0}
            max={(scores[player.id] || 0) + remainingPoints} // Allow dynamic adjustment based on remaining points
            onChange={handleScoreChange}
          />
        ))}
      </div>

      {hasPlayerWithAllPoints ? (
        <ShootMoonButton onShootMoon={handleShootMoon} />
      ) : (
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          disabled={remainingPoints !== 0} // Disable until points are distributed
        >
          Submit Round
        </button>
      )}
    </form>
  );
}