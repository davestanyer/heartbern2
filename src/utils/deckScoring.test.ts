import { describe, expect, it } from 'vitest';
import { calculateRoundPoints } from './deckScoring';
import { calculateDeckRequirements } from './gameLogic';

describe('calculateRoundPoints', () => {
  it('is the classic 26 points for a 4-player single deck', () => {
    const points = calculateRoundPoints(calculateDeckRequirements(4));
    expect(points).toEqual({ heartsPoints: 13, queenPoints: 13, totalPoints: 26 });
  });

  it('drops a point per removed heart (6 players removes the 2♥)', () => {
    const points = calculateRoundPoints(calculateDeckRequirements(6, false));
    expect(points.heartsPoints).toBe(12);
    expect(points.queenPoints).toBe(13);
    expect(points.totalPoints).toBe(25);
  });

  it('keeps exactly one Queen of Spades in double-deck games', () => {
    const points = calculateRoundPoints(calculateDeckRequirements(8));
    // 26 hearts across two decks, none removed for 8 players; one queen kept.
    expect(points.heartsPoints).toBe(26);
    expect(points.queenPoints).toBe(13);
    expect(points.totalPoints).toBe(39);
  });

  it('accounts for removed hearts in double-deck games (9 players)', () => {
    const points = calculateRoundPoints(calculateDeckRequirements(9));
    // 9-player config removes 2♥ and 3♥.
    expect(points.heartsPoints).toBe(24);
    expect(points.totalPoints).toBe(37);
  });
});
