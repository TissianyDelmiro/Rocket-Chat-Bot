import { Plus, Trash2, MessageSquare } from 'lucide-react';
import type { Conversation } from '@/app/lib/types';
import { ThemeSelector } from './theme-selector';
import type { ThemeId } from '@/app/hooks/use-theme';

/**
 * Sidebar que mostra a lista de conversas.
 *
 * Conceitos:
 * - Recebe dados via props (nao faz fetch nem gerencia estado)
 * - O componente pai (page.tsx) controla qual conversa esta ativa
 * - Isso segue o padrao "lifting state up" do React:
 *   o estado fica no nivel mais alto que precisa dele
 */
interface SidebarProps {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activeTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  isOpen,
  onClose,
  activeTheme,
  onThemeChange,
}: SidebarProps) {
  return (
    <>
      {/* Overlay escuro quando a sidebar esta aberta no mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Botao de nova conversa */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={onCreate}
            className="flex items-center gap-2 w-full rounded-xl bg-foreground text-background px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Nova conversa
          </button>
        </div>

        {/* Lista de conversas */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                conv.id === activeId
                  ? 'bg-zinc-200 dark:bg-zinc-800 font-medium'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
              onClick={() => {
                onSelect(conv.id);
                onClose();
              }}
            >
              <MessageSquare size={14} className="shrink-0 text-zinc-400" />
              <span className="flex-1 truncate">{conv.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Evita que o click propague para o div pai
                  onDelete(conv.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </nav>

        {/* Seletor de tema no rodape da sidebar */}
        <ThemeSelector activeTheme={activeTheme} onThemeChange={onThemeChange} />
      </aside>
    </>
  );
}