<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import Icon from "@iconify/svelte";
	import { enhance } from "$app/forms";

	let { form } = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Admin Login - HyServers</title>
</svelte:head>

<main class="flex flex-1 items-center justify-center px-6 py-24">
	<div class="w-full max-w-sm">
		<div class="text-center">
			<img src="/logo.png" alt="HyServers" class="mx-auto mb-6 h-16 w-auto" />
			<h1 class="text-2xl font-bold">Admin Login</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Enter your password to access the admin dashboard
			</p>
		</div>

		<form
			method="POST"
			class="mt-8 space-y-4"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			{#if form?.error}
				<div class="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="password" class="block text-sm font-medium">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
					placeholder="Enter admin password"
				/>
			</div>

			<Button type="submit" class="w-full" disabled={loading}>
				{#if loading}
					<Icon icon="lucide:loader-2" class="size-4 animate-spin" />
					Signing in...
				{:else}
					<Icon icon="lucide:log-in" class="size-4" />
					Sign In
				{/if}
			</Button>
		</form>

		<div class="mt-6 text-center">
			<a href="/" class="text-sm text-muted-foreground hover:text-foreground">
				Back to home
			</a>
		</div>
	</div>
</main>
