import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { UIMessage } from 'ai';
import { MessageFeedback } from './message-feedback';
import type { FeedbackType } from '@/app/hooks/use-feedback';

const remarkPlugins = [remarkGfm];

interface ChatMessageProps {
  message: UIMessage;
  feedback?: FeedbackType;
  onFeedbackToggle?: (messageId: string, type: 'up' | 'down') => void;
}

/**
 * Componente de mensagem do chat.
 *
 * A classe "group" no div externo permite que filhos usem "group-hover:"
 * para aparecer/sumir quando o mouse esta sobre a mensagem.
 * Os botoes de feedback usam "opacity-0 group-hover:opacity-100".
 */
export function ChatMessage({ message, feedback, onFeedbackToggle }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`group flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div>
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser ? 'rounded-br-md' : 'rounded-bl-md'
          }`}
          style={
            isUser
              ? { backgroundColor: 'var(--user-bubble)', color: 'var(--user-text)' }
              : { backgroundColor: 'var(--assistant-bubble)', color: 'var(--foreground)' }
          }
        >
          {message.parts.map((part, i) => {
            if (part.type === 'text') {
              return isUser ? (
                <span key={`${message.id}-${i}`}>{part.text}</span>
              ) : (
                <div
                  key={`${message.id}-${i}`}
                  className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-table:my-2 prose-th:px-3 prose-th:py-1 prose-td:px-3 prose-td:py-1 prose-th:border prose-td:border prose-th:border-zinc-300 prose-td:border-zinc-300 dark:prose-th:border-zinc-600 dark:prose-td:border-zinc-600"
                >
                  <ReactMarkdown remarkPlugins={remarkPlugins}>
                    {part.text}
                  </ReactMarkdown>
                </div>
              );
            }
            if (part.type === 'file') {
              return (
                <span
                  key={`${message.id}-${i}`}
                  className="inline-flex items-center gap-1.5 bg-black/10 dark:bg-white/10 rounded-lg px-2 py-1 text-xs mr-1"
                >
                  <FileText size={12} />
                  {part.filename ?? 'arquivo'}
                </span>
              );
            }
            return null;
          })}
        </div>

        {/* Feedback so aparece nas mensagens do assistente */}
        {!isUser && onFeedbackToggle && (
          <MessageFeedback
            messageId={message.id}
            feedback={feedback ?? null}
            onToggle={onFeedbackToggle}
          />
        )}
      </div>
    </div>
  );
}