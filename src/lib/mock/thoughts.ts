import type { Thought } from '$lib/types';

export const mockThoughts: Thought[] = [
  {
    id: 'mock-1',
    date: '2025-11-15',
    title: 'First time we met',
    description: 'A soft evening glow and nervous laughter. I still feel the warmth.',
    mood: 'warm',
    imageUrl: undefined
  },
  {
    id: 'mock-2',
    date: '2025-11-14',
    title: 'Your last performance in Germany',
    description: 'Lights, applause, and that grin that said everything was worth it.',
    mood: 'proud',
    imageUrl: undefined
  },
  {
    id: 'mock-3',
    date: '2025-11-13',
    title: 'Rainy walk',
    description: 'Umbrellas forgotten, soaked shoes, but the laughter stayed.',
    mood: 'calm',
    imageUrl: undefined
  }
];
