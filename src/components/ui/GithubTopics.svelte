<script lang="ts">
	import { parse } from 'node-html-parser'
	import { onMount } from 'svelte'
	import { humanizeData } from '../../utils/humanizeDate'
	import { removeDuplicateObject } from '../../utils/removeDuplicateObject'
	import Star from '../icons/Star.svelte'
	import Loading from './Loading.svelte'

	type Repo = {
		owner: string
		repo: string
		description: string
		stars: string
		time: string
		image?: string
		url: string
	}

	let isLoading = true
	let repos = [] as Repo[]
	let topic = 'javascript'
	let value = ''

	async function getRepos() {
		const rs = await Promise.all(
			Array(10)
				.fill(0)
				.map(async (_, i) => {
					const r = await fetch(
						`http://localhost:3228/https://github.com/topics/${topic}?o=desc&s=updated&page=${i}`,
					)

					return parse(await r.text())
				}),
		)

		let data = [] as Repo[]

		for (const page of rs) {
			for (const article of page.querySelectorAll('article')) {
				const [owner, repo] = article.querySelectorAll('div > div > div > h3 > a')
				const description = article.querySelector('div:last-child p')
				const stars = article.querySelector('#repo-stars-counter-star')
				const time = article.querySelector('relative-time')
				const image = article.querySelector('a > img')

				const _owner = owner.text.trim()
				const _repo = repo.text.trim()
				const _description = description ? description.text.trim() : ''
				const _stars = stars!.text
				const _time = time!.getAttribute('datetime')!
				const _image = image?.getAttribute('src')
				const _url = `https://github.com/${_owner}/${_repo}`

				data.push({
					owner: _owner,
					repo: _repo,
					description: _description,
					stars: _stars,
					time: _time,
					image: _image,
					url: _url,
				})
			}
		}

		data = removeDuplicateObject(data, 'url').sort((a, b) => {
			return new Date(b.time).getTime() - new Date(a.time).getTime()
		})

		repos = data

		isLoading = false
	}

	onMount(() => {
		const savedTopic = localStorage.getItem('topic') || 'javascript'

		topic = savedTopic

		getRepos()
	})
</script>

{#if isLoading}
	<Loading />
{:else}
	<div class="pl-2 pr-4">
		<strong class="font-bold text-2xl text-center block text-primary mb-4"
			>{topic} topics</strong
		>

		<input
			type="text"
			placeholder="Topic"
			class="w-48 border-b-4 border-primary outline-none text-white rounded-lg bg-transparent py-2 font-medium"
			bind:value
			on:keydown={e => {
				if (e.key === 'Enter') {
					isLoading = true
					topic = value
					value = ''
					localStorage.setItem('topic', topic)
					getRepos()
				}
			}}
		/>

		<div
			class="mt-6 flex flex-col gap-y-5 max-h-[1500px] overflow-y-auto scrollbar-thumb-black scrollbar-thin"
		>
			{#each repos as repo}
				<div>
					{#if repo.image}
						<img
							src={repo.image}
							alt={repo.repo}
							class="w-full max-h-72 object-cover block mb-2"
						/>
					{/if}
					<div class="flex justify-between">
						<div class="text-xl font-bold text-white">
							<a href={`https://github.com/${repo.owner}`}>{repo.owner}</a>
							<span>/</span>
							<a href={`https://github.com/${repo.owner}/${repo.repo}`}>{repo.repo}</a
							>
						</div>
						<div class="flex items-center gap-x-2">
							<Star />
							<span class="text-white font-bold">{repo.stars}</span>
						</div>
					</div>
					<div>
						<p class="text-medium text-gray">
							{repo.description}
						</p>
					</div>
					<div>
						<span class="font-medium text-dark"
							>{humanizeData(new Date(repo.time))}</span
						>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
