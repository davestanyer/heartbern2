import { describe, expect, it } from 'vitest';
import { getHighestScoringPlayer, recalculateTotalScores } from './roundUtils';
import { Player, Round } from '../types';

const players: Player[] = [
  { id: 'a', name: 'Ada', totalScore: 0 },
  { id: 'b', name: 'Bern', totalScore: 0 },
];

const round = (roundNumber: number, scores: [string, number][]): Round => ({
  roundId: `round-${roundNumber}`,
  roundNumber,
  scores: scores.map(([playerId, roundScore]) => ({ playerId, roundScore })),
  timestamp: new Date(2026, 0, roundNumber).toISOString(),
});

describe('getHighestScoringPlayer', () => {
  it('finds the player who took the most points in the round', () => {
    const result = getHighestScoringPlayer(round(1, [['a', 6], ['b', 20]]), players);
    expect(result?.id).toBe('b');
  });

  it('returns null for a round with no scores', () => {
    expect(getHighestScoringPlayer(round(1, []), players)).toBeNull();
  });
});

describe('recalculateTotalScores', () => {
  it('sums every round for each player', () => {
    const rounds = [round(1, [['a', 10], ['b', 16]]), round(2, [['a', 0], ['b', 26]])];
    const result = recalculateTotalScores(players, rounds);

    expect(result.find(p => p.id === 'a')?.totalScore).toBe(10);
    expect(result.find(p => p.id === 'b')?.totalScore).toBe(42);
  });

  it('treats missing scores as zero', () => {
    const rounds = [round(1, [['a', 26]])];
    const result = recalculateTotalScores(players, rounds);
    expect(result.find(p => p.id === 'b')?.totalScore).toBe(0);
  });
});
