<script lang="ts">
	import Icon from "@iconify/svelte";

	let { data } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard - HyServers</title>
</svelte:head>

<div class="p-6">
	<h1 class="text-2xl font-bold">Dashboard</h1>
	<p class="mt-2 text-muted-foreground">Welcome to the HyServers admin dashboard.</p>

	<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<div class="rounded-lg border bg-card p-6">
			<div class="flex items-center gap-4">
				<div class="flex size-12 items-center justify-center rounded-lg bg-primary/10">
					<Icon icon="lucide:server" class="size-6 text-primary" />
				</div>
				<div>
					<p class="text-sm text-muted-foreground">Total Servers</p>
					<p class="text-2xl font-bold">{data.serverCount}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg border bg-card p-6">
			<div class="flex items-center gap-4">
				<div class="flex size-12 items-center justify-center rounded-lg bg-green-500/10">
					<Icon icon="lucide:activity" class="size-6 text-green-500" />
				</div>
				<div>
					<p class="text-sm text-muted-foreground">Online Servers</p>
					<p class="text-2xl font-bold">{data.onlineCount}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg border bg-card p-6">
			<div class="flex items-center gap-4">
				<div class="flex size-12 items-center justify-center rounded-lg bg-red-500/10">
					<Icon icon="lucide:wifi-off" class="size-6 text-red-500" />
				</div>
				<div>
					<p class="text-sm text-muted-foreground">Offline Servers</p>
					<p class="text-2xl font-bold">{data.serverCount - data.onlineCount}</p>
				</div>
			</div>
		</div>
	</div>
</div>
