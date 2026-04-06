import { ThumbsUp, ThumbsDown } from 'lucide-react';
import type { FeedbackType } from '@/app/hooks/use-feedback';

/**
 * Botoes de feedback para mensagens do assistente.
 *
 * Aparecem ao passar o mouse sobre a mensagem (controlado pelo pai via CSS group-hover).
 * O botao ativo fica com cor de destaque, os inativos ficam transparentes.
 *
 * Conceito: "toggle" — clicar no mesmo botao desativa o feedback.
 * Isso e melhor UX do que ter um botao separado de "remover feedback".
 */
interface MessageFeedbackProps {
  messageId: string;
  feedback: FeedbackType;
  onToggle: (messageId: string, type: 'up' | 'down') => void;
}

export function MessageFeedback({ messageId, feedback, onToggle }: MessageFeedbackProps) {
  return (
    <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={() => onToggle(messageId, 'up')}
        className={`p-1 rounded-md transition-colors ${
          feedback === 'up'
            ? 'text-emerald-500'
            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
        }`}
        title="Boa resposta"
      >
        <ThumbsUp size={13} />
      </button>
      <button
        onClick={() => onToggle(messageId, 'down')}
        className={`p-1 rounded-md transition-colors ${
          feedback === 'down'
            ? 'text-red-500'
            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
        }`}
        title="Resposta ruim"
      >
        <ThumbsDown size={13} />
      </button>
    </div>
  );
}