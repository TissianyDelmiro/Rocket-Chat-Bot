import { MessageSquare, Image } from 'lucide-react';
import type { ChatMode } from '@/app/lib/types';

interface ModeToggleProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex gap-1 rounded-xl border border-zinc-300 dark:border-zinc-700 p-1">
      <button
        type="button"
        onClick={() => onModeChange('text')}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
          mode === 'text'
            ? 'bg-foreground text-background shadow-sm'
            : 'text-zinc-500 hover:text-foreground'
        }`}
      >
        <MessageSquare size={14} />
        Texto
      </button>
      <button
        type="button"
        onClick={() => onModeChange('image')}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
          mode === 'image'
            ? 'bg-violet-600 text-white shadow-sm'
            : 'text-zinc-500 hover:text-foreground'
        }`}
      >
        <Image size={14} />
        Imagem
      </button>
    </div>
  );
}