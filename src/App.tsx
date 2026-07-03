import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Undo2, RotateCcw } from 'lucide-react';
import GameSetup from './components/GameSetup';
import Scoreboard from './components/Scoreboard';
import RoundHistory from './components/RoundHistory';
import RoundEntry from './components/RoundEntry';
import GameOver from './components/GameOver';
import GameInsights from './components/GameInsights';
import ScoreAnimation from './components/ScoreAnimation';
import AppHeader from './components/AppHeader';
import ConfirmResetModal from './components/ConfirmResetModal';
import { GameState, GameSettings, Player, Round } from './types';
import {
  saveGameState,
  loadGameState,
  clearGameData,
  saveGameSetup,
  archiveCompletedGame,
} from './utils/storage';
import { isGameOver, getWinner } from './utils/gameLogic';
import { calculateRoundPoints } from './utils/deckScoring';
import { getHighestScoringPlayer, recalculateTotalScores } from './utils/roundUtils';
import { deleteRound } from './utils/roundManagement';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [highestScoringPlayer, setHighestScoringPlayer] = useState<Player | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleRestart = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    if (gameState && isGameOver(gameState.players, gameState.endGameTarget)) {
      archiveCompletedGame({
        id: uuidv4(),
        endedAt: new Date().toISOString(),
        endGameTarget: gameState.endGameTarget,
        roundsPlayed: gameState.rounds.length,
        winnerName: getWinner(gameState.players).name,
        standings: [...gameState.players]
          .sort((a, b) => a.totalScore - b.totalScore)
          .map(({ name, totalScore }) => ({ name, totalScore })),
      });
    }
    clearGameData();
    setGameState(null);
    setShowGameOver(false);
    setShowAnimation(false);
    setHighestScoringPlayer(null);
    setShowResetModal(false);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

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
      deckConfig: settings.deckConfig,
    };
    setGameState(newGameState);
    saveGameState(newGameState);
    saveGameSetup({ settings, playerNames });
  };

  const handleDeleteRound = (round: Round) => {
    if (!gameState) return;
    const newGameState = deleteRound(gameState, round.roundNumber);
    setGameState(newGameState);
    // Removing points can put players back under the target.
    setShowGameOver(isGameOver(newGameState.players, newGameState.endGameTarget));
  };

  const handleUndoLastRound = () => {
    if (!gameState || gameState.rounds.length === 0) return;
    handleDeleteRound(gameState.rounds[gameState.rounds.length - 1]);
  };

  const handleRoundSubmit = (roundScores: { playerId: string; roundScore: number }[]) => {
    if (!gameState) return;

    const newRound: Round = {
      roundId: uuidv4(),
      roundNumber: gameState.rounds.length + 1,
      scores: roundScores,
      timestamp: new Date().toISOString(),
    };

    const newRounds = [...gameState.rounds, newRound];
    const updatedPlayers = recalculateTotalScores(gameState.players, newRounds);

    const newGameState = {
      ...gameState,
      players: updatedPlayers,
      rounds: newRounds,
    };

    setGameState(newGameState);
    saveGameState(newGameState);

    const highestScorer = getHighestScoringPlayer(newRound, updatedPlayers);
    if (highestScorer) {
      setHighestScoringPlayer(highestScorer);
      setShowAnimation(true);
    }

    if (isGameOver(updatedPlayers, gameState.endGameTarget)) {
      setShowGameOver(true);
    }
  };

  if (!gameState) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  const roundTotalPoints = calculateRoundPoints(gameState.deckConfig).totalPoints;

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <AppHeader>
          <button
            onClick={handleUndoLastRound}
            disabled={gameState.rounds.length === 0}
            className="btn-secondary px-4 py-2 flex items-center gap-2"
            title="Undo the last round"
          >
            <Undo2 className="w-4 h-4" aria-hidden="true" />
            Undo Round
          </button>
          <button
            onClick={handleRestart}
            className="btn-danger px-4 py-2 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reset Game
          </button>
        </AppHeader>

        {showResetModal && (
          <ConfirmResetModal onConfirm={confirmReset} onCancel={cancelReset} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Scoreboard
              players={gameState.players}
              rounds={gameState.rounds}
              endGameTarget={gameState.endGameTarget}
            />
            <RoundEntry
              players={gameState.players}
              onSubmit={handleRoundSubmit}
              deckConfig={gameState.deckConfig}
            />
          </div>
          <RoundHistory
            rounds={gameState.rounds}
            players={gameState.players}
            onDeleteRound={handleDeleteRound}
          />
        </div>

        <GameInsights
          players={gameState.players}
          rounds={gameState.rounds}
          endGameTarget={gameState.endGameTarget}
          roundTotalPoints={roundTotalPoints}
        />

        {showGameOver && (
          <GameOver
            players={gameState.players}
            roundsPlayed={gameState.rounds.length}
            endGameTarget={gameState.endGameTarget}
            onRestart={handleRestart}
          />
        )}

        {showAnimation && (
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
