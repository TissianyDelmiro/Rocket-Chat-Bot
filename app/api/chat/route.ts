import { streamText, UIMessage, convertToModelMessages, generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { SYSTEM_PROMPT, EVALUATION_PROMPT } from '@/app/lib/prompts';
import { extractTextFromFile } from '@/app/lib/file-parser';

async function extractFilesFromMessage(message: UIMessage): Promise<string> {
  const fileParts = message.parts.filter(
    (part): part is Extract<(typeof message.parts)[number], { type: 'file' }> =>
      part.type === 'file',
  );

  if (fileParts.length === 0) return '';

  const extractions = await Promise.all(
    fileParts.map(async (part) => {
      try {
        return await extractTextFromFile(part.url, part.mediaType, part.filename);
      } catch (err) {
        console.error('Erro ao extrair arquivo:', part.filename, err);
        return `[Erro ao processar o arquivo ${part.filename ?? 'desconhecido'}]`;
      }
    }),
  );

  return extractions
    .map((text, i) => {
      const truncated = text.length > 15000 ? text.slice(0, 15000) + '\n...[conteudo truncado]' : text;
      return `\n--- Conteudo do arquivo: ${fileParts[i].filename ?? 'arquivo'} ---\n${truncated}\n---`;
    })
    .join('\n');
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const lastMessage = messages[messages.length - 1];

    const userText = lastMessage.parts
      .filter((part): part is Extract<(typeof lastMessage.parts)[number], { type: 'text' }> =>
        part.type === 'text',
      )
      .map((part) => part.text)
      .join(' ');

    const evaluation = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: EVALUATION_PROMPT,
      prompt: userText,
    });

    try {
      const parsed = JSON.parse(evaluation.text);
      if (!parsed.safe) {
        const reason = parsed.reason ?? 'Mensagem bloqueada.';
        const result = streamText({
          model: groq('llama-3.3-70b-versatile'),
          prompt: `Responda exatamente isto ao usuário de forma educada: "${reason}". Diga que você só pode ajudar com programação, tecnologia e IA.`,
        });
        return result.toUIMessageStreamResponse();
      }
    } catch {
      // Se não conseguir parsear o JSON, deixa passar
    }

    const fileContent = await extractFilesFromMessage(lastMessage);

    const modelMessages = await convertToModelMessages(messages);

    if (fileContent) {
      const lastModelMsg = modelMessages[modelMessages.length - 1];
      if (lastModelMsg.role === 'user') {
        if (typeof lastModelMsg.content === 'string') {
          lastModelMsg.content = lastModelMsg.content + fileContent;
        } else if (Array.isArray(lastModelMsg.content)) {
          lastModelMsg.content = lastModelMsg.content
            .filter((part) => part.type === 'text')
            .concat({ type: 'text', text: fileContent });
        }
      }
    }

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error('Erro no chat route:', err);
    return Response.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 },
    );
  }
}