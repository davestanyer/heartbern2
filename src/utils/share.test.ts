import { describe, expect, it } from 'vitest';
import { formatGameSummary } from './share';
import { Player } from '../types';

const players: Player[] = [
  { id: 'b', name: 'Bern', totalScore: 102 },
  { id: 'a', name: 'Ada', totalScore: 34 },
  { id: 'c', name: 'Cleo', totalScore: 78 },
  { id: 'd', name: 'Dot', totalScore: 91 },
];

describe('formatGameSummary', () => {
  it('lists players lowest-score first with medals for the top three', () => {
    const summary = formatGameSummary(players, 9, 100);
    const lines = summary.split('\n');

    expect(lines[0]).toContain('HEART BERN');
    expect(lines[1]).toBe('9 rounds · played to 100');
    expect(lines[3]).toBe('🥇 Ada — 34');
    expect(lines[4]).toBe('🥈 Cleo — 78');
    expect(lines[5]).toBe('🥉 Dot — 91');
    expect(lines[6]).toBe(' 4. Bern — 102');
  });
});
