<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import Icon from '@iconify/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		icon?: string;
    variant?: 'default' | 'destructive';
    style?: string;
		children: Snippet<[]>;
	}

	let { title, icon, variant, style, children }: Props = $props();
</script>

<Alert.Root variant={variant} style={style}>
	{#if icon}
		<Icon {icon} />
	{/if}
	<Alert.Title>{title}</Alert.Title>
	<Alert.Description>
		{@render children()}
	</Alert.Description>
</Alert.Root>
