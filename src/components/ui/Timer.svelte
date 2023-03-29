<script lang="ts">
	import Pause from '../icons/Pause.svelte'
	import Play from '../icons/Play.svelte'
	import Reload from '../icons/Reload.svelte'
	import Arrow from './Arrow.svelte'

	let hours = 0
	let minutes = 10
	let seconds = 0

	let definedHours = 0
	let definedMinutes = 10

	let isCounting = false
	let interval: NodeJS.Timer | null = null

	let formattedHours = hours.toString().padStart(2, '0')
	let formattedMinutes = minutes.toString().padStart(2, '0')
	let formattedSeconds = seconds.toString().padStart(2, '0')

	$: {
		formattedHours = hours.toString().padStart(2, '0')
		formattedMinutes = minutes.toString().padStart(2, '0')
		formattedSeconds = seconds.toString().padStart(2, '0')
	}

	const tick = () => {
		if (isCounting) {
			if (seconds > 0) {
				seconds--
			} else if (minutes > 0) {
				minutes--
				seconds = 59
			} else if (hours > 0) {
				hours--
				minutes = 59
				seconds = 59
			} else {
				isCounting = false
			}
		}
	}

	$: {
		if (isCounting) {
			hours = definedHours
			minutes = definedMinutes

			interval = setInterval(tick, 1000)
		} else {
			// @ts-ignore
			clearInterval(interval)
		}
	}

	function add5Minutes() {
		definedMinutes += 5

		if (definedMinutes >= 60) {
			definedHours += 1
			definedMinutes = 0
		}

		hours = definedHours
		minutes = definedMinutes
	}

	function sub5Minutes() {
		if (definedHours === 0 && definedMinutes === 0) return

		definedMinutes -= 5

		if (definedMinutes < 0) {
			definedHours -= 1
			definedMinutes = 55
		}

		hours = definedHours
		minutes = definedMinutes
	}

	function reset() {
		hours = definedHours
		minutes = definedMinutes
		seconds = 0

		isCounting = false
	}
</script>

<div>
	<strong class="font-bold text-2xl block text-primary mb-4">Timer</strong>

	<div>
		<div class="mb-4 flex items-center justify-center">
			<span class="text-6xl font-bold text-white">
				{`${formattedHours}:${formattedMinutes}`}
			</span>
			<span class="text-6xl text-secondary font-bold">
				{`:${formattedSeconds}`}
			</span>
		</div>

		<div class="flex gap-x-4 justify-center">
			<button
				class="bg-dark rounded-full p-4 flex w-fit"
				on:click={() => (isCounting = !isCounting)}
			>
				{#if isCounting}
					<Pause />
				{:else}
					<Play />
				{/if}
			</button>

			<button class="bg-dark rounded-full p-4 flex w-fit" on:click={reset}>
				<Reload />
			</button>

			<div class="flex flex-col">
				<button class="bg-dark transform -rotate-90 rounded-r-md" on:click={add5Minutes}>
					<Arrow />
				</button>
				<button class="bg-dark transform rotate-90 rounded-r-md" on:click={sub5Minutes}>
					<Arrow />
				</button>
			</div>
		</div>
	</div>
</div>
