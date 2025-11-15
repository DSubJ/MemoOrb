<script lang="ts">
  import type { Thought } from '$lib/types';
  import { formatDisplayDate } from '$lib/utils/dates';

  export let thought: Thought;
  export let size: 'small' | 'medium' = 'small';
</script>

<div class={`orb-memory ${size}`}>
  <div class="blur-ring" aria-hidden="true"></div>
  <div class="orb-surface" style={`background-image: ${thought.imageUrl ? `url(${thought.imageUrl})` : 'radial-gradient(circle at 40% 40%, rgba(243, 193, 105, 0.45), rgba(10, 9, 17, 0.95))'};`}></div>
  <div class="overlay"></div>
  <div class="meta">
    <p class="label">{formatDisplayDate(thought.date)}</p>
    <p class="title">{thought.title}</p>
  </div>
</div>

<style>
  .orb-memory {
    position: relative;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45), 0 0 30px rgba(243, 193, 105, 0.18);
    transition: transform 200ms ease, box-shadow 200ms ease;
  }

  .orb-memory:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55), 0 0 40px rgba(243, 193, 105, 0.25);
  }

  .orb-memory.small { width: var(--size-orb-small); }
  .orb-memory.medium { width: var(--size-orb-medium); }

  .blur-ring {
    position: absolute;
    inset: 6%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(243, 193, 105, 0.4), rgba(243, 193, 105, 0));
    filter: blur(var(--blur-orb-edge));
    z-index: 0;
  }

  .orb-surface {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: saturate(0.95) sepia(0.6);
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 30%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.45) 70%);
  }

  .meta {
    position: absolute;
    inset: 12%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 16px;
    gap: 8px;
    z-index: 1;
    box-sizing: border-box;
  }

  .label {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .title {
    margin: 0;
    font-weight: 700;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
</style>
