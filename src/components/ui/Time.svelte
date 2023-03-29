<script lang="ts">
	import { onMount } from 'svelte'

	let time = new Date()

	let seconds = '0'
	let minutes = '0'
	let hours = '0'

	$: {
		seconds = time.getSeconds().toString().padStart(2, '0')
		minutes = time.getMinutes().toString().padStart(2, '0')
		hours = time.getHours().toString().padStart(2, '0')
	}

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date()
		}, 1000)

		return () => clearInterval(interval)
	})
</script>

<div>
	<div
		class="relative after:block after:w-full after:h-3 after:bg-gradient-to-b after:from-primary after:to-secondary after:absolute after:top-[calc(100%+4px)]"
	>
		<span class="text-9xl font-bold text-white">
			{`${hours}:${minutes}`}
		</span>
		<span class="text-6xl text-secondary font-bold">
			{`:${seconds}`}
		</span>
	</div>
</div>
