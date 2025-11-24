<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		title: string;
		description: string;
		icon: string;
	}

	let { title, description, icon }: Props = $props();
</script>

<div class="group rounded-xl border bg-card p-6">
	<div class="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
		<Icon {icon} class="size-6 text-primary" />
	</div>
	<h3 class="text-lg font-semibold">{title}</h3>
	<p class="mt-2 text-sm text-muted-foreground">
		{description}
	</p>
</div>
