<script lang="ts">
  import { getEnvironmentState } from "$lib/environment";
  import { getPollenName } from "$lib/environment/utils";
  import { getSettingsContext } from "$lib/settings";
  import type { PollenType } from "$lib/environment/types";

  const env = getEnvironmentState();
  const settings = getSettingsContext();

  function toggleSelectedPollenType(pollenId: PollenType) {
    env.togglePollenType(pollenId);
    settings.update("selectedPollenTypes", [...env.selectedPollenTypes]);
  }
</script>

<div>
  {#each env.supportedPollenTypes as pollenId (pollenId)}
    <label>
      <input
        type="checkbox"
        checked={env.selectedPollenTypes.includes(pollenId)}
        onchange={() => toggleSelectedPollenType(pollenId)}
      />
      {getPollenName(pollenId)}
    </label>
  {/each}
</div>
