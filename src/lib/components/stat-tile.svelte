<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		icon: string;
		iconColor?: string;
		value: string | number;
		unit?: string;
		label: string;
		progress?: number;
	}

	let { icon, iconColor = "text-primary", value, unit, label, progress }: Props = $props();

	const bgColor = $derived(
		iconColor.includes("primary") ? "bg-primary/10" :
		iconColor.includes("green") ? "bg-green-500/10" :
		iconColor.includes("blue") ? "bg-blue-500/10" :
		iconColor.includes("purple") ? "bg-purple-500/10" :
		iconColor.includes("yellow") ? "bg-yellow-500/10" :
		iconColor.includes("red") ? "bg-red-500/10" :
		"bg-muted"
	);

	const progressColor = $derived(
		progress !== undefined
			? progress > 80 ? "bg-red-500" : progress > 50 ? "bg-yellow-500" : "bg-green-500"
			: ""
	);
</script>

<div class="rounded-xl border bg-card p-4 flex flex-col justify-center">
	<div class="flex items-center justify-center gap-3">
		<div class="flex size-10 items-center justify-center rounded-lg shrink-0 {bgColor}">
			<Icon {icon} class="size-5 {iconColor}" />
		</div>
		<div>
			<div class="text-2xl font-bold tabular-nums">
				{value}{#if unit}<span class="text-base text-muted-foreground">{unit}</span>{/if}
			</div>
			<div class="text-sm text-muted-foreground">{label}</div>
		</div>
	</div>
	{#if progress !== undefined}
		<div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
			<div
				class="h-full rounded-full transition-all {progressColor}"
				style="width: {progress}%"
			></div>
		</div>
	{/if}
</div>
