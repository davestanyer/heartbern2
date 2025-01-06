import { Trash2 } from 'lucide-react';
import { Round } from '../types';

interface RoundActionsProps {
  round: Round;
  onDelete: (round: Round) => void;
}

export default function RoundActions({ round, onDelete }: RoundActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onDelete(round)}
        className="p-1 hover:bg-red-700 rounded transition-colors"
        title="Delete round"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}