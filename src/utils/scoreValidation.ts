import { RoundScore, DeckConfiguration } from '../types';
import { calculateRoundPoints, RoundPoints } from './deckScoring';

export const calculateTotalPoints = (scores: RoundScore[]): number => {
  return scores.reduce((sum, score) => sum + score.roundScore, 0);
};

export const getRemainingPoints = (
  scores: RoundScore[], 
  roundPoints: RoundPoints
): number => {
  const currentTotal = calculateTotalPoints(scores);
  return roundPoints.totalPoints - currentTotal;
};

export const handleShootMoon = (
  scores: RoundScore[], 
  shooterPlayerId: string,
  roundPoints: RoundPoints
): RoundScore[] => {
  // When shooting the moon, all other players get the total points (26 in a 4-player game)
  // while the shooter gets 0
  return scores.map(score => ({
    playerId: score.playerId,
    roundScore: score.playerId === shooterPlayerId ? 0 : roundPoints.totalPoints
  }));
};