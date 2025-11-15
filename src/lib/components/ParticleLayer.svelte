<script lang="ts">
  export let count = 40;
  export let seed = 0;
const randomish = (n: number) => {
  const x = Math.sin(n * 999 + seed * 13) * 43758.5453;
  return x - Math.floor(x);
};

const particles = Array.from({ length: count }, (_, index) => {
  const variability = randomish(index);
  const size = 20 + variability * 80; // 20px .. ~100px
  const rawOpacity = 0.08 + variability * 0.22;
  const opacity = size >= 80 ? 0.3 : rawOpacity;
  const blur = (1 - variability) * 10; // depth effect
  const driftX = (variability - 0.5) * 30; // range -15..15px
  return {
    index,
    delay: ((index * 73 + seed * 13) % 24) * -1,
    duration: 18 + Math.floor(variability * 20),
    size,
    opacity,
    blur,
    driftX
  };
});
</script>

<div class="particle-layer" aria-hidden="true">
  {#each particles as particle}
    <span
      class="particle"
      style={`animation-duration:${particle.duration}s; animation-delay:${particle.delay}s; width:${particle.size}px; height:${particle.size}px; opacity:${particle.opacity}; left:${(particle.index * 37 + seed * 11) % 100}%; filter: blur(${particle.blur}px); --driftX:${particle.driftX}px;`}
    ></span>
  {/each}
</div>

<style>
  .particle-layer {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    filter: drop-shadow(0 0 14px rgba(243, 193, 105, 0.5));
    z-index: 0;
    mix-blend-mode: screen;
  }

  .particle {
    position: absolute;
    bottom: -10%;
    background: radial-gradient(circle, rgba(243, 193, 105, 0.85), rgba(243, 193, 105, 0));
    border-radius: 50%;
    animation-name: driftUp;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  @keyframes driftUp {
    0% {
      transform: translate3d(0, 0, 0) scale(0.8);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translate3d(calc(-16px + var(--driftX)), -140vh, 0) scale(1.2);
      opacity: 0;
    }
  }
</style>
