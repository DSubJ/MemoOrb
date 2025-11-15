<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href="/icons/icon.svg" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<meta name="theme-color" content="#04060c" />
	<meta name="description" content="Gedanken Orbits – gemeinsame Erinnerungen als intime PWA." />
</svelte:head>

<sveltekit:service-worker></sveltekit:service-worker>

<div class="app-shell">
	<div class="noise-overlay" aria-hidden="true"></div>
	{@render children?.()}
</div>
