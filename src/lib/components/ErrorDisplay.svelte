<script lang="ts">
	import { clearAppError, appErrorState } from '$lib/errors';

	function dismissError() {
		clearAppError();
	}
</script>

{#if appErrorState.error}
	{@const currentError = appErrorState.error}
	<div>
		<p><strong>Error {currentError.code}:</strong> {currentError.message}</p>
		{#if currentError.details}
			<pre>{JSON.stringify(currentError.details, null, 2)}</pre>
		{/if}
		<button on:click={dismissError}>X</button>
	</div>
{/if}
