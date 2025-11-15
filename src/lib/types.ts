export interface Thought {
  id: string;
  date: string;
  title: string;
  description?: string;
  mood?: string;
  imageUrl?: string;
}

export interface Settings {
  timeZoneOwner?: string | null;
  timeZoneFriend?: string | null;
}
