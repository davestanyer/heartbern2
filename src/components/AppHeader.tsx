import React from 'react';

interface AppHeaderProps {
  children?: React.ReactNode;
}

export default function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="text-rose-500">HEART</span> BERN{' '}
          <span aria-hidden="true">❤️‍🔥</span>
        </h1>
        <p className="text-sm text-emerald-200/60 mt-1">
          <span aria-hidden="true">♠ ♥ ♦ ♣</span> The Hearts score keeper
        </p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}
