import { describe, expect, it } from 'vitest';
import { buildScoreSeries, buildPlayerStats, isMoonShotRound } from './gameStats';
import { Player, Round } from '../types';

const players: Player[] = [
  { id: 'a', name: 'Ada', totalScore: 16 },
  { id: 'b', name: 'Bern', totalScore: 62 },
];

const round = (roundNumber: number, scores: [string, number][]): Round => ({
  roundId: `round-${roundNumber}`,
  roundNumber,
  scores: scores.map(([playerId, roundScore]) => ({ playerId, roundScore })),
  timestamp: new Date(2026, 0, roundNumber).toISOString(),
});

const rounds: Round[] = [
  round(1, [['a', 10], ['b', 16]]),
  round(2, [['a', 0], ['b', 26]]), // Ada shot the moon
  round(3, [['a', 6], ['b', 20]]),
];

describe('buildScoreSeries', () => {
  it('builds cumulative totals starting from zero', () => {
    const series = buildScoreSeries(players, rounds);
    expect(series.find(s => s.playerId === 'a')?.points).toEqual([0, 10, 10, 16]);
    expect(series.find(s => s.playerId === 'b')?.points).toEqual([0, 16, 42, 62]);
  });
});

describe('isMoonShotRound', () => {
  it('detects a moon shot: shooter at zero, all others at the round total', () => {
    expect(isMoonShotRound(rounds[1], 'a', 26)).toBe(true);
  });

  it('does not flag an ordinary zero-point round', () => {
    expect(isMoonShotRound(rounds[0], 'a', 26)).toBe(false);
  });

  it('does not flag the players who were hit by the moon shot', () => {
    expect(isMoonShotRound(rounds[1], 'b', 26)).toBe(false);
  });
});

describe('buildPlayerStats', () => {
  it('computes averages, worst rounds, clean rounds, queen catches and moon shots', () => {
    const stats = buildPlayerStats(players, rounds, 26);
    const ada = stats.find(s => s.playerId === 'a')!;
    const bern = stats.find(s => s.playerId === 'b')!;

    expect(ada.averagePerRound).toBeCloseTo(16 / 3);
    expect(ada.worstRound).toBe(10);
    expect(ada.cleanRounds).toBe(1);
    expect(ada.moonShots).toBe(1);
    expect(ada.queenCatches).toBe(0);

    expect(bern.worstRound).toBe(26);
    // Rounds 1 and 3 are 13+ but below the full 26 total.
    expect(bern.queenCatches).toBe(2);
    expect(bern.moonShots).toBe(0);
  });

  it('handles a game with no rounds', () => {
    const stats = buildPlayerStats(players, [], 26);
    expect(stats[0].averagePerRound).toBe(0);
    expect(stats[0].worstRound).toBe(0);
  });
});
