<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button";
	import Icon from "@iconify/svelte";

	let { children } = $props();

	const isLoginPage = $derived($page.url.pathname === '/admin/login');

	const navItems = [
		{ href: '/admin', icon: 'lucide:layout-dashboard', label: 'Dashboard' },
		{ href: '/admin/servers', icon: 'lucide:server', label: 'Servers' }
	];
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="flex flex-1">
		<!-- Sidebar -->
		<aside class="w-64 border-r bg-card">
			<div class="flex h-full flex-col">
				<div class="border-b p-4">
					<h2 class="font-semibold">Admin Dashboard</h2>
				</div>

				<nav class="flex-1 space-y-1 p-2">
					{#each navItems as item}
						<a
							href={item.href}
							class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors {$page.url.pathname === item.href
								? 'bg-primary/10 text-primary'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
						>
							<Icon icon={item.icon} class="size-4" />
							{item.label}
						</a>
					{/each}
				</nav>

				<div class="border-t p-2">
					<form action="/admin/logout" method="POST">
						<Button type="submit" variant="ghost" class="w-full justify-start gap-3">
							<Icon icon="lucide:log-out" class="size-4" />
							Logout
						</Button>
					</form>
				</div>
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
{/if}
