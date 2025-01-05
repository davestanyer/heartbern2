export const calculateDeckRequirements = (
  playerCount: number,
  useDoubleDeck: boolean = false
): DeckConfiguration => {
  // Single deck configurations (3-7 players)
  if (!useDoubleDeck && playerCount <= 7) {
    switch (playerCount) {
      case 3:
        return {
          numberOfDecks: 1,
          cardsToRemove: ['2♣'],
          cardsPerPlayer: 17,
          totalCards: 51
        };
      case 4:
        return {
          numberOfDecks: 1,
          cardsToRemove: [],
          cardsPerPlayer: 13,
          totalCards: 52
        };
      case 5:
        return {
          numberOfDecks: 1,
          cardsToRemove: ['2♣', '2♦'],
          cardsPerPlayer: 10,
          totalCards: 50
        };
      case 6:
        return {
          numberOfDecks: 1,
          cardsToRemove: ['2♣', '2♦', '2♥', '2♠'],
          cardsPerPlayer: 8,
          totalCards: 48
        };
      case 7:
        return {
          numberOfDecks: 1,
          cardsToRemove: ['2♣', '2♦', '2♠'],
          cardsPerPlayer: 7,
          totalCards: 49
        };
    }
  }

  // Double deck configurations (8+ players or when explicitly requested)
  if (useDoubleDeck || playerCount >= 8) {
    switch (playerCount) {
      case 8:
        return {
          numberOfDecks: 2,
          cardsToRemove: ['2♣', '2♦', '3♣', '3♦', '4♣', '4♦', 'Q♠'],
          cardsPerPlayer: 12,
          totalCards: 96
        };
      case 9:
        return {
          numberOfDecks: 2,
          cardsToRemove: ['2♣', '2♦', '2♥', '2♠', '3♣', '3♦', '3♥', '3♠', 'Q♠'],
          cardsPerPlayer: 10,
          totalCards: 90
        };
      case 10:
        return {
          numberOfDecks: 2,
          cardsToRemove: ['2♣', '2♦', '2♥', '2♠', '3♣', '3♦', 'Q♠'],
          cardsPerPlayer: 9,
          totalCards: 90
        };
      case 11:
        return {
          numberOfDecks: 2,
          cardsToRemove: ['2♣', '2♦', '2♥', '2♠', 'Q♠'],
          cardsPerPlayer: 8,
          totalCards: 88
        };
      case 12:
        return {
          numberOfDecks: 2,
          cardsToRemove: ['2♣', '2♦', '2♥', '2♠', '3♣', '3♦', 'Q♠'],
          cardsPerPlayer: 8,
          totalCards: 96
        };
      default:
        // Fallback for unexpected player counts
        return {
          numberOfDecks: 2,
          cardsToRemove: ['2♣', '2♦', '2♥', '2♠', 'Q♠'],
          cardsPerPlayer: 8,
          totalCards: 88
        };
    }
  }

  // Fallback for unexpected cases
  return {
    numberOfDecks: 1,
    cardsToRemove: [],
    cardsPerPlayer: 13,
    totalCards: 52
  };
};

export const isGameOver = (players: Player[], endGameTarget: number): boolean => {
  return players.some(player => player.totalScore >= endGameTarget);
};

export const getWinner = (players: Player[]): Player => {
  return [...players].sort((a, b) => a.totalScore - b.totalScore)[0];
};