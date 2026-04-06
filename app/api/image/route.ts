export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;

  const response = await fetch(imageUrl);

  if (!response.ok) {
    return Response.json({ error: 'Falha ao gerar imagem' }, { status: 500 });
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');

  return Response.json({ image: base64 });
}