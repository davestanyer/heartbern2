import React, { useState, useEffect } from 'react';
import { Moon } from 'lucide-react';
import { calculateDeckRequirements } from '../utils/gameLogic';
import { GameSettings, DeckConfiguration } from '../types';

interface GameSetupProps {
  onStartGame: (settings: GameSettings, playerNames: string[]) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [numberOfPlayers, setNumberOfPlayers] = useState(4);
  const [endGameTarget, setEndGameTarget] = useState(100);
  const [playerNames, setPlayerNames] = useState<string[]>(Array(4).fill(''));
  const [useDoubleDeck, setUseDoubleDeck] = useState(false);
  const [deckConfig, setDeckConfig] = useState<DeckConfiguration>(
    calculateDeckRequirements(4, false)
  );

  const handleNumberOfPlayersChange = (value: number) => {
    const newPlayerCount = Number(value);
    setNumberOfPlayers(newPlayerCount);
    setPlayerNames(Array(newPlayerCount).fill(''));
    
    // Automatically enable double deck for 8+ players
    const shouldUseDoubleDeck = newPlayerCount >= 8;
    setUseDoubleDeck(shouldUseDoubleDeck);
    
    // Immediately update deck configuration
    setDeckConfig(calculateDeckRequirements(newPlayerCount, shouldUseDoubleDeck));
  };

  const handleDoubleDeckChange = (checked: boolean) => {
    setUseDoubleDeck(checked);
    setDeckConfig(calculateDeckRequirements(numberOfPlayers, checked));
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame(
      { 
        numberOfPlayers, 
        endGameTarget, 
        useDoubleDeck,
        deckConfig 
      }, 
      playerNames
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Moon className="w-8 h-8 mr-2" />
          <h1 className="text-3xl font-bold">HEART BERN ❤️ 🔥</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Players
            </label>
            <select
              value={numberOfPlayers}
              onChange={(e) => handleNumberOfPlayersChange(Number(e.target.value))}
              className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700"
            >
              {Array.from({ length: 10 }, (_, i) => i + 3).map((num) => (
                <option key={num} value={num}>
                  {num} Players
                </option>
              ))}
            </select>
          </div>

          {numberOfPlayers >= 8 ? (
            <div className="bg-blue-900 p-4 rounded-lg">
              <p className="text-sm">
                Note: For {numberOfPlayers} players, two decks are required for gameplay.
              </p>
            </div>
          ) : numberOfPlayers >= 5 && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useDoubleDeck"
                checked={useDoubleDeck}
                onChange={(e) => handleDoubleDeckChange(e.target.checked)}
                className="rounded border-gray-700"
              />
              <label htmlFor="useDoubleDeck" className="text-sm">
                Use two decks for more cards per player
              </label>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              End Game Target Score
            </label>
            <input
              type="number"
              value={endGameTarget}
              onChange={(e) => setEndGameTarget(Number(e.target.value))}
              min="50"
              max="500"
              className="w-full bg-gray-800 rounded-lg p-2 border border-gray-700"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Player Names</label>
            <div className="grid grid-cols-2 gap-4">
              {playerNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Player ${index + 1}`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  className="bg-gray-800 rounded-lg p-2 border border-gray-700"
                />
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <h3 className="font-medium mb-2">Deck Setup Instructions</h3>
            <p>Number of decks needed: {deckConfig.numberOfDecks}</p>
            <p>Cards per player: {deckConfig.cardsPerPlayer}</p>
            <p>Total cards in play: {deckConfig.totalCards}</p>
            <p>Cards to remove: {deckConfig.cardsToRemove.join(', ') || 'None'}</p>
            {deckConfig.numberOfDecks === 2 && (
              <p className="text-yellow-400 text-sm mt-2">
                Note: When using two decks, only one Queen of Spades will be kept in play.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Start Game
          </button>
        </form>
      </div>
    </div>
  );
}