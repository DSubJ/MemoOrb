import { fetchMemories, fetchThoughtForDate } from '$lib/api/thoughts';
import { todayISO } from '$lib/utils/dates';

export const load = async () => {
  const [todayThought, memories] = await Promise.all([
    fetchThoughtForDate(todayISO()),
    fetchMemories(6)
  ]);

  return { todayThought, memories };
};
