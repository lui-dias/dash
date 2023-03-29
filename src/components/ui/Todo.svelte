<script lang="ts">
	import { onMount } from 'svelte'
	import { randomID } from '../../utils/randomID'

	type Task = {
		id: string
		title: string
		completed: boolean
	}

	let todos = [] as Task[]
	let value = ''
	let selected = [] as Task[]
	let isCtrlPressed = false

	function addTodo(title: string) {
		todos = [...todos, { id: randomID(3), title, completed: false }]
	}

	$: {
		if (todos.length) {
			localStorage.setItem('todos', JSON.stringify(todos))
		}
	}

	onMount(() => {
		todos = JSON.parse(localStorage.getItem('todos') || '[]')

		document.addEventListener('keydown', e => {
			if (e.key === 'Control') {
				isCtrlPressed = true
			}

			if (e.key === 'Delete') {
				todos = todos.filter(todo => !selected.find(s => s.id === todo.id))
				selected = []

				localStorage.setItem('todos', JSON.stringify(todos))
			}
		})

		document.addEventListener('keyup', e => {
			if (e.key === 'Control') {
				isCtrlPressed = false
			}
		})
	})
</script>

<div>
	<strong class="font-bold text-2xl block text-primary mb-4">Todo</strong>

	<input
		type="text"
		on:keyup={e => {
			if (e.key === 'Enter') {
				addTodo(value)
				value = ''
			}
		}}
		bind:value
		class="w-full border-b-4 border-primary outline-none text-white rounded-lg bg-transparent py-2 font-medium"
	/>

	<ul class="mt-3 flex flex-col px-2">
		<!-- Uncompleted on top -->
		{#each todos.sort((a, b) => {
			if (a.completed && !b.completed) return 1
			if (!a.completed && b.completed) return -1
			return 0
		}) as todo}
			<li>
				<button
					type="button"
					class="w-full flex"
					on:click={e => {
						e.preventDefault()

						const alreadySelected = selected.find(s => s.id === todo.id)

						if (isCtrlPressed) {
							if (alreadySelected) {
								selected = selected.filter(s => s.id !== todo.id)
							} else {
								selected = [...selected, todo]
							}
						} else {
							todo.completed = !todo.completed
						}
					}}
				>
					<label
						for={todo.id}
						class:line-through={todo.completed}
						class={`text-white font-medium text-lg cursor-pointer flex items-center w-full p-2 rounded-lg ${
							selected.find(s => s.id === todo.id)
								? 'bg-primary/30'
								: 'hover:bg-primary/30'
						}`}
					>
						<input
							type="checkbox"
							id={todo.id}
							bind:checked={todo.completed}
							class="mr-4 cursor-pointer w-5 h-5 accent-primary block flex-[0_0_auto]"
						/>
						<span class="text-left">
							{todo.title}
						</span>
					</label>
				</button>
			</li>
		{/each}
	</ul>
</div>
