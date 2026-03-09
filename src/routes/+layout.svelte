<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import pwaIcon from '$lib/assets/pwa-icon-sneeze.svg';
	import appleTouchIcon from '$lib/assets/apple-touch-icon-180x180.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="icon" href={pwaIcon} sizes="any" type="image/svg+xml" />
	<link rel="apple-touch-icon" href={appleTouchIcon} />
</svelte:head>

{@render children()}
