# Rocket Chat

Chatbot com IA construido com Next.js 16, Vercel AI SDK e Groq.

<img width="1316" height="974" alt="Captura de tela 2026-04-06 101948" src="https://github.com/user-attachments/assets/fb1e779a-2adf-46cf-890b-fe480d876c81" />
<img width="1640" height="972" alt="Captura de tela 2026-04-06 102013" src="https://github.com/user-attachments/assets/751b76d8-46d7-46d3-a7c4-ede2e1d8987e" />
<img width="1221" height="963" alt="image" src="https://github.com/user-attachments/assets/20b1095e-f685-44c9-8bc4-144aa9dfea71" />
<img width="1201" height="977" alt="image" src="https://github.com/user-attachments/assets/a556ac80-eaca-46c3-b677-d826820bcf98" />
<img width="864" height="703" alt="Design sem nome" src="https://github.com/user-attachments/assets/1c2fd17c-5bee-42a3-bee6-28d720cafb13" />





## Funcionalidades

- **Chat com streaming de texto** — respostas em tempo real usando Groq (LLaMA 3.3 70B)
- **Historico de conversas** — conversas salvas no localStorage com sidebar para alternar entre elas
- **Temas personalizaveis** — 5 temas de cores (Padrao, Oceano, Floresta, Por do sol, Lavanda) com CSS variables
- **Feedback nas respostas** — botoes de joinha para cima/baixo em cada resposta da IA, persistidos no localStorage
- **Sugestoes de prompts** — chips clicaveis na tela inicial para comecar uma conversa rapidamente
- **Geracao de imagens** — modo imagem usando Pollinations.ai (gratuito, sem API key)
- **Upload de arquivos** — suporte a PDF, XLSX e CSV com extracao automatica de texto
- **Filtro de seguranca** — avaliacao de mensagens para manter o foco em programacao e tecnologia
- **Markdown** — respostas renderizadas com tabelas, listas, codigo e formatacao

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/groq`)
- Lucide React (icones)
- react-markdown + remark-gfm
- pdfjs-dist + xlsx (parsing de arquivos)

## Como rodar

### 1. Instalar dependencias

```bash
cd rocket-chat
npm install
```

### 2. Configurar variaveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
GROQ_API_KEY=sua-chave-do-groq-aqui
```

Obtenha sua chave em [console.groq.com](https://console.groq.com).

### 3. Iniciar o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Estrutura do projeto

```
app/
  page.tsx                      # Pagina principal (composicao)
  components/
    chat-header.tsx             # Header com botao de menu mobile
    chat-message.tsx            # Mensagem de texto com markdown e feedback
    chat-input.tsx              # Input + file picker + mode toggle
    image-message.tsx           # Mensagem de imagem
    message-list.tsx            # Lista de mensagens + sugestoes
    message-feedback.tsx        # Botoes de joinha (up/down)
    prompt-suggestions.tsx      # Chips de sugestao na tela inicial
    sidebar.tsx                 # Sidebar com historico e temas
    theme-selector.tsx          # Seletor de cores do tema
    mode-toggle.tsx             # Toggle Texto/Imagem
    file-preview.tsx            # Preview do arquivo selecionado
    loading-dots.tsx            # Animacao de loading
  hooks/
    use-chat-history.ts         # Gerenciamento de conversas (localStorage)
    use-theme.ts                # Gerenciamento de temas (CSS variables)
    use-feedback.ts             # Feedback das respostas (localStorage)
    use-image-chat.ts           # Logica de geracao de imagem
    use-file-upload.ts          # Logica de upload de arquivo
  lib/
    types.ts                    # Tipos compartilhados
    constants.ts                # Constantes (MIME types, extensoes)
    prompts.ts                  # System prompt e filtro de seguranca
    file-parser.ts              # Extracao de texto (PDF, XLSX, CSV)
  api/
    chat/route.ts               # API de chat com streaming
    image/route.ts              # API de geracao de imagem
```
