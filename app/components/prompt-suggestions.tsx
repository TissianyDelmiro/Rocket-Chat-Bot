import { Code, Brain, Lightbulb, Database } from 'lucide-react';

/**
 * Sugestoes de prompt para a tela inicial do chat.
 *
 * Cada sugestao tem:
 * - icon: componente do lucide-react para visual
 * - label: texto curto exibido no chip
 * - prompt: texto completo enviado ao chat ao clicar
 *
 * Por que separar label de prompt?
 * O label e curto para caber no chip. O prompt pode ser mais detalhado
 * para dar contexto melhor ao modelo de IA.
 *
 * O array e definido fora do componente (hoisted) para nao recriar a cada render.
 */
const SUGGESTIONS = [
  {
    icon: Code,
    label: 'Explique closures em JS',
    prompt: 'Explique o conceito de closures em JavaScript com exemplos praticos.',
  },
  {
    icon: Brain,
    label: 'O que e machine learning?',
    prompt: 'O que e machine learning? Explique de forma simples com exemplos do dia a dia.',
  },
  {
    icon: Lightbulb,
    label: 'Dicas de React',
    prompt: 'Quais sao as melhores praticas para otimizar performance em React?',
  },
  {
    icon: Database,
    label: 'SQL vs NoSQL',
    prompt: 'Qual a diferenca entre bancos SQL e NoSQL? Quando usar cada um?',
  },
];

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div className="flex flex-col items-center gap-6 mt-16">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">Como posso ajudar?</h2>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Escolha uma sugestao ou digite sua pergunta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.label}
            onClick={() => onSelect(suggestion.prompt)}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 px-4 py-3 text-sm text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <suggestion.icon size={16} className="shrink-0 text-zinc-400" />
            <span>{suggestion.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}