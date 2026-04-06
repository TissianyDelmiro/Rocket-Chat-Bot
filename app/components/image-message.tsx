import type { ImageMessage as ImageMessageType } from '@/app/lib/types';

interface ImageMessageProps {
  message: ImageMessageType;
}

export function ImageMessage({ message }: ImageMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-foreground text-background rounded-br-md'
            : 'bg-zinc-100 dark:bg-zinc-800 rounded-bl-md'
        }`}
      >
        {isUser && message.content}
        {message.image && (
          <img
            src={`data:image/png;base64,${message.image}`}
            alt={message.content}
            className="rounded-xl mt-2 max-w-full"
          />
        )}
        {!message.image && !isUser && message.content}
      </div>
    </div>
  );
}