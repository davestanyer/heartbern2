import React, { useRef, useState } from 'react';
import { History } from 'lucide-react';
import { calculateDeckRequirements } from '../utils/gameLogic';
import { GameSettings, DeckConfiguration, CompletedGame } from '../types';
import { loadGameSetup, loadGameHistory } from '../utils/storage';
import AppHeader from './AppHeader';
import PastGames from './PastGames';

interface GameSetupProps {
  onStartGame: (settings: GameSettings, playerNames: string[]) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [savedSetup] = useState(loadGameSetup);

  const [numberOfPlayers, setNumberOfPlayers] = useState(
    savedSetup?.settings.numberOfPlayers ?? 4
  );
  const [endGameTarget, setEndGameTarget] = useState(savedSetup?.settings.endGameTarget ?? 100);
  const [playerNames, setPlayerNames] = useState<string[]>(
    savedSetup?.playerNames.slice(0, savedSetup.settings.numberOfPlayers) ??
      Array(4).fill('')
  );
  const [useDoubleDeck, setUseDoubleDeck] = useState(
    savedSetup?.settings.useDoubleDeck ?? false
  );
  const [deckConfig, setDeckConfig] = useState<DeckConfiguration>(() =>
    calculateDeckRequirements(
      savedSetup?.settings.numberOfPlayers ?? 4,
      savedSetup?.settings.useDoubleDeck ?? false
    )
  );

  const [pastGames, setPastGames] = useState<CompletedGame[]>(loadGameHistory);
  const [showPastGames, setShowPastGames] = useState(false);

  const handleNumberOfPlayersChange = (value: number) => {
    const newPlayerCount = Number(value);
    setNumberOfPlayers(newPlayerCount);
    setPlayerNames(prev =>
      Array.from({ length: newPlayerCount }, (_, i) => prev[i] ?? '')
    );

    // Automatically enable double deck for 8+ players
    const shouldUseDoubleDeck = newPlayerCount >= 8;
    setUseDoubleDeck(shouldUseDoubleDeck);
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
        deckConfig,
      },
      playerNames
    );
  };

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (index < playerNames.length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <AppHeader>
          <button
            type="button"
            onClick={() => setShowPastGames(true)}
            className="btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <History className="w-4 h-4" aria-hidden="true" />
            Past Games
          </button>
        </AppHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="number-of-players" className="block text-sm font-medium mb-2">
              Number of Players
            </label>
            <select
              id="number-of-players"
              value={numberOfPlayers}
              onChange={(e) => handleNumberOfPlayersChange(Number(e.target.value))}
              className="w-full bg-felt-800 rounded-lg p-2 border border-felt-700"
            >
              {Array.from({ length: 10 }, (_, i) => i + 3).map((num) => (
                <option key={num} value={num}>
                  {num} Players
                </option>
              ))}
            </select>
          </div>

          {numberOfPlayers >= 8 ? (
            <div className="bg-emerald-900/50 border border-emerald-700/40 p-4 rounded-lg">
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
                className="rounded border-felt-700"
              />
              <label htmlFor="useDoubleDeck" className="text-sm">
                Use two decks for more cards per player
              </label>
            </div>
          )}

          <div>
            <span className="block text-sm font-medium mb-2">End Game Target Score</span>
            <div className="flex space-x-2" role="group" aria-label="End game target score">
              {[50, 75, 100].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEndGameTarget(value)}
                  aria-pressed={endGameTarget === value}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    endGameTarget === value
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-felt-800 text-emerald-100 border-felt-700 hover:bg-felt-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="block text-sm font-medium">Player Names</span>
            <div className="grid grid-cols-2 gap-4">
              {playerNames.map((name, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  placeholder={`Player ${index + 1}`}
                  aria-label={`Player ${index + 1} name`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  enterKeyHint={index === playerNames.length - 1 ? 'done' : 'next'}
                  className="bg-felt-800 rounded-lg p-2 border border-felt-700"
                />
              ))}
            </div>
          </div>

          <div className="panel p-4 space-y-2">
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

          <button type="submit" className="btn-primary w-full py-2 px-4">
            Start Game
          </button>
        </form>

        {showPastGames && (
          <PastGames
            games={pastGames}
            onClose={() => setShowPastGames(false)}
            onHistoryCleared={() => setPastGames([])}
          />
        )}
      </div>
    </div>
  );
}
