<script lang="ts">
	import { onMount } from 'svelte'
	import { useFetch } from '../../useFetch'
	import { humanizeData } from '../../utils/humanizeDate'
	import Loading from './Loading.svelte'

	type News = {
		id: string
		owner_id: string
		parent_id: null
		slug: string
		title: string
		status: Status
		source_url: null | string
		created_at: Date
		updated_at: Date
		published_at: Date
		deleted_at: null
		tabcoins: number
		owner_username: string
		children_deep_count: number
	}

	enum Status {
		Published = 'published',
	}

	let readNews = [] as string[]
	let mode: 'relevant' | 'new' = 'relevant'

	let news: News[] = []
	let isLoading = true

	async function fetchNews() {
		isLoading = true

		const response = await fetch(
			`https://www.tabnews.com.br/api/v1/contents?per_page=50&strategy=${mode}`,
		)

		news = await response.json()
		isLoading = false
	}

	$: mode, fetchNews()

	function getTabnews() {
		const tabnews = localStorage.getItem('tabnews')

		if (tabnews) {
			return JSON.parse(tabnews)
		}

		return { readNews: [] as string[] }
	}

	function addReadNews(slug: string) {
		const tabnews = getTabnews()

		if (tabnews.readNews.includes(slug)) {
			return
		}

		tabnews.readNews.push(slug)
		readNews = tabnews.readNews

		localStorage.setItem('tabnews', JSON.stringify(tabnews))
	}

	onMount(() => {
		const tabnews = getTabnews()

		readNews = tabnews.readNews

		if (Object.keys(tabnews).length == 0) {
			localStorage.setItem(
				'tabnews',
				JSON.stringify({
					readNews: [],
				}),
			)
		}

		fetchNews()
	})
</script>

<div class="w-full h-full px-4 overflow-y-auto scrollbar-thumb-black scrollbar-thin">
	{#if isLoading}
		<Loading />
	{:else}
		<div style="backdrop-filter: blur(4px);">
			<div class="flex items-center justify-between my-4">
				<a href="https://www.tabnews.com.br" class="font-bold text-2xl block text-primary">
					Tabnews
				</a>

				<div class="flex items-center gap-x-3">
					<button
						type="button"
						on:click={() => (mode = 'relevant')}
						class={`font-bold text-xl ${
							mode === 'relevant' ? 'text-white' : 'text-gray'
						}`}
					>
						Relevantes
					</button>
					<button
						type="button"
						on:click={() => (mode = 'new')}
						class={`font-bold text-xl ${
							mode === 'new' ? 'text-white' : 'text-gray'
						}`}
					>
						Recentes
					</button>
				</div>
			</div>
			<ul class="flex flex-col gap-y-2">
				{#each news as i, index}
					<li>
						<div class="flex gap-x-2">
							<strong class="font-bold w-5 flex justify-end text-white"
								>{index + 1}.</strong
							>
							<div class="flex flex-col gap-y-[1px]">
								<a
									href={`https://www.tabnews.com.br/${i.owner_username}/${i.slug}`}
									target="_blank"
									rel="noreferrer"
									class={`overflow-hidden max-w-md font-medium ${
										readNews.includes(i.slug) ? 'text-gray' : 'text-white'
									}`}
									style="-webkit-line-clamp: 1; -webkit-box-orient: vertical; display: -webkit-box;"
									on:click={() => addReadNews(i.slug)}
								>
									{i.title}
								</a>
								<span class="text-sm text-gray"
									>{i.tabcoins}
									{i.tabcoins === 1 ? 'tabcoin' : 'tabcoins'} · {i.children_deep_count}
									{i.children_deep_count === 1 ? 'comentário' : 'comentários'} · {i.owner_username}
									· {humanizeData(new Date(i.published_at))} atrás</span
								>
							</div>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
