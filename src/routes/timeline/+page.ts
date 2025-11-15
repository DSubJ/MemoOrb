import { fetchAllThoughts } from '$lib/api/thoughts';

export const load = async () => {
  const thoughts = await fetchAllThoughts();
  return { thoughts };
};
