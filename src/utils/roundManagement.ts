import { GameState, Round, Player } from '../types';
import { recalculateTotalScores } from './roundUtils';
import { saveGameState } from './storage';

export const deleteRound = (
  gameState: GameState,
  roundNumber: number
): GameState => {
  const newRounds = gameState.rounds.filter(r => r.roundNumber !== roundNumber);
  const updatedPlayers = recalculateTotalScores(gameState.players, newRounds);
  
  const newGameState = {
    ...gameState,
    players: updatedPlayers,
    rounds: newRounds,
  };

  saveGameState(newGameState);
  return newGameState;
};