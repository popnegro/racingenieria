export const PRIORITY_TOKENS = {
  Baja: {
    dot: 'bg-zinc-300',
    text: 'text-zinc-500 bg-zinc-50 border-zinc-100',
    bg: 'bg-zinc-50',
  },
  Media: {
    dot: 'bg-blue-400',
    text: 'text-blue-600 bg-blue-50 border-blue-100',
    bg: 'bg-blue-50',
  },
  Alta: {
    dot: 'bg-rose-500',
    text: 'text-rose-600 bg-rose-50 border-rose-100',
    bg: 'bg-rose-50',
  },
  Critica: {
    dot: 'bg-amber-600',
    text: 'text-amber-700 bg-amber-50 border-amber-100',
    bg: 'bg-amber-50',
  },
  "Crítica": {
    // Alias for accented priority used in data
    dot: 'bg-amber-600',
    text: 'text-amber-700 bg-amber-50 border-amber-100',
    bg: 'bg-amber-50',
  },
} as const;

export type PriorityKey = keyof typeof PRIORITY_TOKENS;
