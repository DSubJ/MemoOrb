<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  const slides = [
    "Hi Brenton and Douglas,",
    "I built this little web app to let you know whenever a memory of our time together pops into my ADHD brain.",
    "The memories are shown here as orbs and arranged in chronological order.",
  ];

  let index = 0;
  let show = true;
  let finished = false;
  const displayMs = 3000; // visible time before fade
  const fadeMs = 2000; // fade-out duration

  onMount(() => {
    const cycle = () => {
      setTimeout(() => {
        show = false;
        setTimeout(() => {
          if (index < slides.length - 1) {
            index += 1;
            show = true;
            cycle();
          } else {
            finished = true;
          }
        }, fadeMs);
      }, displayMs);
    };
    cycle();
  });
</script>

<section class="hero">
  <div class="copy">
    {#if show}
      <p class="message" transition:fade={{ duration: fadeMs }}>
        {slides[index]}
      </p>
    {/if}

    {#if finished}
      <div class="cta" transition:fade={{ duration: fadeMs }}>
        <a class="button" href="/">Enter</a>
      </div>
    {/if}
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3.5rem 1.5rem 2rem;
    background: #05060c;
    color: var(--color-text-primary);
  }

  .copy {
    max-width: 720px;
    padding: 28px 32px;
    text-align: center;
  }

  .message {
    font-size: clamp(1.4rem, 3vw, 2.4rem);
    line-height: 1.4;
    margin: 0;
  }

  .cta {
    margin-top: 24px;
  }
</style>
