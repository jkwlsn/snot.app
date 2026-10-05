<script lang="ts">
    import { page } from "$app/state";
    import { getEntryService, type Entry } from "$lib/entries";
    import { SYMPTOMS } from "$lib/symptoms";
    import { getPollenName, getPollenUnit } from "$lib/environment/utils";
    import { getLoggingService } from "$lib/logging";
    import { handleError } from "$lib/errors";

    const entryId = $derived(Number(page.params.id));
    const service = getEntryService();
    const logger = getLoggingService();

    let entry = $state<Entry | undefined>(undefined);
    let loading = $state(true);

    $effect(() => {
        const id = entryId;
        if (isNaN(id)) {
            loading = false;
            return;
        }
        loading = true;
        service
            .getOneEntry(id)
            .then((res) => {
                entry = res;
            })
            .catch((err) => {
                handleError({
                    error: err,
                    operation: "getOneEntry",
                    logger,
                    show: true,
                });
            })
            .finally(() => {
                loading = false;
            });
    });
</script>

<div class="entry-detail">
    {#if loading}
        <p>Loading entry...</p>
    {:else if !entry}
        <p class="error">Entry not found (ID: {page.params.id})</p>
    {:else}
        <h2>Entry #{entry.id}</h2>

        <section class="section">
            <h3>Metadata</h3>
            <table>
                <tbody>
                    <tr>
                        <th>Date</th>
                        <td>{entry.createdAt?.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th>Timezone</th>
                        <td>{entry.timezone}</td>
                    </tr>
                    {#if entry.location}
                        <tr>
                            <th>Location</th>
                            <td>{entry.location.label}</td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </section>

        <section class="section">
            <h3>Symptoms</h3>
            <table>
                <thead>
                    <tr>
                        <th>Symptom</th>
                        <th>Severity</th>
                    </tr>
                </thead>
                <tbody>
                    {#each SYMPTOMS as symptom}
                        <tr>
                            <td>{symptom.name}</td>
                            <td>{entry.symptoms?.[symptom.name] ?? 0}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </section>

        {#if entry.pollen && entry.pollen.length > 0}
            <section class="section">
                <h3>Pollen Levels</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Pollen Type</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each entry.pollen as p}
                            <tr>
                                <td>{getPollenName(p.type)}</td>
                                <td>{p.value} {getPollenUnit(p.unit)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </section>
        {/if}
    {/if}
    <div class="back-link">
        <a href="/history">&larr; Back to History</a>
    </div>
</div>
