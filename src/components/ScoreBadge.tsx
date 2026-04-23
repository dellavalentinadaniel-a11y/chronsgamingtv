import React from 'react';
import { cn } from '../lib/utils';

interface ScoreBadgeProps {
  score: number;
  className?: string;
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  const getColor = (s: number) => {
    if (s >= 9) return 'text-green-400 border-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]';
    if (s >= 7) return 'text-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]';
    if (s >= 5) return 'text-orange-400 border-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]';
    return 'text-red-500 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className={cn(
      "flex items-center justify-center w-12 h-12 rounded-full border-2 bg-zinc-900/80 backdrop-blur-sm font-bold text-lg",
      getColor(score),
      className
    )}>
      {score.toFixed(1)}
    </div>
  );
}
