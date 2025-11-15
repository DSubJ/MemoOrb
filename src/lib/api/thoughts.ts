import { pocketbase, type ThoughtRecord, type SettingsRecord, fileUrl } from '$lib/pocketbase';
import type { Thought, Settings } from '$lib/types';

export async function fetchThoughtForDate(date: string): Promise<Thought | null> {
  try {
    const record = await pocketbase.collection('thoughts').getFirstListItem(`date = "${date}"`);
    return mapThought(record as ThoughtRecord);
  } catch (error) {
    return null;
  }
}

export async function fetchMemories(limit = 6): Promise<Thought[]> {
  const list = await pocketbase.collection('thoughts').getList<ThoughtRecord>(1, limit, {
    filter: 'image != null',
    sort: '-date'
  });
  return list?.items?.map(mapThought) ?? [];
}

export async function fetchAllThoughts(): Promise<Thought[]> {
  const list = await pocketbase.collection('thoughts').getFullList<ThoughtRecord>({
    sort: '-date'
  });
  return list.map(mapThought);
}

export async function upsertThought(payload: Partial<ThoughtRecord> & { id?: string }, image?: File | null) {
  const formData = new FormData();
  if (payload.date) formData.append('date', payload.date);
  if (payload.title) formData.append('title', payload.title);
  if (payload.description !== undefined) formData.append('description', payload.description ?? '');
  if (payload.mood !== undefined) formData.append('mood', payload.mood ?? '');
  if (image) formData.append('image', image);

  if (payload.id) {
    return pocketbase.collection('thoughts').update(payload.id, formData);
  }
  return pocketbase.collection('thoughts').create(formData);
}

export async function deleteThought(id: string) {
  return pocketbase.collection('thoughts').delete(id);
}

export async function fetchSettings(): Promise<Settings | null> {
  try {
    const record = await pocketbase.collection('settings').getFirstListItem('', { requestKey: 'settings' });
    return mapSettings(record as SettingsRecord);
  } catch (error) {
    return null;
  }
}

export function mapThought(record: ThoughtRecord): Thought {
  return {
    id: record.id,
    date: record.date,
    title: record.title,
    description: record.description,
    mood: record.mood,
    imageUrl: fileUrl(record, record.image, { thumb: '800x800' })
  };
}

export function mapSettings(record: SettingsRecord): Settings {
  return {
    timeZoneOwner: record.timeZoneOwner,
    timeZoneFriend: record.timeZoneFriend
  };
}
