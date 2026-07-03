import { describe, expect, it } from 'vitest';
import { calculateDeckRequirements, isGameOver, getWinner } from './gameLogic';
import { Player } from '../types';

const player = (name: string, totalScore: number): Player => ({
  id: name,
  name,
  totalScore,
});

describe('calculateDeckRequirements', () => {
  it('uses a single full deck for 4 players', () => {
    expect(calculateDeckRequirements(4)).toEqual({
      numberOfDecks: 1,
      cardsToRemove: [],
      cardsPerPlayer: 13,
      totalCards: 52,
    });
  });

  it('deals every card evenly for all single-deck player counts', () => {
    for (const count of [3, 4, 5, 6, 7]) {
      const config = calculateDeckRequirements(count, false);
      expect(config.numberOfDecks).toBe(1);
      expect(config.totalCards).toBe(52 - config.cardsToRemove.length);
      expect(config.cardsPerPlayer * count).toBe(config.totalCards);
    }
  });

  it('deals every card evenly for all double-deck player counts', () => {
    for (const count of [8, 9, 10, 11, 12]) {
      const config = calculateDeckRequirements(count);
      expect(config.numberOfDecks).toBe(2);
      expect(config.cardsPerPlayer * count).toBe(config.totalCards);
    }
  });

  it('always removes the duplicate Queen of Spades in double-deck games', () => {
    for (const count of [8, 9, 10, 11, 12]) {
      const config = calculateDeckRequirements(count);
      expect(config.cardsToRemove).toContain('Q♠');
    }
  });

  it('forces double deck at 8+ players even when not requested', () => {
    expect(calculateDeckRequirements(8, false).numberOfDecks).toBe(2);
  });

  it('supports opting into double deck for 5-7 players via the fallback config', () => {
    const config = calculateDeckRequirements(6, true);
    expect(config.numberOfDecks).toBe(2);
  });
});

describe('isGameOver', () => {
  it('ends the game when a player reaches the target exactly', () => {
    expect(isGameOver([player('a', 100), player('b', 40)], 100)).toBe(true);
  });

  it('keeps the game going when everyone is below the target', () => {
    expect(isGameOver([player('a', 99), player('b', 40)], 100)).toBe(false);
  });
});

describe('getWinner', () => {
  it('picks the player with the lowest total score', () => {
    const winner = getWinner([player('a', 80), player('b', 12), player('c', 100)]);
    expect(winner.name).toBe('b');
  });
});
