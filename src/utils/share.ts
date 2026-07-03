import { Player } from '../types';

export const formatGameSummary = (
  players: Player[],
  roundsPlayed: number,
  endGameTarget: number
): string => {
  const standings = [...players].sort((a, b) => a.totalScore - b.totalScore);
  const medals = ['🥇', '🥈', '🥉'];
  const lines = standings.map((player, index) => {
    const marker = medals[index] ?? ` ${index + 1}.`;
    return `${marker} ${player.name} — ${player.totalScore}`;
  });

  return [
    '❤️‍🔥 HEART BERN — final standings',
    `${roundsPlayed} rounds · played to ${endGameTarget}`,
    '',
    ...lines,
  ].join('\n');
};

export type ShareOutcome = 'shared' | 'copied' | 'failed';

export const shareGameSummary = async (summary: string): Promise<ShareOutcome> => {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: 'HEART BERN results', text: summary });
      return 'shared';
    } catch (error) {
      // User cancelled or share failed; fall through to clipboard.
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'failed';
      }
    }
  }

  try {
    await navigator.clipboard.writeText(summary);
    return 'copied';
  } catch {
    return 'failed';
  }
};
