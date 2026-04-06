import { useState, useEffect, useCallback } from 'react';
import type { Conversation } from '@/app/lib/types';

// Chave usada no localStorage para guardar a lista de conversas
const STORAGE_KEY = 'rocket-chat-conversations';

// Gera um ID unico simples (timestamp + random)
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/**
 * Hook que gerencia o historico de conversas no localStorage.
 *
 * Como funciona:
 * 1. Na primeira renderizacao, carrega as conversas salvas do localStorage
 * 2. Sempre que a lista muda, sincroniza de volta no localStorage via useEffect
 * 3. Cada conversa tem um ID unico que o useChat usa como `id` para separar mensagens
 *
 * Por que localStorage?
 * - Persiste entre recarregamentos da pagina
 * - Nao precisa de backend/banco de dados
 * - Limite de ~5MB (suficiente para texto)
 */
export function useChatHistory() {
  // Estado da lista de conversas
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // ID da conversa ativa
  const [activeConversationId, setActiveConversationId] = useState<string>('');

  // Flag para saber se ja carregou do localStorage (evita sobrescrever antes de carregar)
  const [loaded, setLoaded] = useState(false);

  // 1. Carregar conversas do localStorage na montagem do componente
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: Conversation[] = JSON.parse(stored);
      setConversations(parsed);
      // Ativar a conversa mais recente
      if (parsed.length > 0) {
        setActiveConversationId(parsed[0].id);
      }
    }

    // Se nao tem nenhuma conversa, criar uma
    if (!stored || JSON.parse(stored).length === 0) {
      const first: Conversation = {
        id: generateId(),
        title: 'Nova conversa',
        createdAt: Date.now(),
      };
      setConversations([first]);
      setActiveConversationId(first.id);
    }

    setLoaded(true);
  }, []);

  // 2. Sincronizar estado -> localStorage sempre que a lista muda
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations, loaded]);

  // 3. Criar nova conversa
  const createConversation = useCallback(() => {
    const newConv: Conversation = {
      id: generateId(),
      title: 'Nova conversa',
      createdAt: Date.now(),
    };
    // Adiciona no inicio da lista (mais recente primeiro)
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  }, []);

  // 4. Deletar conversa
  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        // Se deletou a conversa ativa, ativar outra
        if (id === activeConversationId) {
          if (updated.length > 0) {
            setActiveConversationId(updated[0].id);
          } else {
            // Se nao sobrou nenhuma, criar uma nova
            const fresh: Conversation = {
              id: generateId(),
              title: 'Nova conversa',
              createdAt: Date.now(),
            };
            setActiveConversationId(fresh.id);
            return [fresh];
          }
        }
        return updated;
      });
    },
    [activeConversationId],
  );

  // 5. Atualizar titulo da conversa (ex: baseado na primeira mensagem)
  const updateTitle = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c)),
    );
  }, []);

  return {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    updateTitle,
    loaded,
  };
}