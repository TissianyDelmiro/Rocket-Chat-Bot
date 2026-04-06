export type ChatMode = 'text' | 'image';

export interface ImageMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
}