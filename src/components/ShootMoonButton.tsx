import { Moon } from 'lucide-react';

interface ShootMoonButtonProps {
  onShootMoon: () => void;
}

export default function ShootMoonButton({ onShootMoon }: ShootMoonButtonProps) {
  return (
    <button
      type="button"
      onClick={onShootMoon}
      className="btn w-full mt-2 bg-yellow-600 hover:bg-yellow-500 text-white py-2 px-4 flex items-center justify-center gap-2"
    >
      <Moon className="w-5 h-5" aria-hidden="true" />
      Shoot the Moon
    </button>
  );
}