import { describe, expect, it } from 'vitest';
import { deleteRound } from './roundManagement';
import { calculateDeckRequirements } from './gameLogic';
import { GameState, Round } from '../types';

const round = (roundNumber: number, scores: [string, number][]): Round => ({
  roundId: `round-${roundNumber}`,
  roundNumber,
  scores: scores.map(([playerId, roundScore]) => ({ playerId, roundScore })),
  timestamp: new Date(2026, 0, roundNumber).toISOString(),
});

const buildGameState = (): GameState => ({
  players: [
    { id: 'a', name: 'Ada', totalScore: 16 },
    { id: 'b', name: 'Bern', totalScore: 62 },
  ],
  rounds: [
    round(1, [['a', 10], ['b', 16]]),
    round(2, [['a', 0], ['b', 26]]),
    round(3, [['a', 6], ['b', 20]]),
  ],
  endGameTarget: 100,
  deckConfig: calculateDeckRequirements(4),
});

describe('deleteRound', () => {
  it('removes the round and recalculates totals', () => {
    const state = deleteRound(buildGameState(), 2);

    expect(state.rounds).toHaveLength(2);
    expect(state.players.find(p => p.id === 'a')?.totalScore).toBe(16);
    expect(state.players.find(p => p.id === 'b')?.totalScore).toBe(16 + 20);
  });

  it('reindexes remaining rounds sequentially', () => {
    const state = deleteRound(buildGameState(), 1);
    expect(state.rounds.map(r => r.roundNumber)).toEqual([1, 2]);
  });

  it('persists the updated state to localStorage', () => {
    deleteRound(buildGameState(), 3);
    const stored = JSON.parse(localStorage.getItem('hearts-game-state')!);
    expect(stored.rounds).toHaveLength(2);
  });
});
