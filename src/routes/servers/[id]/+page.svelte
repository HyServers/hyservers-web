<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import Footer from "$lib/components/footer.svelte";
	import StatTile from "$lib/components/stat-tile.svelte";
	import Icon from "@iconify/svelte";
	import { renderMarkdown } from "$lib/utils/markdown";

	let { data } = $props();
	const server = $derived(data.server);

	const playerPercentage = $derived(Math.round((server.playerCount / server.maxPlayers) * 100));
	const renderedDescription = $derived(server.longDescription ? renderMarkdown(server.longDescription) : '');

	// Format dates
	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const formatRelativeTime = (dateStr: string) => {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
		if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
		if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
		return formatDate(dateStr);
	};

	let copied = $state(false);

	async function copyAddress() {
		const address = server.port !== 25565 ? `${server.address}:${server.port}` : server.address;
		await navigator.clipboard.writeText(address);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}
</script>

<svelte:head>
	<title>{server.name} - HyServers</title>
	<meta name="description" content={server.description} />
</svelte:head>

<main class="flex flex-1 flex-col">
	<div class="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8 lg:px-8">
		<!-- Back button -->
		<a href="/servers" class="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
			<Icon icon="lucide:arrow-left" class="size-4" />
			Back to Server Browser
		</a>

		<!-- Header -->
		<div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
			<div class="flex items-start gap-4">
				{#if server.iconUrl}
					<img src={server.iconUrl} alt={server.name} class="size-16 rounded-xl bg-muted object-cover" />
				{:else}
					<div class="flex size-16 items-center justify-center rounded-xl bg-muted">
						<Icon icon="lucide:server" class="size-8 text-muted-foreground" />
					</div>
				{/if}
				<div>
					<div class="flex items-center gap-3">
						<h1 class="text-2xl font-bold sm:text-3xl">{server.name}</h1>
						{#if server.online}
							<span class="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500">
								<span class="size-1.5 rounded-full bg-green-500"></span>
								Online
							</span>
						{:else}
							<span class="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-500">
								<span class="size-1.5 rounded-full bg-red-500"></span>
								Offline
							</span>
						{/if}
						{#if server.claimed}
							<span class="inline-flex items-center gap-1 text-xs text-primary" title="Verified owner">
								<Icon icon="lucide:badge-check" class="size-4" />
							</span>
						{/if}
					</div>
					<p class="mt-2 text-muted-foreground">{server.description}</p>
				</div>
			</div>

			<div class="flex flex-wrap gap-2 sm:flex-nowrap">
				{#if server.discord}
					<Button variant="outline" href={server.discord} target="_blank">
						<Icon icon="simple-icons:discord" class="size-4" />
						Discord
					</Button>
				{/if}
				{#if server.website}
					<Button variant="outline" href={server.website} target="_blank">
						<Icon icon="lucide:external-link" class="size-4" />
						Website
					</Button>
				{/if}
			</div>
		</div>

		<!-- Banner -->
		{#if server.bannerUrl}
			<div class="mt-6 overflow-hidden rounded-xl">
				<img src={server.bannerUrl} alt="{server.name} banner" class="w-full object-cover" style="max-height: 200px;" />
			</div>
		{/if}

		<!-- Stats Row - Full width above grid -->
		<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
			<StatTile
				icon="lucide:users"
				iconColor="text-primary"
				value={server.playerCount}
				unit="/{server.maxPlayers}"
				label="Players"
				progress={playerPercentage}
			/>

			<StatTile
				icon="lucide:activity"
				iconColor="text-green-500"
				value={server.uptime ?? 0}
				unit="%"
				label="Uptime"
			/>

			<StatTile
				icon="lucide:gauge"
				iconColor="text-blue-500"
				value={server.latency ?? 0}
				unit="ms"
				label="Latency"
			/>

			<StatTile
				icon="lucide:package"
				iconColor="text-purple-500"
				value={server.version || '-'}
				label="Version"
			/>
		</div>

		<!-- Content Grid - Main + Sidebar layout -->
		<div class="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
			<!-- Main Column -->
			<div class="flex flex-col gap-6">
				<!-- Connection Info -->
				<div class="rounded-xl border bg-card p-5">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex items-center gap-3">
							<div class="flex size-10 items-center justify-center rounded-lg bg-muted">
								<Icon icon="lucide:globe" class="size-5 text-muted-foreground" />
							</div>
							<div>
								<div class="font-mono">{server.address}{server.port !== 25565 ? `:${server.port}` : ''}</div>
								<div class="text-sm text-muted-foreground">Server Address</div>
							</div>
						</div>
						<Button onclick={copyAddress} size="sm">
							{#if copied}
								<Icon icon="lucide:check" class="size-4" />
								Copied!
							{:else}
								<Icon icon="lucide:copy" class="size-4" />
								Copy
							{/if}
						</Button>
					</div>
				</div>

				<!-- Long Description -->
				{#if server.longDescription}
					<div class="rounded-xl border bg-card p-6 lg:flex-1">
						<h2 class="text-lg font-semibold">About</h2>
						<div class="mt-4 prose prose-sm dark:prose-invert max-w-none">
							{@html renderedDescription}
						</div>
					</div>
				{/if}

				<!-- MOTD -->
				{#if server.motd}
					<div class="rounded-xl border bg-card p-6 {!server.longDescription ? 'lg:flex-1' : ''}">
						<h2 class="text-lg font-semibold">Message of the Day</h2>
						<div class="mt-4 rounded-lg bg-muted p-4 font-mono text-sm whitespace-pre-wrap">
							{server.motd}
						</div>
					</div>
				{/if}

				<!-- Empty spacer if no long description or motd -->
				{#if !server.longDescription && !server.motd}
					<div class="lg:flex-1"></div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Server Info -->
				<div class="rounded-xl border bg-card p-5">
					<h3 class="font-semibold">Details</h3>
					<dl class="mt-4 space-y-3 text-sm">
						{#if server.gamemode}
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">Gamemode</dt>
								<dd class="flex items-center gap-1.5">
									<Icon icon="lucide:gamepad-2" class="size-3.5 text-muted-foreground" />
									{server.gamemode}
								</dd>
							</div>
						{/if}

						{#if server.region}
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">Region</dt>
								<dd class="flex items-center gap-1.5">
									<Icon icon="lucide:map-pin" class="size-3.5 text-muted-foreground" />
									{server.region}
								</dd>
							</div>
						{/if}

						{#if server.language}
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">Language</dt>
								<dd class="flex items-center gap-1.5">
									<Icon icon="lucide:languages" class="size-3.5 text-muted-foreground" />
									{server.language}
								</dd>
							</div>
						{/if}

						<div class="flex items-center justify-between">
							<dt class="text-muted-foreground">Added</dt>
							<dd>{formatDate(server.createdAt)}</dd>
						</div>

						<div class="flex items-center justify-between">
							<dt class="text-muted-foreground">Last Seen</dt>
							<dd>{formatRelativeTime(server.lastSeenAt)}</dd>
						</div>
					</dl>
				</div>

				<!-- Tags -->
				{#if server.tags.length > 0}
					<div class="rounded-xl border bg-card p-5">
						<h3 class="font-semibold">Tags</h3>
						<div class="mt-3 flex flex-wrap gap-1.5">
							{#each server.tags as tag}
								<a
									href="/servers?tags={tag}"
									class="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium hover:bg-muted/80"
								>
									{tag}
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<Footer />
</main>
