<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import ServerCard from '$lib/components/server-card.svelte';
	import Footer from '$lib/components/footer.svelte';
	import Alert from '$lib/components/alert.svelte';
	import Icon from '@iconify/svelte';

	let { data } = $props();

	let searchInput = $state(data.query);
	let showFilters = $state(false);

	function updateSearch() {
		const params = new URLSearchParams($page.url.searchParams);
		if (searchInput) {
			params.set('q', searchInput);
		} else {
			params.delete('q');
		}
		params.delete('page');
		goto(`/servers?${params.toString()}`, { keepFocus: true });
	}

	function toggleFilter(key: string, value: string) {
		const params = new URLSearchParams($page.url.searchParams);
		const current = params.get(key);

		if (current === value) {
			params.delete(key);
		} else {
			params.set(key, value);
		}
		params.delete('page');
		goto(`/servers?${params.toString()}`);
	}

	function clearFilters() {
		const params = new URLSearchParams();
		if (searchInput) params.set('q', searchInput);
		goto(`/servers?${params.toString()}`);
	}

	function setSort(sort: string, order: string) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('sort', sort);
		params.set('order', order);
		params.delete('page');
		goto(`/servers?${params.toString()}`);
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`/servers?${params.toString()}`);
	}

	const hasActiveFilters = $derived(
		data.filters.gamemode ||
			data.filters.region ||
			data.filters.language ||
			data.filters.online ||
			(data.filters.tags && data.filters.tags.length > 0)
	);

	const sortOptions = [
		{ value: 'playerCount:desc', label: 'Most Players' },
		{ value: 'playerCount:asc', label: 'Least Players' },
		{ value: 'name:asc', label: 'Name A-Z' },
		{ value: 'name:desc', label: 'Name Z-A' },
		{ value: 'createdAt:desc', label: 'Newest' },
		{ value: 'createdAt:asc', label: 'Oldest' }
	];

	const currentSort = $derived(`${data.sortBy}:${data.sortOrder}`);
	const currentSortLabel = $derived(
		sortOptions.find((opt) => opt.value === currentSort)?.label || 'Sort by'
	);
</script>

<svelte:head>
	<title>Server Browser - HyServers</title>
	<meta
		name="description"
		content="Browse and discover Hytale servers. Find the perfect community to play with."
	/>
</svelte:head>

<main class="flex flex-1 flex-col">
	<div class="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-8 lg:px-8">
		<!-- Header -->

		<Alert title="Attention!" variant="destructive" icon="lucide:triangle-alert" style="margin-bottom: 1rem;">
			What you're seeing here is placeholder test data, meant to give you an approximation of how HyServers is gonna look like once Hytale releases and we can get some actual real server data.
		</Alert>

		<div class="mb-8">
			<h1 class="text-3xl font-bold">Server Browser</h1>
			<p class="mt-2 text-muted-foreground">
				{data.totalFound} server{data.totalFound !== 1 ? 's' : ''} found
			</p>
		</div>

		<!-- Search & Filter Bar -->
		<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
			<form
				onsubmit={(e) => {
					e.preventDefault();
					updateSearch();
				}}
				class="relative flex-1"
			>
				<Icon
					icon="lucide:search"
					class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
				/>
				<input
					type="text"
					oninput={() => {
						updateSearch();
					}}
					bind:value={searchInput}
					placeholder="Search servers..."
					class="w-full rounded-lg border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
				/>
			</form>

			<div class="flex gap-2">
				<Button variant="outline" onclick={() => (showFilters = !showFilters)}>
					<Icon icon="lucide:sliders-horizontal" class="size-4" />
					Filters
					{#if hasActiveFilters}
						<span
							class="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
						>
							!
						</span>
					{/if}
				</Button>

				<Select.Root
					type="single"
					value={{ value: currentSort, label: currentSortLabel }}
					onValueChange={(v) => {
						if (v) {
							const [sort, order] = v.value.split(':');
							setSort(sort, order);
						}
					}}
				>
					<Select.Trigger class="w-[160px]">
						<Icon icon="lucide:arrow-up-down" class="mr-2 size-4" />
						{currentSortLabel}
					</Select.Trigger>
					<Select.Content>
						{#each sortOptions as option}
							<Select.Item value={option.value} label={option.label} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<!-- Filters Panel -->
		{#if showFilters}
			<div class="mb-6 rounded-lg border bg-card p-4">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-semibold">Filters</h3>
					{#if hasActiveFilters}
						<Button variant="ghost" size="sm" onclick={clearFilters}>
							<Icon icon="lucide:x" class="size-4" />
							Clear all
						</Button>
					{/if}
				</div>

				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<!-- Online Status -->
					<div>
						<h4 class="mb-2 text-sm font-medium text-muted-foreground">Status</h4>
						<div class="flex flex-wrap gap-2">
							<button
								class="rounded-full px-3 py-1 text-sm transition-colors {data.filters.online ===
								'true'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted hover:bg-muted/80'}"
								onclick={() => toggleFilter('online', 'true')}
							>
								Online
							</button>
							<button
								class="rounded-full px-3 py-1 text-sm transition-colors {data.filters.online ===
								'false'
									? 'bg-primary text-primary-foreground'
									: 'bg-muted hover:bg-muted/80'}"
								onclick={() => toggleFilter('online', 'false')}
							>
								Offline
							</button>
						</div>
					</div>

					<!-- Gamemode -->
					{#if data.facets.gamemode?.length}
						<div>
							<h4 class="mb-2 text-sm font-medium text-muted-foreground">
								Gamemode
								{#if data.facets.gamemode.length > 6}
									<span class="text-xs opacity-70">({data.facets.gamemode.length})</span>
								{/if}
							</h4>
							<div class="max-h-32 overflow-y-auto scrollbar-thin">
								<div class="flex flex-wrap gap-2 pr-1">
									{#each data.facets.gamemode as facet}
										<button
											class="rounded-full px-3 py-1 text-sm transition-colors {data.filters
												.gamemode === facet.value
												? 'bg-primary text-primary-foreground'
												: 'bg-muted hover:bg-muted/80'}"
											onclick={() => toggleFilter('gamemode', facet.value)}
										>
											{facet.value}
											<span class="ml-1 text-xs opacity-70">({facet.count})</span>
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/if}

					<!-- Region -->
					{#if data.facets.region?.length}
						<div>
							<h4 class="mb-2 text-sm font-medium text-muted-foreground">
								Region
								{#if data.facets.region.length > 6}
									<span class="text-xs opacity-70">({data.facets.region.length})</span>
								{/if}
							</h4>
							<div class="max-h-32 overflow-y-auto scrollbar-thin">
								<div class="flex flex-wrap gap-2 pr-1">
									{#each data.facets.region as facet}
										<button
											class="rounded-full px-3 py-1 text-sm transition-colors {data.filters
												.region === facet.value
												? 'bg-primary text-primary-foreground'
												: 'bg-muted hover:bg-muted/80'}"
											onclick={() => toggleFilter('region', facet.value)}
										>
											{facet.value}
											<span class="ml-1 text-xs opacity-70">({facet.count})</span>
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/if}

					<!-- Tags -->
					{#if data.facets.tags?.length}
						<div>
							<h4 class="mb-2 text-sm font-medium text-muted-foreground">
								Tags
								{#if data.facets.tags.length > 8}
									<span class="text-xs opacity-70">({data.facets.tags.length})</span>
								{/if}
							</h4>
							<div class="max-h-32 overflow-y-auto scrollbar-thin">
								<div class="flex flex-wrap gap-2 pr-1">
									{#each data.facets.tags as facet}
										<button
											class="rounded-full px-3 py-1 text-sm transition-colors {data.filters.tags?.includes(
												facet.value
											)
												? 'bg-primary text-primary-foreground'
												: 'bg-muted hover:bg-muted/80'}"
											onclick={() => toggleFilter('tags', facet.value)}
										>
											{facet.value}
											<span class="ml-1 text-xs opacity-70">({facet.count})</span>
										</button>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Error Message -->
		{#if data.error}
			<div class="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
				<Icon icon="lucide:alert-circle" class="mr-2 inline size-4" />
				{data.error}
			</div>
		{/if}

		<!-- Server Grid -->
		{#if data.servers.length === 0}
			<div class="flex flex-1 flex-col items-center justify-center py-24 text-center">
				<Icon icon="lucide:search-x" class="size-16 text-muted-foreground" />
				<h2 class="mt-4 text-xl font-semibold">No servers found</h2>
				<p class="mt-2 text-muted-foreground">
					{#if data.query || hasActiveFilters}
						Try adjusting your search or filters
					{:else}
						No servers have been added yet
					{/if}
				</p>
				{#if hasActiveFilters}
					<Button variant="outline" class="mt-4" onclick={clearFilters}>Clear filters</Button>
				{/if}
			</div>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.servers as server (server.id)}
					<ServerCard
						id={server.id}
						name={server.name}
						address={server.address}
						port={server.port}
						description={server.description}
						playerCount={server.playerCount}
						maxPlayers={server.maxPlayers}
						gamemode={server.gamemode}
						tags={server.tags}
						online={server.online}
						region={server.region}
						iconUrl={server.iconUrl}
					/>
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.totalPages > 1}
				<div class="mt-8 flex items-center justify-center gap-2">
					<Button
						variant="outline"
						size="sm"
						disabled={data.page <= 1}
						onclick={() => goToPage(data.page - 1)}
					>
						<Icon icon="lucide:chevron-left" class="size-4" />
						Previous
					</Button>

					<span class="px-4 text-sm text-muted-foreground">
						Page {data.page} of {data.totalPages}
					</span>

					<Button
						variant="outline"
						size="sm"
						disabled={data.page >= data.totalPages}
						onclick={() => goToPage(data.page + 1)}
					>
						Next
						<Icon icon="lucide:chevron-right" class="size-4" />
					</Button>
				</div>
			{/if}
		{/if}
	</div>

	<Footer />
</main>
