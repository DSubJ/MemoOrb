<script lang="ts">
  import type { Thought } from '$lib/types';
  import { formatDisplayDate } from '$lib/utils/dates';

  export let thought: Thought | null = null;
</script>

<div class="orb-main">
  <div class="orb-core">
    <div class="orb-sheen" aria-hidden="true"></div>
    {#if thought}
      <div class="orb-content">
        <p class="label">{formatDisplayDate(thought.date)}{thought.mood ? ` · ${thought.mood}` : ''}</p>
        <h1>{thought.title}</h1>
        {#if thought.description}
          <p class="description">{thought.description}</p>
        {/if}
      </div>
    {:else}
      <div class="orb-content">
        <p class="label">Today</p>
        <h1>No memory yet</h1>
        <p class="description">Send a warm note or add a photo so this day can glow.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .orb-main {
    position: relative;
    display: grid;
    place-items: center;
    width: min(85vw, var(--size-orb-main));
    height: min(85vw, var(--size-orb-main));
  }

  .orb-core {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at 40% 35%, rgba(243, 193, 105, 0.95), rgba(243, 193, 105, 0.3) 45%, rgba(10, 9, 17, 0.94) 68%);
    box-shadow: 0 0 120px rgba(243, 193, 105, 0.28), 0 0 180px rgba(243, 193, 105, 0.16), inset 0 0 50px rgba(0, 0, 0, 0.4);
    animation: pulseOrb var(--duration-orb-pulse) ease-in-out infinite;
    overflow: hidden;
  }

  .orb-sheen {
    position: absolute;
    inset: 12%;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.35), transparent 45%);
    filter: blur(18px);
    opacity: 0.7;
    animation: floatSlow var(--duration-orb-drift) ease-in-out infinite;
  }

  .orb-content {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 14px;
    z-index: 1;
    padding: 0 16%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .label {
    color: var(--color-text-muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.9rem;
  }

  h1 {
    font-size: clamp(1.4rem, 2vw, 2rem);
    line-height: 1.25;
    margin: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .description {
    max-width: 32ch;
    margin: 0 auto;
  }
</style>
