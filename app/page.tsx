'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { UIMessage } from 'ai';
import type { ChatMode } from './lib/types';
import { ChatHeader } from './components/chat-header';
import { MessageList } from './components/message-list';
import { ChatInput } from './components/chat-input';
import { Sidebar } from './components/sidebar';
import { useImageChat } from './hooks/use-image-chat';
import { useFileUpload } from './hooks/use-file-upload';
import { useChatHistory } from './hooks/use-chat-history';
import { useTheme } from './hooks/use-theme';
import { useFeedback } from './hooks/use-feedback';

/**
 * Salvar e carregar mensagens do localStorage.
 * Cada conversa tem sua propria chave: "rocket-chat-msgs-{id}"
 *
 * Por que separar das conversas?
 * Porque mensagens podem ser grandes (especialmente com arquivos).
 * Mantendo separado, a lista de conversas carrega rapido,
 * e as mensagens so carregam quando a conversa e selecionada.
 */
function saveMessages(conversationId: string, messages: UIMessage[]) {
  const cleaned = messages.map((msg) => ({
    ...msg,
    parts: msg.parts.filter((p) => p.type !== 'file'),
  }));
  localStorage.setItem(`rocket-chat-msgs-${conversationId}`, JSON.stringify(cleaned));
}

/**
 * typeof window === 'undefined' verifica se estamos no servidor (SSR).
 * No servidor, nao existe localStorage — retornamos array vazio.
 * Esse check e necessario porque Next.js renderiza componentes no servidor primeiro.
 */
function loadMessages(conversationId: string): UIMessage[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`rocket-chat-msgs-${conversationId}`);
  if (!stored) return [];
  return JSON.parse(stored);
}

export default function Chat() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('text');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { themeId, setThemeId } = useTheme();
  const { toggleFeedback, getFeedback } = useFeedback();

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    deleteConversation,
    updateTitle,
    loaded,
  } = useChatHistory();

  /**
   * initialMessages: carrega mensagens salvas do localStorage quando troca de conversa.
   * O useChat usa isso como ponto de partida — as mensagens aparecem imediatamente
   * sem precisar fazer fetch no servidor.
   */
  const { messages, sendMessage, status, error } = useChat({
    id: activeConversationId,
    messages: loadMessages(activeConversationId),
  });

  const { imageMessages, imageLoading, handleImageGeneration } = useImageChat();
  const { selectedFile, handleFileSelect, removeFile, fileToFileUIPart } = useFileUpload();

  const isLoading = status === 'streaming' || status === 'submitted' || imageLoading;

  /**
   * Salvar mensagens no localStorage sempre que mudam.
   * Usamos um ref para o ID ativo para evitar dependencia circular.
   */
  const activeIdRef = useRef(activeConversationId);
  activeIdRef.current = activeConversationId;

  useEffect(() => {
    if (messages.length > 0 && activeIdRef.current) {
      saveMessages(activeIdRef.current, messages);
    }
  }, [messages]);

  const titleSetRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeConversationId || messages.length === 0) return;
    if (titleSetRef.current[activeConversationId]) return;

    const firstUserMsg = messages.find((m) => m.role === 'user');
    if (!firstUserMsg) return;

    const textPart = firstUserMsg.parts.find((p) => p.type === 'text');
    if (textPart && textPart.type === 'text') {
      const title = textPart.text.slice(0, 40) + (textPart.text.length > 40 ? '...' : '');
      titleSetRef.current[activeConversationId] = true;
      updateTitle(activeConversationId, title);
    }
  }, [messages, activeConversationId, updateTitle]);

  const handleDelete = useCallback(
    (id: string) => {
      // Limpar mensagens salvas ao deletar conversa
      localStorage.removeItem(`rocket-chat-msgs-${id}`);
      deleteConversation(id);
    },
    [deleteConversation],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedFile) || isLoading) return;

    if (mode === 'image') {
      if (input.trim()) handleImageGeneration(input);
      setInput('');
      return;
    }

    if (selectedFile) {
      const filePart = await fileToFileUIPart(selectedFile);
      sendMessage({
        text: input || `Analise o arquivo: ${selectedFile.name}`,
        files: [filePart],
      });
      removeFile();
    } else {
      sendMessage({ text: input });
    }
    setInput('');
  };

  if (!loaded) return null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
        onCreate={createConversation}
        onDelete={handleDelete}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTheme={themeId}
        onThemeChange={setThemeId}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />
        <MessageList
          mode={mode}
          messages={messages}
          imageMessages={imageMessages}
          isLoading={isLoading}
          error={error}
          getFeedback={getFeedback}
          onFeedbackToggle={toggleFeedback}
          onSuggestionSelect={(prompt) => sendMessage({ text: prompt })}
        />
        <ChatInput
          mode={mode}
          onModeChange={setMode}
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onFileRemove={removeFile}
        />
      </div>
    </div>
  );
}