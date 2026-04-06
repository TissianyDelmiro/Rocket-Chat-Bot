import { useState, useEffect, useCallback } from 'react';

/**
 * Tipos de feedback possiveis.
 * null = sem feedback, 'up' = positivo, 'down' = negativo.
 *
 * Por que null e nao undefined?
 * Porque null e um valor explicito ("sem feedback"),
 * enquanto undefined significaria "nunca foi definido".
 * No JSON.stringify, null e preservado mas undefined e removido.
 */
export type FeedbackType = 'up' | 'down' | null;

const STORAGE_KEY = 'rocket-chat-feedback';

/**
 * Hook que gerencia feedbacks das mensagens.
 *
 * Estrutura no localStorage:
 * { "msg-id-1": "up", "msg-id-2": "down", "msg-id-3": null }
 *
 * Por que um hook separado e nao salvar junto com as mensagens?
 * Porque o feedback e independente do conteudo da mensagem.
 * Se o usuario editar/regenerar uma mensagem, o feedback antigo
 * nao faz mais sentido. Manter separado facilita limpar/gerenciar.
 */
export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<Record<string, FeedbackType>>({});
  const [loaded, setLoaded] = useState(false);

  // Carregar feedbacks do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFeedbacks(JSON.parse(stored));
    }
    setLoaded(true);
  }, []);

  // Sincronizar com localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
    }
  }, [feedbacks, loaded]);

  /**
   * Alternar feedback de uma mensagem.
   * Se o usuario clica no mesmo botao que ja esta ativo, remove o feedback (toggle).
   * Ex: clicou "up" e ja era "up" -> volta pra null.
   */
  const toggleFeedback = useCallback((messageId: string, type: 'up' | 'down') => {
    setFeedbacks((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === type ? null : type,
    }));
  }, []);

  const getFeedback = useCallback(
    (messageId: string): FeedbackType => {
      return feedbacks[messageId] ?? null;
    },
    [feedbacks],
  );

  return { toggleFeedback, getFeedback };
}