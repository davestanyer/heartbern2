import { DeckConfiguration } from '../types';

export interface RoundPoints {
  heartsPoints: number;
  queenPoints: number;
  totalPoints: number;
}

export const calculateRoundPoints = (deckConfig: DeckConfiguration): RoundPoints => {
  const { numberOfDecks, cardsToRemove } = deckConfig;
  
  // Count hearts and queens of spades that were removed
  const removedHearts = cardsToRemove.filter(card => card.includes('♥')).length;
  const removedQueens = cardsToRemove.filter(card => card === 'Q♠').length;
  
  // Calculate total hearts (13 per deck - removed hearts)
  const totalHearts = (13 * numberOfDecks) - removedHearts;
  
  // Calculate queens of spades (always keep just one queen regardless of deck count)
  const queensOfSpades = numberOfDecks === 2 ? 1 : (1 - removedQueens);
  
  return {
    heartsPoints: totalHearts, // Each heart is worth 1 point (changed from 2)
    queenPoints: queensOfSpades * 13, // Queen of spades is worth 13 points
    totalPoints: totalHearts + (queensOfSpades * 13) // Total points is hearts + queen
  };
};