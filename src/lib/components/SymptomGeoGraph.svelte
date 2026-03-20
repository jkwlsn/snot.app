<script lang="ts">
	import { scaleSqrt, scaleThreshold } from 'd3-scale';
	import { max } from 'd3-array';
	import { quantize } from 'd3-interpolate';
	import { interpolateYlOrRd } from 'd3-scale-chromatic';
	import { geoNaturalEarth1 } from 'd3-geo';
	import { Chart, Layer, Circle, Legend, GeoPath } from 'layerchart';
	import { createLayerchartGeoGraph as provider } from '$lib/graphs/providers/layerchartGeoGraph';
	import { feature } from 'topojson-client';
	import type { SymptomRecord } from '$lib/types';
	import type { FeatureCollection } from 'geojson';

	type Props = {
		title: string;
		records: SymptomRecord[];
	};

	type City = { name: string; scalerank: number; lat: number; lon: number };

	let { title, records }: Props = $props();

	const WORLD_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
	const NATURAL_EARTH_URL =
		'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places_simple.geojson';

	const mapData = fetch(WORLD_ATLAS_URL)
		.then((r) => r.json())
		.then((topology) => ({
			land: feature(topology, topology.objects.land) as unknown as FeatureCollection,
			countries: feature(topology, topology.objects.countries) as unknown as FeatureCollection
		}));

	const citiesData = fetch(NATURAL_EARTH_URL)
		.then((r) => r.json())
		.then((places) =>
			places.features
				.filter((f: any) => f.properties.scalerank <= 5)
				.map(
					(f: any): City => ({
						name: f.properties.name,
						scalerank: f.properties.scalerank,
						lat: f.geometry.coordinates[1],
						lon: f.geometry.coordinates[0]
					})
				)
		);

	const points = $derived(provider.transform(records ?? []));

	const scales = $derived.by(() => {
		const maxCount = max(points, (d) => d.count) ?? 1;
		const maxSeverity = max(points, (d) => d.value) ?? 20;
		const colors = quantize(interpolateYlOrRd, 5);

		return {
			rScale: scaleSqrt().domain([0, maxCount]).range([4, 30]),
			colorScale: scaleThreshold<number, string>()
				.domain([maxSeverity * 0.25, maxSeverity * 0.5, maxSeverity * 0.75, maxSeverity])
				.range(colors)
		};
	});

	const geojson = $derived({
		type: 'FeatureCollection' as const,
		features: points.map((p) => ({
			type: 'Feature' as const,
			geometry: { type: 'Point' as const, coordinates: [p.longitude, p.latitude] },
			properties: { value: p.value, count: p.count }
		}))
	});
</script>

<section style="height: 360px; overflow: hidden;">
	<h2>{title}</h2>

	{#await Promise.all([mapData, citiesData])}
		<p>Loading map...</p>
	{:then [{ land, countries }, cities]}
		<Chart
			padding={{ top: 60 }}
			height={300}
			geo={{
				projection: geoNaturalEarth1,
				fitGeojson: points.length > 0 ? geojson : land
			}}
			transform={{ mode: 'canvas', initialScrollMode: 'scale' }}
		>
			{#snippet children({ context })}
				{@const scale = context.transform.scale}
				{@const fontSize = 16 / scale}
				{@const dotRadius = 3 / scale}
				{@const strokeWidth = 1.5 / scale}

				{#snippet circleLayer(interactive: boolean)}
					<Layer>
						{#each points as point}
							{@const projected = context.geo?.projection?.([point.longitude, point.latitude])}
							{#if projected}
								{@const [cx, cy] = projected}
								<Circle
									{cx}
									{cy}
									r={scales.rScale(point.count)}
									fill={interactive ? 'transparent' : scales.colorScale(point.value)}
									fillOpacity={interactive ? 0 : 0.7}
									stroke={interactive ? 'none' : scales.colorScale(point.value)}
									strokeWidth={interactive ? 0 : strokeWidth}
									onpointermove={interactive ? (e) => context.tooltip?.show(e, point) : undefined}
									onpointerleave={interactive ? () => context.tooltip?.hide() : undefined}
								/>
							{/if}
						{/each}
					</Layer>
				{/snippet}

				<Layer>
					<GeoPath geojson={land} fill="oklch(0.86 0.12 144 / 89%)" />
					<GeoPath
						geojson={countries}
						fill="oklch(0.86 0.12 144 / 89%)"
						stroke="oklch(1 0 0 )"
						{strokeWidth}
					/>
				</Layer>

				{@render circleLayer(false)}
				{@render circleLayer(true)}

				<Layer>
					{#each cities as city}
						{@const projected = context.geo?.projection?.([city.lon, city.lat])}
						{#if projected && ((city.scalerank <= 1 && scale > 0.2) || (city.scalerank <= 4 && scale > 0.5) || (city.scalerank == 5 && scale >= 0.9))}
							{@const [cx, cy] = projected}
							<Circle {cx} {cy} r={dotRadius} />
							<text x={cx + 4 / scale} y={cy + 3 / scale} font-size={fontSize}>{city.name}</text>
						{/if}
					{/each}
				</Layer>

				<Legend scale={scales.colorScale} title="Avg severity" placement="top-left" />
			{/snippet}
		</Chart>
	{:catch error}
		<p>Failed to load map: {error.message}</p>
	{/await}
</section>
