<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<fieldset>
	<legend>{title}</legend>
	{@render children()}
</fieldset>

<style>
	fieldset {
		margin-bottom: 1em;
	}
</style>
