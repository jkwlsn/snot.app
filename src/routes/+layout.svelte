<script lang="ts">
	import '$lib/pwa.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>My Awesome App</title>
	<meta name="description" content="My Awesome App description" />
</svelte:head>

{@render children()}
