import React from 'react';
import { Player } from '../types';
import { Trophy } from 'lucide-react';

interface GameOverProps {
  winner: Player;
  onRestart: () => void;
}

export default function GameOver({ winner, onRestart }: GameOverProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-6">
          🎉 {winner.name} wins with {winner.totalScore} points! 🎉
        </p>
        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Start New Game
        </button>
      </div>
    </div>
  );
}