import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import type { ChatMode, ImageMessage as ImageMessageType } from '@/app/lib/types';
import type { FeedbackType } from '@/app/hooks/use-feedback';
import { ChatMessage } from './chat-message';
import { ImageMessage } from './image-message';
import { LoadingDots } from './loading-dots';
import { PromptSuggestions } from './prompt-suggestions';

interface MessageListProps {
  mode: ChatMode;
  messages: UIMessage[];
  imageMessages: ImageMessageType[];
  isLoading: boolean;
  error: Error | undefined;
  getFeedback: (messageId: string) => FeedbackType;
  onFeedbackToggle: (messageId: string, type: 'up' | 'down') => void;
  onSuggestionSelect: (prompt: string) => void;
}

export function MessageList({
  mode,
  messages,
  imageMessages,
  isLoading,
  error,
  getFeedback,
  onFeedbackToggle,
  onSuggestionSelect,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, imageMessages]);

  const showLoadingDots =
    isLoading &&
    (mode === 'text'
      ? messages[messages.length - 1]?.role !== 'assistant'
      : true);

  return (
    <main className="flex-1 overflow-y-auto px-6 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {mode === 'text' && messages.length === 0 && (
          <PromptSuggestions onSelect={onSuggestionSelect} />
        )}

        {mode === 'image' && imageMessages.length === 0 && (
          <p className="text-center text-zinc-400 dark:text-zinc-600 mt-20 text-sm">
            Descreva a imagem que deseja gerar.
          </p>
        )}

        {mode === 'text' &&
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              feedback={getFeedback(message.id)}
              onFeedbackToggle={onFeedbackToggle}
            />
          ))}

        {mode === 'image' &&
          imageMessages.map((msg) => (
            <ImageMessage key={msg.id} message={msg} />
          ))}

        {error && (
          <div className="flex justify-start">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-2xl rounded-bl-md px-4 py-3 text-sm">
              Erro: {error.message}
            </div>
          </div>
        )}

        {showLoadingDots && <LoadingDots />}

        <div ref={messagesEndRef} />
      </div>
    </main>
  );
}