<script lang="ts">
  import ThoughtStage from '$lib/components/ThoughtStage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<div class="hero">
  <div class="copy glass-panel">
    <p class="eyebrow">Thought Orbits</p>
    <h2>One warm thought each day, making the distance feel smaller.</h2>
    <p>
      You open the app and it shows exactly the thought for today's date. No list—
      just a glowing orb in a quiet room of memories.
    </p>
    <div class="actions">
      <a class="button" href="/timeline">Alle Erinnerungen</a>
      <a class="button secondary" href="/auth/login">Admin Login</a>
    </div>
  </div>
</div>

<ThoughtStage today={data.todayThought} memories={data.memories} />

<style>
  .hero {
    display: flex;
    justify-content: center;
    padding: 3.5rem 1.5rem 2rem;
  }

  .copy {
    max-width: 720px;
    padding: 22px 24px;
    margin: 0 auto;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-text-muted);
    font-weight: 700;
    margin: 0 0 8px 0;
  }

  h2 {
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    margin-bottom: 10px;
  }

  .actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 14px;
  }
</style>
