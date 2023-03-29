<script lang="ts">
	import { onMount } from 'svelte'
	import { DailyDevGraphql } from '../../any/DailyDevGraphql'
	import { shuffle } from '../../utils/shuffle'
	import DailyDevComments from '../icons/DailyDevComments.svelte'
	import DailyDevUpvote from '../icons/DailyDevUpvote.svelte'
	import Loading from './Loading.svelte'

	type Source = {
		id: string
		handle: string
		name: string
		permalink: string
		description: string | null
		image: string
		type: 'machine'
		active: boolean
	}

	type Article = {
		id: string
		title: string
		createdAt: string
		image: string
		readTime: number
		source: Source
		sharedPost: null
		permalink: string
		numComments: number
		numUpvotes: number
		commentsPermalink: string
		scout: null
		author: null
		trending: null
		tags: string[]
		type: 'article'
		private: boolean
		read: null
		upvoted: null
		commented: null
		bookmarked: null
	}

	type Edge = {
		node: Article
	}

	type PageInfo = {
		hasNextPage: boolean
		endCursor: string
	}

	type Page = {
		pageInfo: PageInfo
		edges: Edge[]
	}

	type Data = {
		page: Page
	}

	type DailyDevAPIResponse = {
		data: Data
	}

	let feed = [] as Article[]
	let isLoading = true

	async function getFirstFeed() {
		return await fetch('http://localhost:3228/https://app.daily.dev/api/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: DailyDevGraphql,
				variables: {
					first: 17,
					loggedIn: true,
					ranking: 'POPULARITY',
					version: 7,
				},
			}),
		})
	}

	async function getMoreFeed(after: string) {
		return await fetch('http://localhost:3228/https://app.daily.dev/api/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: DailyDevGraphql,
				variables: {
					after,
					first: 17,
					loggedIn: true,
					ranking: 'POPULARITY',
					version: 7,
				},
			}),
		})
	}

	onMount(async () => {
		let r = await getFirstFeed()

		let json = (await r.json()) as DailyDevAPIResponse

		feed = json.data.page.edges.map(edge => edge.node)

		isLoading = false

		for (let i = 0; i < 3; i++) {
			r = await getMoreFeed(json.data.page.pageInfo.endCursor)

			json = (await r.json()) as DailyDevAPIResponse

			feed = feed.concat(json.data.page.edges.map(edge => edge.node))
		}

		feed = shuffle(feed)
	})
</script>

<div>
	<strong class="font-bold text-2xl text-center block text-primary mb-4">Daily.dev</strong>

	{#if isLoading}
		<Loading />
	{:else}
		<div
			class="grid grid-cols-4 gap-8 max-h-[1500px] overflow-y-auto scrollbar-thumb-black scrollbar-thin"
		>
			{#each feed as i}
				<a href={i.permalink} target="_blank" rel="noopener noreferrer">
					<article
						class="w-80 p-2 rounded-2xl flex flex-col gap-y-2 bg-dark min-h-[22.5rem]"
					>
						<div class="mx-4 flex flex-col gap-y-2">
							<img
								src={i.source.image}
								alt={i.source.name}
								class="object-cover w-8 h-8 rounded-full"
							/>
							<strong
								class="text-white font-bold text-xl overflow-hidden"
								style="-webkit-line-clamp: 3; -webkit-box-orient: vertical; display: -webkit-box;"
							>
								{i.title}
							</strong>
						</div>
						<div class="flex-1" />
						<img
							src={i.image}
							alt="Cover"
							class="object-cover my-2 rounded-xl h-40 w-full"
						/>
						<div class="flex gap-x-6">
							<div class="flex items-center gap-x-2">
								<DailyDevUpvote />
								<span class="font-bold text-white">
									{i.numUpvotes}
								</span>
							</div>
							<div class="flex items-center gap-x-2">
								<DailyDevComments />
								<span class="font-bold text-white">
									{i.numComments}
								</span>
							</div>
						</div>
					</article>
				</a>
			{/each}
		</div>
	{/if}
</div>
