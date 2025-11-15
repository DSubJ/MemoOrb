<script lang="ts">
  import ThoughtStage from '$lib/components/ThoughtStage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<ThoughtStage today={data.todayThought} memories={data.memories} />
