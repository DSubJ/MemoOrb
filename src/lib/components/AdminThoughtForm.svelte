<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Thought } from '$lib/types';

  export let current: Thought | null = null;
  const dispatch = createEventDispatcher<{ save: { payload: Omit<Thought, 'imageUrl'>; file: File | null } }>();

  let title = '';
  let date = '';
  let description = '';
  let mood = '';
  let file: File | null = null;

  $: if (current) {
    title = current.title;
    date = current.date;
    description = current.description ?? '';
    mood = current.mood ?? '';
    file = null;
  }

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    dispatch('save', {
      payload: {
        id: current?.id ?? '',
        title,
        date,
        description,
        mood
      },
      file
    });
  };
</script>

<form class="glass-panel" on:submit|preventDefault={handleSubmit}>
  <div class="row">
    <div>
      <label for="title">Titel</label>
      <input id="title" name="title" required bind:value={title} placeholder="Kurzer Gedanke" />
    </div>
    <div>
      <label for="date">Datum</label>
      <input id="date" name="date" type="date" required bind:value={date} />
    </div>
  </div>

  <div>
    <label for="description">Beschreibung</label>
    <textarea id="description" name="description" rows={3} bind:value={description} placeholder="Optionaler längerer Text"></textarea>
  </div>

  <div class="row">
    <div>
      <label for="mood">Stimmung</label>
      <input id="mood" name="mood" bind:value={mood} placeholder="ruhig, witzig, melancholisch" />
    </div>
    <div>
      <label for="image">Foto</label>
      <input id="image" name="image" type="file" accept="image/*" on:change={(event) => (file = (event.currentTarget as HTMLInputElement).files?.[0] ?? null)} />
    </div>
  </div>

  <div class="actions">
    <button class="button" type="submit">{current ? 'Aktualisieren' : 'Anlegen'}</button>
    {#if current}
      <span class="hint">Bild leer lassen, um das bestehende zu behalten.</span>
    {/if}
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 18px;
  }

  .row {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .hint {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
</style>
