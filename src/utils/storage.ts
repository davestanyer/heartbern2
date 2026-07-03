import { GameState, SavedGameSetup, CompletedGame } from '../types';

const STORAGE_KEY = 'hearts-game-state';
const SETTINGS_KEY = 'hearts-game-settings';
const HISTORY_KEY = 'hearts-game-history';

const MAX_HISTORY_ENTRIES = 50;

const safeParse = <T>(raw: string | null, isValid: (value: unknown) => value is T): T | null => {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isGameState = (value: unknown): value is GameState =>
  isRecord(value) &&
  Array.isArray(value.players) &&
  Array.isArray(value.rounds) &&
  typeof value.endGameTarget === 'number' &&
  isRecord(value.deckConfig);

const isSavedGameSetup = (value: unknown): value is SavedGameSetup =>
  isRecord(value) && isRecord(value.settings) && Array.isArray(value.playerNames);

const isCompletedGameList = (value: unknown): value is CompletedGame[] =>
  Array.isArray(value) &&
  value.every(
    entry =>
      isRecord(entry) &&
      typeof entry.id === 'string' &&
      typeof entry.winnerName === 'string' &&
      Array.isArray(entry.standings)
  );

export const saveGameState = (state: GameState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const loadGameState = (): GameState | null =>
  safeParse(localStorage.getItem(STORAGE_KEY), isGameState);

export const saveGameSetup = (setup: SavedGameSetup): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(setup));
};

export const loadGameSetup = (): SavedGameSetup | null =>
  safeParse(localStorage.getItem(SETTINGS_KEY), isSavedGameSetup);

export const loadGameHistory = (): CompletedGame[] =>
  safeParse(localStorage.getItem(HISTORY_KEY), isCompletedGameList) ?? [];

export const archiveCompletedGame = (game: CompletedGame): void => {
  const history = loadGameHistory().filter(entry => entry.id !== game.id);
  history.unshift(game);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ENTRIES)));
};

export const clearGameHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const clearGameData = (): void => {
  // Keep the saved setup so the next game starts pre-filled.
  localStorage.removeItem(STORAGE_KEY);
};
