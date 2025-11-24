<script lang="ts">
	import './layout.css';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// Skip view transitions for same-page navigations (filters, sorting, pagination)
		const fromPath = navigation.from?.url.pathname;
		const toPath = navigation.to?.url.pathname;
		if (fromPath === toPath) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href="/logo.png" />
</svelte:head>

<ModeWatcher />

<div class="flex min-h-screen flex-col">
	<header
		class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-8">
			<a href="/" class="flex items-center gap-2 font-semibold">
				<img src="/logo.png" alt="HyServers" class="h-6 w-auto" />
				<span>HyServers</span>
			</a>

			<div class="flex gap-4">
				<Button
					href="https://github.com/HyServers"
					size="lg"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Icon icon="simple-icons:github" class="size-4" />
					GitHub
				</Button>

				<Button onclick={toggleMode} variant="ghost" size="icon">
					<Icon
						icon="lucide:sun"
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Icon
						icon="lucide:moon"
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</header>

	<div class="flex flex-1 flex-col">
		{@render children()}
	</div>
</div>
