<script lang="ts">
	import { BarChart } from 'layerchart';
	import { SYMPTOMS } from '$lib/config';
	import { createLayerchartStackedBarGraph as provider } from '$lib/graphs';
	import type { SymptomRecord } from '$lib/types';

	type Props = {
		title: string;
		records: SymptomRecord[];
	};

	const { title, records }: Props = $props();

	const data = $derived(provider.transform(records ?? []));

	const series = SYMPTOMS.map((symptom, i) => ({
		key: symptom.name,
		label: symptom.description,
		color: [
			'oklch(78% 0.18 260)',
			'oklch(72% 0.18 200)',
			'oklch(68% 0.20 145)',
			'oklch(62% 0.22 35)'
		][i]
	}));
</script>

<section>
	<h2>{title}</h2>
	<BarChart
		{data}
		x="timestamp"
		{series}
		seriesLayout="stack"
		props={{
			xAxis: { format: 'day' },
			yAxis: { format: 'decimal' },
			tooltip: {
				header: { format: 'day' }
			}
		}}
		legend={true}
		height={200}
	/>
</section>
