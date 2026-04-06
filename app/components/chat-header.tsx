import { Menu } from 'lucide-react';

/**
 * Header do chat.
 * O botao de menu (hamburguer) abre a sidebar no mobile.
 * No desktop a sidebar fica sempre visivel, entao o botao fica escondido via md:hidden.
 */
interface ChatHeaderProps {
  onMenuClick: () => void;
}

export function ChatHeader({ onMenuClick }: ChatHeaderProps) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="md:hidden p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <Menu size={20} />
      </button>
      <h1 className="text-lg font-semibold tracking-tight font-sans">
        Rocket Chat
      </h1>
    </header>
  );
}