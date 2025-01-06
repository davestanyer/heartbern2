import { GameState } from '../types';
import { recalculateTotalScores } from './roundUtils';
import { saveGameState } from './storage';

export const deleteRound = (
  gameState: GameState,
  roundNumber: number
): GameState => {
  const newRounds = gameState.rounds.filter(r => r.roundNumber !== roundNumber);
  const updatedPlayers = recalculateTotalScores(gameState.players, newRounds);
  
  const reindexedRounds = newRounds.map((round, index) => ({ ...round, roundNumber: index + 1 }));

  const newGameState = {
    ...gameState,
    players: updatedPlayers,
    rounds: reindexedRounds,
  };

  saveGameState(newGameState);
  return newGameState;
};