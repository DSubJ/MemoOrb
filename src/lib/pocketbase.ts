import PocketBase, { type RecordModel } from 'pocketbase';
import { POCKETBASE_URL } from './config';
import { writable } from 'svelte/store';

const pb = new PocketBase(POCKETBASE_URL);
pb.autoCancellation(false);

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange(() => {
  currentUser.set(pb.authStore.model);
});

export const pocketbase = pb;

export type ThoughtRecord = RecordModel & {
  date: string;
  title: string;
  description?: string;
  mood?: string;
  image?: string;
};

export type SettingsRecord = RecordModel & {
  timeZoneOwner?: string | null;
  timeZoneFriend?: string | null;
};

export function fileUrl(record: RecordModel, fileName?: string | null, options?: Record<string, string>) {
  if (!fileName) return undefined;
  return pb.files.getUrl(record, fileName, options);
}
