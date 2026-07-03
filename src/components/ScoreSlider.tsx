import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ScoreSliderProps {
  playerId: string;
  playerName: string;
  value: number;
  max: number;
  remainingPoints: number;
  onChange: (id: string, value: number) => void;
}

const ScoreSlider: React.FC<ScoreSliderProps> = ({
  playerId,
  playerName,
  value,
  max,
  remainingPoints,
  onChange,
}) => {
  const addPoints = (amount: number) => {
    onChange(playerId, Math.min(value + amount, max));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(playerId, Number(e.target.value));
  };

  return (
    <div className="flex flex-col space-y-2 bg-felt-800/50 border border-felt-700/40 rounded-lg p-3">
      <div className="flex items-center space-x-2 w-full">
        <button
          type="button"
          className="p-2 bg-felt-700 hover:bg-felt-600 text-white rounded-lg transition-colors disabled:opacity-40"
          onClick={() => addPoints(-1)}
          disabled={value === 0}
          aria-label={`Decrease ${playerName}'s score`}
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor={`slider-${playerId}`} className="text-sm font-medium text-white">
              {playerName}
            </label>
            <span className="text-sm font-bold text-white tabular-nums">
              {value} / {max}
            </span>
          </div>
          <input
            id={`slider-${playerId}`}
            type="range"
            min="0"
            max={max}
            value={value}
            onChange={handleSliderChange}
            className="w-full"
            aria-label={`${playerName}'s round score`}
            aria-valuetext={`${value} points`}
          />
        </div>
        <button
          type="button"
          className="p-2 bg-felt-700 hover:bg-felt-600 text-white rounded-lg transition-colors disabled:opacity-40"
          onClick={() => addPoints(1)}
          disabled={value === max}
          aria-label={`Increase ${playerName}'s score`}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        <button
          type="button"
          className="chip"
          onClick={() => addPoints(5)}
          disabled={remainingPoints === 0}
          aria-label={`Add 5 points to ${playerName}`}
        >
          +5
        </button>
        <button
          type="button"
          className="chip"
          onClick={() => addPoints(13)}
          disabled={remainingPoints === 0}
          aria-label={`Add 13 points to ${playerName} for the Queen of Spades`}
        >
          +Q♠ (13)
        </button>
        <button
          type="button"
          className="chip"
          onClick={() => addPoints(remainingPoints)}
          disabled={remainingPoints === 0}
          aria-label={`Assign all ${remainingPoints} remaining points to ${playerName}`}
        >
          Rest ({remainingPoints})
        </button>
        {value > 0 && (
          <button
            type="button"
            className="chip"
            onClick={() => onChange(playerId, 0)}
            aria-label={`Clear ${playerName}'s score`}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default ScoreSlider;
