import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import GameSetup from './components/GameSetup';
import Scoreboard from './components/Scoreboard';
import RoundHistory from './components/RoundHistory';
import RoundEntry from './components/RoundEntry';
import GameOver from './components/GameOver';
import ScoreAnimation from './components/ScoreAnimation';
import { GameState, GameSettings, Player, Round } from './types';
import { saveGameState, loadGameState, clearGameData } from './utils/storage';
import { isGameOver, getWinner } from './utils/gameLogic';
import { getHighestScoringPlayer, recalculateTotalScores } from './utils/roundUtils';
import { deleteRound } from './utils/roundManagement';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [highestScoringPlayer, setHighestScoringPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
      if (isGameOver(savedState.players, savedState.endGameTarget)) {
        setShowGameOver(true);
      }
    }
  }, []);

  const handleStartGame = (settings: GameSettings, playerNames: string[]) => {
    const newGameState: GameState = {
      players: playerNames.map((name, index) => ({
        id: uuidv4(),
        name: name.trim() || `Player ${index + 1}`,
        totalScore: 0,
      })),
      rounds: [],
      endGameTarget: settings.endGameTarget,
      deckConfig: settings.deckConfig
    };
    setGameState(newGameState);
    saveGameState(newGameState);
  };

  const handleRestart = () => {
    clearGameData();
    setGameState(null);
    setShowGameOver(false);
    setEditingRound(null);
    setShowAnimation(false);
    setHighestScoringPlayer(null);
  };

  const handleDeleteRound = (roundNumber: number) => {
    if (!gameState) return;
    const newGameState = deleteRound(gameState, roundNumber);
    setGameState(newGameState);
  };

  const handleRoundSubmit = (roundScores: { playerId: string; roundScore: number }[]) => {
    if (!gameState) return;

    const newRound: Round = {
      roundNumber: editingRound?.roundNumber || gameState.rounds.length + 1,
      scores: roundScores,
      timestamp: new Date().toISOString(),
    };

    let newRounds: Round[];
    if (editingRound) {
      newRounds = gameState.rounds.map(r => 
        r.roundNumber === editingRound.roundNumber ? newRound : r
      );
    } else {
      newRounds = [...gameState.rounds, newRound];
    }

    const updatedPlayers = recalculateTotalScores(gameState.players, newRounds);
    
    const newGameState = {
      ...gameState,
      players: updatedPlayers,
      rounds: newRounds,
    };

    setGameState(newGameState);
    saveGameState(newGameState);

    if (!editingRound) {
      const highestScorer = getHighestScoringPlayer(newRound, updatedPlayers);
      if (highestScorer) {
        setHighestScoringPlayer(highestScorer);
        setShowAnimation(true);
      }
    }

    setEditingRound(null);

    if (isGameOver(updatedPlayers, gameState.endGameTarget)) {
      setShowGameOver(true);
    }
  };

  if (!gameState) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">HEART BERN ❤️ 🔥</h1>
          <button
            onClick={handleRestart}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reset Game
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Scoreboard 
              players={gameState.players} 
              rounds={gameState.rounds.length}
            />
            <RoundEntry 
              players={gameState.players} 
              onSubmit={handleRoundSubmit}
              editingRound={editingRound}
              deckConfig={gameState.deckConfig}
            />
          </div>
          <RoundHistory 
            rounds={gameState.rounds} 
            players={gameState.players}
            onEditRound={setEditingRound}
            onDeleteRound={handleDeleteRound}
          />
        </div>

        {showGameOver && (
          <GameOver winner={getWinner(gameState.players)} onRestart={handleRestart} />
        )}

        {!editingRound && showAnimation && (
          <ScoreAnimation
            playerName={highestScoringPlayer?.name || ''}
            show={showAnimation}
            onComplete={() => setShowAnimation(false)}
          />
        )}
      </div>
    </div>
  );
}