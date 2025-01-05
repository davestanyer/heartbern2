import React from 'react';
import { Moon } from 'lucide-react';

interface ShootMoonButtonProps {
  onShootMoon: () => void;
}

export default function ShootMoonButton({ onShootMoon }: ShootMoonButtonProps) {
  return (
    <button
      onClick={onShootMoon}
      className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      <Moon className="w-5 h-5" />
      Shoot the Moon
    </button>
  );
}