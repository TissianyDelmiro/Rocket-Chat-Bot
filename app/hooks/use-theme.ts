import { useState, useEffect } from 'react';

/**
 * Temas disponiveis.
 * Cada tema define cores para as bolhas do usuario, do assistente e cor de destaque.
 *
 * Por que um array de objetos e nao um enum?
 * Porque precisamos dos valores de CSS junto com o nome e label para exibir na UI.
 * Um enum so teria o nome, e precisariamos de um mapeamento separado.
 */
export const THEMES = [
  {
    id: 'default',
    label: 'Padrao',
    // Cores das bolhas e destaque
    userBubble: 'var(--foreground)',
    userText: 'var(--background)',
    assistantBubble: '#f4f4f5',       // zinc-100
    assistantBubbleDark: '#27272a',   // zinc-800
    accent: '#18181b',                // zinc-900
    accentDark: '#fafafa',            // zinc-50
    // Cor para preview no seletor
    preview: '#18181b',
  },
  {
    id: 'ocean',
    label: 'Oceano',
    userBubble: '#0369a1',            // sky-700
    userText: '#ffffff',
    assistantBubble: '#e0f2fe',       // sky-100
    assistantBubbleDark: '#0c4a6e',   // sky-900
    accent: '#0284c7',                // sky-600
    accentDark: '#38bdf8',            // sky-400
    preview: '#0284c7',
  },
  {
    id: 'forest',
    label: 'Floresta',
    userBubble: '#15803d',            // green-700
    userText: '#ffffff',
    assistantBubble: '#dcfce7',       // green-100
    assistantBubbleDark: '#14532d',   // green-900
    accent: '#16a34a',                // green-600
    accentDark: '#4ade80',            // green-400
    preview: '#16a34a',
  },
  {
    id: 'sunset',
    label: 'Por do sol',
    userBubble: '#c2410c',            // orange-700
    userText: '#ffffff',
    assistantBubble: '#ffedd5',       // orange-100
    assistantBubbleDark: '#431407',   // orange-950
    accent: '#ea580c',                // orange-600
    accentDark: '#fb923c',            // orange-400
    preview: '#ea580c',
  },
  {
    id: 'lavender',
    label: 'Lavanda',
    userBubble: '#7c3aed',            // violet-600
    userText: '#ffffff',
    assistantBubble: '#ede9fe',       // violet-100
    assistantBubbleDark: '#2e1065',   // violet-950
    accent: '#7c3aed',                // violet-600
    accentDark: '#a78bfa',            // violet-400
    preview: '#7c3aed',
  },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const STORAGE_KEY = 'rocket-chat-theme';

/**
 * Hook que gerencia o tema do chat.
 *
 * Como funciona:
 * 1. Carrega o tema salvo do localStorage (ou usa 'default')
 * 2. Aplica as CSS variables no :root do documento
 * 3. Quando o usuario troca, salva no localStorage e reaplica
 *
 * Por que CSS variables e nao classes do Tailwind?
 * Porque os temas sao dinamicos (definidos em runtime pelo usuario).
 * Classes do Tailwind sao geradas em build time — nao da pra criar
 * classes como `bg-[#0369a1]` dinamicamente. Ja CSS variables podem
 * ser alteradas com JavaScript a qualquer momento.
 */
export function useTheme() {
  const [themeId, setThemeId] = useState<ThemeId>('default');

  // Carregar tema salvo na montagem
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (stored && THEMES.some((t) => t.id === stored)) {
      setThemeId(stored);
    }
  }, []);

  // Aplicar CSS variables quando o tema muda
  useEffect(() => {
    const theme = THEMES.find((t) => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    root.style.setProperty('--user-bubble', theme.userBubble);
    root.style.setProperty('--user-text', theme.userText);
    // Escolher cor da bolha do assistente baseado no modo claro/escuro
    root.style.setProperty(
      '--assistant-bubble',
      isDark ? theme.assistantBubbleDark : theme.assistantBubble,
    );
    root.style.setProperty('--accent', isDark ? theme.accentDark : theme.accent);

    localStorage.setItem(STORAGE_KEY, themeId);

    // Reagir quando o usuario troca dark/light no sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      root.style.setProperty(
        '--assistant-bubble',
        e.matches ? theme.assistantBubbleDark : theme.assistantBubble,
      );
      root.style.setProperty('--accent', e.matches ? theme.accentDark : theme.accent);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeId]);

  return { themeId, setThemeId, themes: THEMES };
}