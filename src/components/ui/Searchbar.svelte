<script lang="ts">
	import { debounce } from '../../utils/debounce'
	import { outsideClick } from '../../utils/outsideClick'
	import { onMount } from 'svelte'
	import Bing from '../icons/Bing.svelte'
	import Brave from '../icons/Brave.svelte'
	import Chrome from '../icons/Chrome.svelte'
	import { removeDuplicateObject } from '../../utils/removeDuplicateObject'

	type Suggestion = {
		name: string
		url: string
	}

	let engines = [
		{
			name: 'Brave',
			url: 'https://search.brave.com/search?q=',
			getSuggestions: async () => {
				const r = await fetch(
					`http://localhost:3228/https://search.brave.com/api/suggest?q=${searchTerm}`,
				)
				const data = await r.json()

				suggestions = [
					suggestions[0],
					...data[1].map((suggestion: string) => ({
						name: suggestion,
						url: `https://search.brave.com/search?q=${suggestion}`,
					})),
				]
			},
		},
		{
			name: 'Chrome',
			url: 'https://www.google.com/search?q=',
			getSuggestions: async () => {
				const r = await fetch(
					`http://localhost:3228/https://www.google.com/complete/search?client=chrome&hl=pt-BR&q=${searchTerm}`,
				)
				const data = await r.json()

				suggestions = [
					suggestions[0],
					...data[1]
						.filter((suggestion: string) => !/^https?:\/\//.test(suggestion))
						.map((suggestion: string) => ({
							name: suggestion,
							url: `https://www.google.com/search?q=${suggestion}`,
						})),
				]
			},
		},
		{
			name: 'Bing',
			url: 'https://www.bing.com/search?q=',
			getSuggestions: async () => {
				const r = await fetch(
					`http://localhost:3228/https://www.bingapis.com/api/v7/suggestions?appid=6D0A9B8C5100E9ECC7E11A104ADD76C10219804B&q=${searchTerm}`,
				)
				const data = await r.json()

				suggestions = [
					suggestions[0],
					...data.suggestionGroups[0].searchSuggestions.map((suggestion: any) => ({
						name: suggestion.displayText,
						url: `https://www.bing.com/search?q=${suggestion.displayText}`,
					})),
				]
			},
		},
	]

	let selectOpen = false
	let selectedEngine = engines[0]
	let searchTerm = ''
	let suggestions = [] as Suggestion[]
	let isURL = false
	let history = [] as Suggestion[]
	let suggestionFocusIndex: number | null = null

	// max 100 history items
	$: {
		if (history.length) {
			history = history.slice(0, 100)

			localStorage.setItem('history', JSON.stringify(history))
		}
	}

	// Add history to suggestions
	$: {
		if (searchTerm === searchTerm) {
			if (!searchTerm) {
				suggestions = []
			} else {
				suggestions = [
					{
						name: searchTerm,
						url: handleURL(),
					},
					...history.filter(h => h.url.includes(searchTerm)).slice(0, 5),
					...suggestions.slice(1),
				]
			}
		}
	}

	// https://stackoverflow.com/a/3809435
	$: isURL =
		/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g.test(
			searchTerm,
		)

	// On engine change
	$: if (selectedEngine && searchTerm.length > 3) {
		selectedEngine.getSuggestions()
	}

	$: {
		if (searchTerm) {
			suggestions[0] = {
				name: searchTerm,
				url: handleURL(),
			}
		}
	}

	function handleURL() {
		if (isURL) {
			if (searchTerm.startsWith('http')) {
				return searchTerm
			}

			return `http://${searchTerm}`
		} else {
			return `${selectedEngine.url}${searchTerm}`
		}
	}

	onMount(() => {
		const _history = localStorage.getItem('history')

		if (_history) {
			history = JSON.parse(_history)
		}
	})
</script>

<div
	use:outsideClick={() => {
		selectOpen = false
		suggestions = []
	}}
>
	<div class="relative">
		<!-- svelte-ignore a11y-autofocus -->
		<input
			type="text"
			placeholder="Search"
			autofocus
			spellcheck="false"
			bind:value={searchTerm}
			on:keydown={e => {
				if (suggestions.length) {
					if (e.key === 'ArrowDown') {
						e.preventDefault()
						suggestionFocusIndex =
							suggestionFocusIndex === null
								? 0
								: Math.min(suggestionFocusIndex + 1, suggestions.length - 1)
					} else if (e.key === 'ArrowUp') {
						e.preventDefault()
						suggestionFocusIndex =
							suggestionFocusIndex === null
								? suggestions.length - 1
								: suggestionFocusIndex - 1 < 0
								? null
								: suggestionFocusIndex - 1
					} else if (e.key === 'Escape') {
						suggestions = []
					}
				}

				debounce(selectedEngine.getSuggestions, 550)
			}}
			on:keyup={e => {
				if (e.key === 'Enter') {
					if (suggestionFocusIndex !== null) {
						searchTerm = suggestions[suggestionFocusIndex].name
					}

					const url = handleURL()

					window.open(url, '_blank')

					if (!history.some(h => h.url === url)) {
						history = [
							{
								name: searchTerm,
								url,
							},
							...history,
						]
					}

					searchTerm = ''
					suggestions = []
				}
			}}
			on:focus={() => {
				if (suggestions.length > 3) {
					selectedEngine.getSuggestions()
				}

				suggestionFocusIndex = null
			}}
			class="w-full border-b-4 border-primary outline-none text-white text-3xl rounded-lg bg-transparent py-2 font-medium"
		/>
		<div class="absolute top-[30%] -right-12 flex flex-col items-center">
			<button
				tabindex="-1"
				type="button"
				on:click={() => (selectOpen = !selectOpen)}
				class=""
			>
				{#if selectedEngine.name === 'Brave'}
					<Brave />
				{:else if selectedEngine.name === 'Chrome'}
					<Chrome />
				{:else if selectedEngine.name === 'Bing'}
					<Bing />
				{/if}
			</button>
			<div class="flex flex-col absolute top-[calc(100%+16px)]">
				<div
					class={`flex flex-col items-center gap-y-2 p-4 bg-primary/30 rounded-lg ${
						selectOpen ? 'block' : 'hidden'
					}`}
				>
					{#each engines as engine}
						<button
							on:click={() => {
								selectedEngine = engine
								selectOpen = false
							}}
						>
							{#if engine.name === 'Brave'}
								<Brave />
							{:else if engine.name === 'Chrome'}
								<Chrome />
							{:else if engine.name === 'Bing'}
								<Bing />
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<ul
		class={`${
			suggestions.length ? 'border-4' : ''
		} border-primary border-t-0 rounded-lg flex flex-col`}
	>
		{#each suggestions as suggestion, index}
			<li>
				<a
					href={`${selectedEngine.url}${suggestion}`}
					on:click={() => {
						history = [suggestion, ...history]
					}}
					target="_blank"
					tabindex={suggestionFocusIndex === index ? 0 : -1}
					on:blur={() => (suggestionFocusIndex = null)}
					on:focus={() => (suggestionFocusIndex = index)}
					class={`flex flex-col text-gray text-xl p-2 focus:bg-primary/25 hover:bg-primary/25 outline-none w-full ${
						suggestionFocusIndex === index ? 'bg-primary/25' : ''
					}`}
				>
					{index === 0 ? suggestion.name + ' (search)' : suggestion.name}
					<span class="text-sm text-dark">{suggestion.url}</span>
				</a>
			</li>
		{/each}
	</ul>
</div>
