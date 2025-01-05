import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface RoundActionsProps {
  roundNumber: number;
  onEdit: (roundNumber: number) => void;
  onDelete: (roundNumber: number) => void;
}

export default function RoundActions({ roundNumber, onEdit, onDelete }: RoundActionsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(roundNumber)}
        className="p-1 hover:bg-gray-700 rounded transition-colors"
        title="Edit round"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(roundNumber)}
        className="p-1 hover:bg-red-700 rounded transition-colors"
        title="Delete round"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}