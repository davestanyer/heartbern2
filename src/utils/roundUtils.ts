import { Round, Player, RoundScore } from '../types';

export const getHighestScoringPlayer = (round: Round, players: Player[]): Player | null => {
  if (!round.scores.length) return null;
  
  const highestScore = Math.max(...round.scores.map(s => s.roundScore));
  const highestScorePlayerId = round.scores.find(s => s.roundScore === highestScore)?.playerId;
  
  return players.find(p => p.id === highestScorePlayerId) || null;
};

export const recalculateTotalScores = (players: Player[], rounds: Round[]): Player[] => {
  return players.map(player => ({
    ...player,
    totalScore: rounds.reduce((total, round) => {
      const roundScore = round.scores.find(s => s.playerId === player.id)?.roundScore || 0;
      return total + roundScore;
    }, 0)
  }));
};