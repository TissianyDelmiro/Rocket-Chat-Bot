import { useState } from 'react';
import type { ImageMessage } from '@/app/lib/types';

export function useImageChat() {
  const [imageMessages, setImageMessages] = useState<ImageMessage[]>([]);
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageGeneration = async (prompt: string) => {
    setImageLoading(true);
    setImageMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', content: prompt },
    ]);

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Falha ao gerar imagem');

      const data = await res.json();
      setImageMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: prompt,
          image: data.image,
        },
      ]);
    } catch {
      setImageMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Erro ao gerar imagem. Tente novamente.',
        },
      ]);
    } finally {
      setImageLoading(false);
    }
  };

  return { imageMessages, imageLoading, handleImageGeneration };
}