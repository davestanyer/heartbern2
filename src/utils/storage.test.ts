import { describe, expect, it } from 'vitest';
import {
  saveGameState,
  loadGameState,
  saveGameSetup,
  loadGameSetup,
  archiveCompletedGame,
  loadGameHistory,
  clearGameHistory,
  clearGameData,
} from './storage';
import { calculateDeckRequirements } from './gameLogic';
import { CompletedGame, GameState } from '../types';

const gameState: GameState = {
  players: [{ id: 'a', name: 'Ada', totalScore: 0 }],
  rounds: [],
  endGameTarget: 100,
  deckConfig: calculateDeckRequirements(4),
};

const completedGame = (id: string): CompletedGame => ({
  id,
  endedAt: new Date().toISOString(),
  endGameTarget: 100,
  roundsPlayed: 7,
  winnerName: 'Ada',
  standings: [{ name: 'Ada', totalScore: 42 }],
});

describe('game state persistence', () => {
  it('round-trips the game state', () => {
    saveGameState(gameState);
    expect(loadGameState()).toEqual(gameState);
  });

  it('returns null when nothing is stored', () => {
    expect(loadGameState()).toBeNull();
  });

  it('survives corrupt JSON instead of throwing', () => {
    localStorage.setItem('hearts-game-state', '{not json');
    expect(loadGameState()).toBeNull();
  });

  it('rejects data with the wrong shape', () => {
    localStorage.setItem('hearts-game-state', JSON.stringify({ players: 'nope' }));
    expect(loadGameState()).toBeNull();
  });

  it('clearGameData removes the game but keeps the saved setup', () => {
    saveGameState(gameState);
    saveGameSetup({
      settings: {
        numberOfPlayers: 4,
        endGameTarget: 100,
        useDoubleDeck: false,
        deckConfig: calculateDeckRequirements(4),
      },
      playerNames: ['Ada'],
    });

    clearGameData();

    expect(loadGameState()).toBeNull();
    expect(loadGameSetup()?.playerNames).toEqual(['Ada']);
  });
});

describe('game history', () => {
  it('archives games most-recent first', () => {
    archiveCompletedGame(completedGame('one'));
    archiveCompletedGame(completedGame('two'));

    expect(loadGameHistory().map(g => g.id)).toEqual(['two', 'one']);
  });

  it('does not duplicate a game archived twice', () => {
    archiveCompletedGame(completedGame('one'));
    archiveCompletedGame(completedGame('one'));
    expect(loadGameHistory()).toHaveLength(1);
  });

  it('caps history at 50 entries', () => {
    for (let i = 0; i < 55; i++) {
      archiveCompletedGame(completedGame(`game-${i}`));
    }
    expect(loadGameHistory()).toHaveLength(50);
    expect(loadGameHistory()[0].id).toBe('game-54');
  });

  it('recovers from corrupt history data', () => {
    localStorage.setItem('hearts-game-history', 'garbage');
    expect(loadGameHistory()).toEqual([]);
  });

  it('clears history', () => {
    archiveCompletedGame(completedGame('one'));
    clearGameHistory();
    expect(loadGameHistory()).toEqual([]);
  });
});
