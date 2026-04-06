import { THEMES, type ThemeId } from '@/app/hooks/use-theme';

interface ThemeSelectorProps {
  activeTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export function ThemeSelector({ activeTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
      <span className="text-[10px] uppercase tracking-wider text-zinc-400 mb-2 block">
        Tema
      </span>
      <div className="flex gap-1.5">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            title={theme.label}
            className="relative p-0.5"
          >
            <div
              className={`w-5 h-5 rounded-full transition-transform hover:scale-105 ${
                theme.id === 'default' ? 'border border-zinc-500' : ''
              }`}
              style={{ backgroundColor: theme.preview }}
            />
            {activeTheme === theme.id && (
              <div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: theme.preview }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}