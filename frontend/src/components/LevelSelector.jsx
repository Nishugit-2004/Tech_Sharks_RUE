import React from 'react';

const levelStyles = {
  Beginner: 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/20 hover:bg-emerald-500/25',
  Intermediate: 'bg-amber-500/15 text-amber-200 border border-amber-500/20 hover:bg-amber-500/25',
  Advanced: 'bg-violet-500/15 text-violet-200 border border-violet-500/20 hover:bg-violet-500/25',
};

export default function LevelSelector({ selectedLevel, onChange, disabled = false }) {
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/5 p-1">
      {levels.map((level) => {
        const selected = selectedLevel === level;
        return (
          <button
            key={level}
            type="button"
            onClick={() => !disabled && onChange(level)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${selected ? levelStyles[level] : 'bg-white/5 text-gray-300 border border-white/10'} ${disabled ? 'cursor-not-allowed opacity-70' : 'hover:scale-[1.02]'}`}
          >
            {level}
          </button>
        );
      })}
    </div>
  );
}
