import { fetchAllThoughts } from '$lib/api/thoughts';
import { pocketbase } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
  if (!pocketbase.authStore.isValid || pocketbase.authStore.model?.role !== 'admin') {
    throw redirect(302, '/auth/login');
  }

  const thoughts = await fetchAllThoughts();
  return { thoughts, user: pocketbase.authStore.model };
};
