import { Player, Round } from '../types';

export interface PlayerSeries {
  playerId: string;
  name: string;
  /** Cumulative score after each round, starting at 0 before round 1. */
  points: number[];
}

export interface PlayerStats {
  playerId: string;
  name: string;
  averagePerRound: number;
  worstRound: number;
  moonShots: number;
  cleanRounds: number;
  queenCatches: number;
}

const scoreFor = (round: Round, playerId: string): number =>
  round.scores.find(s => s.playerId === playerId)?.roundScore ?? 0;

export const buildScoreSeries = (players: Player[], rounds: Round[]): PlayerSeries[] => {
  return players.map(player => {
    let runningTotal = 0;
    const points = [0];
    for (const round of rounds) {
      runningTotal += scoreFor(round, player.id);
      points.push(runningTotal);
    }
    return { playerId: player.id, name: player.name, points };
  });
};

/**
 * A moon shot round: the shooter took 0 while every other player was hit
 * with the full round total.
 */
export const isMoonShotRound = (
  round: Round,
  playerId: string,
  roundTotalPoints: number
): boolean => {
  if (round.scores.length < 2) return false;
  if (scoreFor(round, playerId) !== 0) return false;
  return round.scores
    .filter(s => s.playerId !== playerId)
    .every(s => s.roundScore === roundTotalPoints);
};

export const buildPlayerStats = (
  players: Player[],
  rounds: Round[],
  roundTotalPoints: number
): PlayerStats[] => {
  return players.map(player => {
    const scores = rounds.map(round => scoreFor(round, player.id));
    const total = scores.reduce((sum, score) => sum + score, 0);

    return {
      playerId: player.id,
      name: player.name,
      averagePerRound: rounds.length > 0 ? total / rounds.length : 0,
      worstRound: scores.length > 0 ? Math.max(...scores) : 0,
      moonShots: rounds.filter(round => isMoonShotRound(round, player.id, roundTotalPoints))
        .length,
      cleanRounds: scores.filter(score => score === 0).length,
      // Heuristic: a 13+ round almost always means they caught the Queen.
      queenCatches: scores.filter(score => score >= 13 && score < roundTotalPoints).length,
    };
  });
};
