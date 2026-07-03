import { describe, expect, it } from 'vitest';
import { calculateTotalPoints, getRemainingPoints, handleShootMoon } from './scoreValidation';
import { RoundPoints } from './deckScoring';

const roundPoints: RoundPoints = { heartsPoints: 13, queenPoints: 13, totalPoints: 26 };

describe('calculateTotalPoints', () => {
  it('sums all round scores', () => {
    expect(
      calculateTotalPoints([
        { playerId: 'a', roundScore: 10 },
        { playerId: 'b', roundScore: 16 },
      ])
    ).toBe(26);
  });
});

describe('getRemainingPoints', () => {
  it('reports how many points are still unassigned', () => {
    expect(
      getRemainingPoints(
        [
          { playerId: 'a', roundScore: 5 },
          { playerId: 'b', roundScore: 8 },
        ],
        roundPoints
      )
    ).toBe(13);
  });

  it('is zero once all points are distributed', () => {
    expect(getRemainingPoints([{ playerId: 'a', roundScore: 26 }], roundPoints)).toBe(0);
  });
});

describe('handleShootMoon', () => {
  it('gives the shooter zero and everyone else the full round total', () => {
    const result = handleShootMoon(
      [
        { playerId: 'shooter', roundScore: 26 },
        { playerId: 'b', roundScore: 0 },
        { playerId: 'c', roundScore: 0 },
      ],
      'shooter',
      roundPoints
    );

    expect(result).toEqual([
      { playerId: 'shooter', roundScore: 0 },
      { playerId: 'b', roundScore: 26 },
      { playerId: 'c', roundScore: 26 },
    ]);
  });
});
