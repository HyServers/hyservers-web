<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import FeatureCard from '$lib/components/feature-card.svelte';
	import Icon from '@iconify/svelte';

	const roadmapFeatures = [
		{
			icon: 'lucide:radar',
			title: 'Server Scanning',
			description: 'Automatic discovery and monitoring of Hytale servers across the internet.'
		},
		{
			icon: 'lucide:trending-up',
			title: 'Live Statistics',
			description: 'Real-time player counts, uptime tracking, and historical performance data.'
		},
		{
			icon: 'lucide:users',
			title: 'Community Reviews',
			description: 'Player ratings and reviews to help you find the best communities.'
		},
		{
			icon: 'lucide:settings',
			title: 'Listing Customization',
			description: 'Server owners can claim and customize their listings to attract more players.'
		}
	];
</script>

<svelte:head>
	<title>HyServers - Hytale Server Browser</title>
	<meta
		name="description"
		content="Discover and track Hytale servers. Find the best communities, monitor player counts, and connect with fellow players."
	/>
</svelte:head>

<main>
	<!-- Hero + Status Section -->
	<section
		class="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-16 overflow-hidden px-6 py-16 lg:px-8"
	>
		<div
			class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"
		></div>

		<!-- Hero -->
		<div class="text-center">
			<img src="/logo.png" alt="HyServers" class="mx-auto mb-6 h-28 w-auto" />

			<h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
				<span class="text-primary">HyServers</span>
			</h1>

			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				Community-Driven Hytale Server Browser
			</p>
		</div>

		<!-- Current Status -->
		<div class="w-full">
			<div class="mx-auto max-w-2xl text-center">
				<div
					class="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium"
				>
					<Icon icon="lucide:clock" class="size-4" />
					<span>Waiting for Hytale</span>
				</div>
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">We're ready when you are</h2>
				<p class="mt-4 text-lg text-muted-foreground">
					Hytale hasn't been released yet, so there are no real servers to track. In the meantime,
					you can explore the site with test data to see what's coming.
				</p>
				<div class="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Button href="/servers" size="lg">
						<Icon icon="lucide:search" class="size-4" />
						Browse Test Servers
					</Button>
					<Button
						href="https://hytale.com/news"
						variant="outline"
						size="lg"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Icon icon="lucide:external-link" class="size-4" />
						Hytale News
					</Button>
				</div>
			</div>
		</div>
	</section>

	<!-- Roadmap Section -->
	<section class="py-24 sm:py-32 bg-muted/30">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Roadmap</h2>
				<p class="mt-4 text-lg text-muted-foreground">
					Features we're planning to build once Hytale launches.
				</p>
			</div>

			<div class="mx-auto mt-16 max-w-3xl">
				<div class="grid gap-6 sm:grid-cols-2">
					{#each roadmapFeatures as feature}
						<FeatureCard
							icon={feature.icon}
							title={feature.title}
							description={feature.description}
						/>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-24 sm:py-32">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div
				class="relative isolate overflow-hidden rounded-3xl bg-primary/5 px-6 py-16 sm:px-16 sm:py-24"
			>
				<div class="mx-auto max-w-2xl text-center">
					<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Stay in the loop</h2>
					<p class="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
						Join our Discord to follow HyServers development, give feedback, and be the first to
						know when new features launch.
					</p>
					<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							href="https://discord.hyservers.info"
							size="lg"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon icon="simple-icons:discord" class="size-4" />
							Join Discord
						</Button>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
