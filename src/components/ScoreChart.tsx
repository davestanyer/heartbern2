import { Player, Round } from '../types';
import { buildScoreSeries } from '../utils/gameStats';

interface ScoreChartProps {
  players: Player[];
  rounds: Round[];
  endGameTarget: number;
}

const LINE_COLORS = [
  '#f43f5e', '#38bdf8', '#fbbf24', '#34d399', '#a78bfa', '#fb923c',
  '#f472b6', '#4ade80', '#22d3ee', '#facc15', '#c084fc', '#f87171',
];

const WIDTH = 560;
const HEIGHT = 280;
const PAD = { top: 16, right: 16, bottom: 28, left: 36 };

export default function ScoreChart({ players, rounds, endGameTarget }: ScoreChartProps) {
  if (rounds.length === 0) {
    return (
      <p className="text-sm text-emerald-200/60 py-6 text-center">
        The chart appears once the first round is in.
      </p>
    );
  }

  const series = buildScoreSeries(players, rounds);
  const maxScore = Math.max(endGameTarget, ...series.flatMap(s => s.points));
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  const x = (roundIndex: number) => PAD.left + (roundIndex / rounds.length) * plotWidth;
  const y = (score: number) => PAD.top + plotHeight - (score / maxScore) * plotHeight;

  const yTicks = [0, Math.round(maxScore / 2), maxScore];
  // Cap the number of x labels so long games stay readable.
  const xLabelStep = Math.max(1, Math.ceil(rounds.length / 8));

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Score progression over ${rounds.length} rounds`}
      >
        {yTicks.map(tick => (
          <g key={tick}>
            <line
              x1={PAD.left}
              y1={y(tick)}
              x2={WIDTH - PAD.right}
              y2={y(tick)}
              stroke="#1f5136"
              strokeWidth="1"
            />
            <text x={PAD.left - 6} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#86efac">
              {tick}
            </text>
          </g>
        ))}

        <line
          x1={PAD.left}
          y1={y(endGameTarget)}
          x2={WIDTH - PAD.right}
          y2={y(endGameTarget)}
          stroke="#f87171"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text
          x={WIDTH - PAD.right}
          y={y(endGameTarget) - 5}
          textAnchor="end"
          fontSize="11"
          fill="#f87171"
        >
          target {endGameTarget}
        </text>

        {Array.from({ length: rounds.length + 1 }, (_, i) => i)
          .filter(i => i % xLabelStep === 0 || i === rounds.length)
          .map(i => (
            <text
              key={i}
              x={x(i)}
              y={HEIGHT - PAD.bottom + 18}
              textAnchor="middle"
              fontSize="11"
              fill="#86efac"
            >
              {i}
            </text>
          ))}

        {series.map((playerSeries, seriesIndex) => {
          const color = LINE_COLORS[seriesIndex % LINE_COLORS.length];
          const path = playerSeries.points
            .map((score, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(score)}`)
            .join(' ');
          return (
            <g key={playerSeries.playerId}>
              <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
              {playerSeries.points.map((score, i) => (
                <circle key={i} cx={x(i)} cy={y(score)} r="3" fill={color} />
              ))}
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {series.map((playerSeries, seriesIndex) => (
          <span key={playerSeries.playerId} className="flex items-center gap-1.5 text-sm">
            <span
              aria-hidden="true"
              className="inline-block w-3 h-1 rounded-full"
              style={{ backgroundColor: LINE_COLORS[seriesIndex % LINE_COLORS.length] }}
            />
            {playerSeries.name}
          </span>
        ))}
      </div>
    </div>
  );
}
