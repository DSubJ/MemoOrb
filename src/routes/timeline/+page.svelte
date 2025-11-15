<script lang="ts">
  import OrbMemory from "$lib/components/OrbMemory.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<section class="timeline">
  <div class="intro glass-panel">
    <p class="eyebrow">MemoOrb</p>
    <h2>All orbs in a single timeline</h2>
    <p>Browse each day; the newest memories bloom at the top.</p>
  </div>

  <div class="grid">
    {#each data.thoughts as thought, index}
      <OrbMemory {thought} size={index % 3 === 0 ? "medium" : "small"} />
    {/each}
  </div>
</section>

<style>
  .timeline {
    padding: 2rem 1.5rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
    background: radial-gradient(
      70% 70% at 50% 30%,
      rgba(243, 193, 105, 0.08),
      transparent 65%
    );
    border-radius: 18px;
  }

  .intro {
    padding: 20px 22px;
    margin-bottom: 16px;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--color-text-muted);
    font-weight: 700;
    margin: 0 0 6px 0;
  }

  h2 {
    margin: 0 0 6px 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px;
    justify-items: center;
  }
</style>
