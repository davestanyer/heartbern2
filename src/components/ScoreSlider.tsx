import React from 'react';

interface ScoreSliderProps {
  playerId: string;
  playerName: string;
  value: number;
  max: number;
  onChange: (id: string, value: number) => void;
}

const ScoreSlider: React.FC<ScoreSliderProps> = ({ playerId, playerName, value, max, onChange }) => {
  const handleIncrement = () => {
    if (value < max) onChange(playerId, value + 1);
  };

  const handleDecrement = () => {
    if (value > 0) onChange(playerId, value - 1);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(playerId, newValue);
  };

  return (
    <div className="flex flex-col items-center space-y-2">

      <div className="flex items-center space-x-2 w-full">
        <button
          type="button"
          className="p-2 bg-gray-600 text-white rounded"
          onClick={handleDecrement}
          disabled={value === 0}
        >
          -
        </button>
        <div className="flex-1">
            {/* Row layout for player name and score */}
            <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white">
                {playerName}
                </label>
                <span className="text-sm font-bold text-white">
                {value} / {max}
                </span>
            </div>

            {/* Slider */}
            <input
                type="range"
                min="0"
                max={max}
                value={value}
                onChange={handleSliderChange}
                className="w-full"
            />
        </div>
        <button
          type="button"
          className="p-2 bg-gray-600 text-white rounded"
          onClick={handleIncrement}
          disabled={value === max}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ScoreSlider;