<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		id: string;
		name: string;
		address: string;
		port: number;
		description: string;
		playerCount: number;
		maxPlayers: number;
		gamemode?: string;
		tags: string[];
		online: boolean;
		region?: string;
		iconUrl?: string;
	}

	let { id, name, address, port, description, playerCount, maxPlayers, gamemode, tags, online, region, iconUrl }: Props = $props();

	const playerPercentage = $derived(Math.round((playerCount / maxPlayers) * 100));
</script>

<a
	href="/servers/{id}"
	class="group block rounded-xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
>
	<div class="flex items-start gap-4">
		<!-- Server Icon -->
		{#if iconUrl}
			<img src={iconUrl} alt={name} class="size-12 rounded-lg bg-muted object-cover shrink-0" />
		{:else}
			<div class="flex size-12 items-center justify-center rounded-lg bg-muted shrink-0">
				<Icon icon="lucide:server" class="size-6 text-muted-foreground" />
			</div>
		{/if}

		<div class="flex-1 min-w-0">
			<div class="flex items-center gap-2">
				<h3 class="truncate text-lg font-semibold group-hover:text-primary">
					{name}
				</h3>
				{#if online}
					<span class="flex size-2 rounded-full bg-green-500" title="Online"></span>
				{:else}
					<span class="flex size-2 rounded-full bg-red-500" title="Offline"></span>
				{/if}
			</div>
			<p class="mt-1 text-sm text-muted-foreground line-clamp-2">
				{description}
			</p>
		</div>

		<div class="text-right shrink-0">
			<div class="text-2xl font-bold tabular-nums">
				{playerCount}<span class="text-base text-muted-foreground">/{maxPlayers}</span>
			</div>
			<div class="text-xs text-muted-foreground">players</div>
		</div>
	</div>

	<!-- Player bar -->
	<div class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
		<div
			class="h-full rounded-full transition-all {playerPercentage > 80 ? 'bg-red-500' : playerPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'}"
			style="width: {playerPercentage}%"
		></div>
	</div>

	<!-- Meta info -->
	<div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
		<div class="flex items-center gap-1.5">
			<Icon icon="lucide:globe" class="size-3.5" />
			<span class="font-mono text-xs">{address}{port !== 25565 ? `:${port}` : ''}</span>
		</div>

		{#if gamemode}
			<div class="flex items-center gap-1.5">
				<Icon icon="lucide:gamepad-2" class="size-3.5" />
				<span>{gamemode}</span>
			</div>
		{/if}

		{#if region}
			<div class="flex items-center gap-1.5">
				<Icon icon="lucide:map-pin" class="size-3.5" />
				<span>{region}</span>
			</div>
		{/if}
	</div>

	<!-- Tags -->
	{#if tags.length > 0}
		<div class="mt-3 flex flex-wrap gap-1.5">
			{#each tags.slice(0, 5) as tag}
				<span class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
					{tag}
				</span>
			{/each}
			{#if tags.length > 5}
				<span class="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
					+{tags.length - 5}
				</span>
			{/if}
		</div>
	{/if}
</a>
