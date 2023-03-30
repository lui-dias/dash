<script lang="ts">
	import { onMount } from 'svelte'
	import { isMoveMode } from '../stores/components'
	import Component from './Component.svelte'
	import DailyDev from './ui/DailyDev.svelte'
	import GithubTopics from './ui/GithubTopics.svelte'
	import Searchbar from './ui/Searchbar.svelte'
	import Tabnews from './ui/Tabnews.svelte'
	import Time from './ui/Time.svelte'
	import Timer from './ui/Timer.svelte'
	import Todo from './ui/Todo.svelte'
	import Toolbar from './ui/Toolbar.svelte'
	import Weather from './ui/Weather.svelte'

	onMount(() => {
		document.addEventListener('keydown', e => {
			if (e.ctrlKey && e.key === 'm') isMoveMode.update(value => !value)
		})
	})
</script>

<Component id="1">
	<Toolbar />
</Component>
<Component id="2">
	<Weather />
</Component>
<Component id="3">
	<Tabnews />
</Component>
<Component id="4">
	<Time />
</Component>
<Component id="5">
	<Searchbar />
</Component>
<Component id="6">
	<DailyDev />
</Component>
<Component id="7">
	<Todo />
</Component>
<Component id="8">
    <Timer />
</Component>
<Component id="9">
	<GithubTopics />
</Component>
