import type { Thought } from '$lib/types';

export const mockThoughts: Thought[] = [
  {
    id: 'mock-1',
    date: '2025-11-15',
    title: 'A beautiful sunset',
    description: 'The sky painted in shades of orange and pink, a moment of peace.',
    mood: 'warm',
    imageUrl: undefined
  },
  {
    id: 'mock-2',
    date: '2025-11-14',
    title: 'Morning coffee',
    description: 'The first sip of the day, steam rising, bringing clarity and calm.',
    mood: 'peaceful',
    imageUrl: undefined
  },
  {
    id: 'mock-3',
    date: '2025-11-13',
    title: 'Rainy afternoon',
    description: 'Raindrops on the window, the world slowing down for a moment.',
    mood: 'calm',
    imageUrl: undefined
  }
];
