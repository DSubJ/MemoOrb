<script lang="ts">
  import type { Thought } from '$lib/types';
  import OrbMain from './OrbMain.svelte';
  import OrbMemory from './OrbMemory.svelte';
  import ParticleLayer from './ParticleLayer.svelte';

  export let today: Thought | null = null;
  export let memories: Thought[] = [];
</script>

<section class="stage">
  <ParticleLayer count={50} />
  <div class="orb-stack">
    {#each memories as memory, index}
      <div class={`memory memory-${index}`}>
        <OrbMemory thought={memory} size={index % 2 === 0 ? 'medium' : 'small'} />
      </div>
    {/each}
    <div class="main">
      <OrbMain thought={today} />
    </div>
  </div>
</section>

<style>
  .stage {
    position: relative;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 3rem 1.5rem 4rem;
    overflow: hidden;
    background: radial-gradient(60% 60% at 50% 45%, rgba(243, 193, 105, 0.12), transparent 60%);
    isolation: isolate;
  }

  .orb-stack {
    position: relative;
    width: min(1024px, 90vw);
    display: grid;
    place-items: center;
    z-index: 1;
  }

  .main {
    position: relative;
    z-index: 2;
  }

  .memory {
    position: absolute;
    z-index: 1;
    animation: floatSlow var(--duration-orb-drift) ease-in-out infinite;
  }

  .memory-0 { top: 8%; left: 12%; }
  .memory-1 { bottom: 10%; left: 8%; animation-delay: -3s; }
  .memory-2 { top: 16%; right: 16%; animation-delay: -6s; }
  .memory-3 { bottom: 12%; right: 8%; animation-delay: -1s; }
  .memory-4 { top: 4%; right: 35%; animation-delay: -9s; }
  .memory-5 { bottom: 4%; left: 32%; animation-delay: -5s; }

  @media (max-width: 768px) {
    .memory { opacity: 0.55; filter: blur(1px); }
    .memory-0 { top: 4%; left: 4%; }
    .memory-1 { bottom: 6%; left: -4%; }
    .memory-2 { top: 10%; right: -6%; }
    .memory-3 { bottom: 6%; right: 2%; }
  }
</style>
