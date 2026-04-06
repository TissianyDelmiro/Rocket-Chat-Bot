import { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import type { ChatMode } from '@/app/lib/types';
import { FILE_ACCEPT } from '@/app/lib/constants';
import { ModeToggle } from './mode-toggle';
import { FilePreview } from './file-preview';

interface ChatInputProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  selectedFile: File | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: () => void;
}

export function ChatInput({
  mode,
  onModeChange,
  input,
  onInputChange,
  onSubmit,
  isLoading,
  selectedFile,
  onFileSelect,
  onFileRemove,
}: ChatInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const placeholder =
    mode === 'image'
      ? 'Descreva a imagem...'
      : selectedFile
        ? `Pergunte sobre ${selectedFile.name}...`
        : 'Digite sua mensagem...';

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
      <div className="max-w-2xl mx-auto">
        {selectedFile && (
          <FilePreview fileName={selectedFile.name} onRemove={onFileRemove} />
        )}

        <form onSubmit={onSubmit} className="flex gap-3 items-center">
          <ModeToggle mode={mode} onModeChange={onModeChange} />

          {mode === 'text' && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept={FILE_ACCEPT}
                onChange={onFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className={`rounded-xl border px-3 py-3 transition-all ${
                  selectedFile
                    ? 'border-emerald-400 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-500'
                } disabled:opacity-40`}
              >
                <Paperclip size={16} />
              </button>
            </>
          )}

          <input
            className="flex-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow placeholder:text-zinc-400"
            value={input}
            placeholder={placeholder}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className={`rounded-xl px-5 py-3 text-sm font-medium transition-opacity disabled:opacity-40 ${
              mode === 'image'
                ? 'bg-violet-600 text-white hover:opacity-90'
                : 'bg-foreground text-background hover:opacity-90'
            }`}
          >
            {mode === 'image' ? 'Gerar' : 'Enviar'}
          </button>
        </form>
      </div>
    </footer>
  );
}