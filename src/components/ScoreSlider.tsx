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
    <div className="flex items-center space-x-2">
      <button
        type="button"
        className="p-2 bg-gray-600 text-white rounded"
        onClick={handleDecrement}
        disabled={value === 0}
      >
        -
      </button>
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">{playerName}</label>
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="w-full"
        />
        <p className="text-sm text-center mt-1">{value} / {max}</p>
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
  );
};

export default ScoreSlider;