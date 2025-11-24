<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import Icon from "@iconify/svelte";
	import { enhance } from "$app/forms";

	let { data, form } = $props();

	let showAddForm = $state(false);
	let loading = $state(false);
	let editingServer = $state<typeof data.servers[0] | null>(null);
	let editLoading = $state(false);
	let rebuildingIndex = $state(false);

	function openEditForm(server: typeof data.servers[0]) {
		editingServer = { ...server };
	}

	function closeEditForm() {
		editingServer = null;
	}
</script>

<svelte:head>
	<title>Manage Servers - HyServers Admin</title>
</svelte:head>

<div class="p-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">Servers</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage servers in the database
			</p>
		</div>
		<div class="flex gap-2">
			<form
				method="POST"
				action="?/rebuildIndex"
				use:enhance={() => {
					rebuildingIndex = true;
					return async ({ update }) => {
						await update();
						rebuildingIndex = false;
					};
				}}
			>
				<Button type="submit" variant="outline" disabled={rebuildingIndex}>
					{#if rebuildingIndex}
						<Icon icon="lucide:loader-2" class="size-4 animate-spin" />
						Rebuilding...
					{:else}
						<Icon icon="lucide:refresh-cw" class="size-4" />
						Rebuild Index
					{/if}
				</Button>
			</form>
			<Button onclick={() => (showAddForm = !showAddForm)}>
				<Icon icon={showAddForm ? 'lucide:x' : 'lucide:plus'} class="size-4" />
				{showAddForm ? 'Cancel' : 'Add Server'}
			</Button>
		</div>
	</div>

	{#if form?.success}
		<div class="mt-4 rounded-md bg-green-500/10 px-4 py-3 text-sm text-green-500">
			{#if form.action === 'edit'}
				Server updated successfully!
			{:else if form.action === 'rebuildIndex'}
				Search index rebuilt successfully! ({form.count} servers indexed)
			{:else}
				Server added successfully!
			{/if}
		</div>
	{/if}

	{#if form?.error}
		<div class="mt-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
			{form.error}
		</div>
	{/if}

	{#if showAddForm}
		<form
			method="POST"
			action="?/add"
			class="mt-6 rounded-lg border bg-card p-6"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					await update();
					loading = false;
					if (result.type === 'success') {
						showAddForm = false;
					}
				};
			}}
		>
			<h2 class="mb-4 text-lg font-semibold">Add New Server</h2>

			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="name" class="block text-sm font-medium">Name *</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="My Awesome Server"
					/>
				</div>

				<div>
					<label for="address" class="block text-sm font-medium">Address *</label>
					<input
						type="text"
						id="address"
						name="address"
						required
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="play.example.com"
					/>
				</div>

				<div>
					<label for="port" class="block text-sm font-medium">Port</label>
					<input
						type="number"
						id="port"
						name="port"
						value="25565"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>

				<div>
					<label for="version" class="block text-sm font-medium">Version</label>
					<input
						type="text"
						id="version"
						name="version"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="1.0.0"
					/>
				</div>

				<div class="sm:col-span-2">
					<label for="description" class="block text-sm font-medium">Description *</label>
					<textarea
						id="description"
						name="description"
						required
						rows="2"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="A brief description of the server"
					></textarea>
				</div>

				<div>
					<label for="maxPlayers" class="block text-sm font-medium">Max Players</label>
					<input
						type="number"
						id="maxPlayers"
						name="maxPlayers"
						value="100"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					/>
				</div>

				<div>
					<label for="gamemode" class="block text-sm font-medium">Gamemode</label>
					<input
						type="text"
						id="gamemode"
						name="gamemode"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="Survival, Creative, Minigames..."
					/>
				</div>

				<div>
					<label for="tags" class="block text-sm font-medium">Tags (comma-separated)</label>
					<input
						type="text"
						id="tags"
						name="tags"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="pvp, survival, rpg"
					/>
				</div>

				<div>
					<label for="language" class="block text-sm font-medium">Language</label>
					<input
						type="text"
						id="language"
						name="language"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="English"
					/>
				</div>

				<div>
					<label for="region" class="block text-sm font-medium">Region</label>
					<input
						type="text"
						id="region"
						name="region"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="US, EU, Asia..."
					/>
				</div>

				<div>
					<label for="website" class="block text-sm font-medium">Website</label>
					<input
						type="url"
						id="website"
						name="website"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="https://example.com"
					/>
				</div>

				<div>
					<label for="discord" class="block text-sm font-medium">Discord</label>
					<input
						type="url"
						id="discord"
						name="discord"
						class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						placeholder="https://discord.gg/..."
					/>
				</div>
			</div>

			<div class="mt-6 flex justify-end gap-2">
				<Button type="button" variant="outline" onclick={() => (showAddForm = false)}>
					Cancel
				</Button>
				<Button type="submit" disabled={loading}>
					{#if loading}
						<Icon icon="lucide:loader-2" class="size-4 animate-spin" />
						Adding...
					{:else}
						<Icon icon="lucide:plus" class="size-4" />
						Add Server
					{/if}
				</Button>
			</div>
		</form>
	{/if}

	<!-- Server List -->
	<div class="mt-6">
		{#if data.servers.length === 0}
			<div class="rounded-lg border bg-card p-12 text-center">
				<Icon icon="lucide:server-off" class="mx-auto size-12 text-muted-foreground" />
				<h3 class="mt-4 text-lg font-medium">No servers yet</h3>
				<p class="mt-2 text-sm text-muted-foreground">
					Add your first server to get started.
				</p>
			</div>
		{:else}
			<div class="rounded-lg border">
				<table class="w-full">
					<thead>
						<tr class="border-b bg-muted/50">
							<th class="px-4 py-3 text-left text-sm font-medium">Name</th>
							<th class="px-4 py-3 text-left text-sm font-medium">Address</th>
							<th class="px-4 py-3 text-left text-sm font-medium">Players</th>
							<th class="px-4 py-3 text-left text-sm font-medium">Status</th>
							<th class="px-4 py-3 text-right text-sm font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.servers as server}
							<tr class="border-b last:border-0">
								<td class="px-4 py-3">
									<div class="font-medium">{server.name}</div>
									<div class="text-sm text-muted-foreground">{server.description}</div>
								</td>
								<td class="px-4 py-3 text-sm">
									{server.address}:{server.port}
								</td>
								<td class="px-4 py-3 text-sm">
									{server.playerCount}/{server.maxPlayers}
								</td>
								<td class="px-4 py-3">
									{#if server.online}
										<span class="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
											<span class="size-1.5 rounded-full bg-green-500"></span>
											Online
										</span>
									{:else}
										<span class="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500">
											<span class="size-1.5 rounded-full bg-red-500"></span>
											Offline
										</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-right">
									<div class="flex justify-end gap-1">
										<Button type="button" variant="ghost" size="icon-sm" onclick={() => openEditForm(server)}>
											<Icon icon="lucide:pencil" class="size-4" />
										</Button>
										<form method="POST" action="?/delete" class="inline" use:enhance>
											<input type="hidden" name="id" value={server.id} />
											<Button type="submit" variant="ghost" size="icon-sm">
												<Icon icon="lucide:trash-2" class="size-4 text-destructive" />
											</Button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Edit Modal -->
{#if editingServer}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onclick={closeEditForm}>
		<div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border bg-background p-6" onclick={(e) => e.stopPropagation()}>
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold">Edit Server</h2>
				<Button variant="ghost" size="icon-sm" onclick={closeEditForm}>
					<Icon icon="lucide:x" class="size-4" />
				</Button>
			</div>

			<form
				method="POST"
				action="?/edit"
				use:enhance={() => {
					editLoading = true;
					return async ({ result, update }) => {
						await update();
						editLoading = false;
						if (result.type === 'success') {
							closeEditForm();
						}
					};
				}}
			>
				<input type="hidden" name="id" value={editingServer.id} />

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="edit-name" class="block text-sm font-medium">Name *</label>
						<input
							type="text"
							id="edit-name"
							name="name"
							required
							bind:value={editingServer.name}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-address" class="block text-sm font-medium">Address *</label>
						<input
							type="text"
							id="edit-address"
							name="address"
							required
							bind:value={editingServer.address}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-port" class="block text-sm font-medium">Port</label>
						<input
							type="number"
							id="edit-port"
							name="port"
							bind:value={editingServer.port}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-version" class="block text-sm font-medium">Version</label>
						<input
							type="text"
							id="edit-version"
							name="version"
							bind:value={editingServer.version}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div class="sm:col-span-2">
						<label for="edit-description" class="block text-sm font-medium">Description *</label>
						<textarea
							id="edit-description"
							name="description"
							required
							rows="2"
							bind:value={editingServer.description}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						></textarea>
					</div>

					<div class="sm:col-span-2">
						<label for="edit-longDescription" class="block text-sm font-medium">Long Description</label>
						<textarea
							id="edit-longDescription"
							name="longDescription"
							rows="4"
							bind:value={editingServer.longDescription}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
							placeholder="Full description with markdown support"
						></textarea>
					</div>

					<div class="sm:col-span-2">
						<label for="edit-motd" class="block text-sm font-medium">MOTD</label>
						<textarea
							id="edit-motd"
							name="motd"
							rows="2"
							bind:value={editingServer.motd}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
							placeholder="Message of the day"
						></textarea>
					</div>

					<div>
						<label for="edit-iconUrl" class="block text-sm font-medium">Icon URL</label>
						<input
							type="url"
							id="edit-iconUrl"
							name="iconUrl"
							bind:value={editingServer.iconUrl}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-bannerUrl" class="block text-sm font-medium">Banner URL</label>
						<input
							type="url"
							id="edit-bannerUrl"
							name="bannerUrl"
							bind:value={editingServer.bannerUrl}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-playerCount" class="block text-sm font-medium">Player Count</label>
						<input
							type="number"
							id="edit-playerCount"
							name="playerCount"
							bind:value={editingServer.playerCount}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-maxPlayers" class="block text-sm font-medium">Max Players</label>
						<input
							type="number"
							id="edit-maxPlayers"
							name="maxPlayers"
							bind:value={editingServer.maxPlayers}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-gamemode" class="block text-sm font-medium">Gamemode</label>
						<input
							type="text"
							id="edit-gamemode"
							name="gamemode"
							bind:value={editingServer.gamemode}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-tags" class="block text-sm font-medium">Tags (comma-separated)</label>
						<input
							type="text"
							id="edit-tags"
							name="tags"
							value={editingServer.tags.join(', ')}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-language" class="block text-sm font-medium">Language</label>
						<input
							type="text"
							id="edit-language"
							name="language"
							bind:value={editingServer.language}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-region" class="block text-sm font-medium">Region</label>
						<input
							type="text"
							id="edit-region"
							name="region"
							bind:value={editingServer.region}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-website" class="block text-sm font-medium">Website</label>
						<input
							type="url"
							id="edit-website"
							name="website"
							bind:value={editingServer.website}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-discord" class="block text-sm font-medium">Discord</label>
						<input
							type="url"
							id="edit-discord"
							name="discord"
							bind:value={editingServer.discord}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-uptime" class="block text-sm font-medium">Uptime (%)</label>
						<input
							type="number"
							id="edit-uptime"
							name="uptime"
							min="0"
							max="100"
							bind:value={editingServer.uptime}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div>
						<label for="edit-latency" class="block text-sm font-medium">Latency (ms)</label>
						<input
							type="number"
							id="edit-latency"
							name="latency"
							min="0"
							bind:value={editingServer.latency}
							class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
						/>
					</div>

					<div class="flex items-center gap-6">
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								name="online"
								value="true"
								checked={editingServer.online}
								onchange={(e) => { if (editingServer) editingServer.online = e.currentTarget.checked; }}
								class="size-4 rounded border"
							/>
							Online
						</label>

						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								name="claimed"
								value="true"
								checked={editingServer.claimed}
								onchange={(e) => { if (editingServer) editingServer.claimed = e.currentTarget.checked; }}
								class="size-4 rounded border"
							/>
							Claimed
						</label>
					</div>
				</div>

				<div class="mt-6 flex justify-end gap-2">
					<Button type="button" variant="outline" onclick={closeEditForm}>
						Cancel
					</Button>
					<Button type="submit" disabled={editLoading}>
						{#if editLoading}
							<Icon icon="lucide:loader-2" class="size-4 animate-spin" />
							Saving...
						{:else}
							<Icon icon="lucide:check" class="size-4" />
							Save Changes
						{/if}
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
