export interface Player {
  id: string;
  name: string;
  totalScore: number;
}

export interface RoundScore {
  playerId: string;
  roundScore: number;
}

export interface Round {
  roundId: string;
  roundNumber: number;
  scores: RoundScore[];
  timestamp: string;
}

export interface DeckConfiguration {
  numberOfDecks: number;
  cardsToRemove: string[];
  cardsPerPlayer: number;
  totalCards: number;
}

export interface GameState {
  players: Player[];
  rounds: Round[];
  endGameTarget: number;
  deckConfig: DeckConfiguration;
}

export interface GameSettings {
  numberOfPlayers: number;
  endGameTarget: number;
  useDoubleDeck: boolean;
  deckConfig: DeckConfiguration;
}