<script lang="ts">
	import { onMount } from 'svelte'
	import { selected, isMoveMode } from '../stores/components'

	function saveComponent(id: string, data: Record<string, any>) {
		const components = JSON.parse(localStorage.getItem('components') || '{}')
		components[id] = { ...components[id], ...data }
		localStorage.setItem('components', JSON.stringify(components))
	}

	function getComponent(id: string) {
		const components = JSON.parse(localStorage.getItem('components') || '{}')
		return components[id]
	}

	export let id: string

	let ref: HTMLElement

	let savedX = 0
	let savedY = 0
	let savedWidth: number | 'auto' = 0
	let savedHeight: number | 'auto' = 0

	let lastMouseXResize = 0
	let lastMouseYResize = 0

	let boundDirection: 'top' | 'bottom' | 'left' | 'right' | 'inside' | null = null
	let mouseIsDown = false
	let isResizingOrMoving = false

	$: if (!$isMoveMode) {
		selected.set(null)
	}

	onMount(() => {
		if (!getComponent(id)) {
			saveComponent(id, { x: 0, y: 0, w: 'auto', h: 'auto' })
		}

		const { x, y, w, h } = getComponent(id)

		savedX = x
		savedY = y
		savedWidth = w
		savedHeight = h
	})

	onMount(() => {
		// align and fit component
		document.addEventListener('keydown', e => {
			if (!$isMoveMode || $selected !== id) return

			const { key, ctrlKey, altKey } = e
			const bounds = ref.getBoundingClientRect()

			if (ctrlKey && altKey) {
				// align center x
				if (key === '[') {
					savedX = (window.innerWidth - bounds.width) / 2
				}

				// align center y
				else if (key === ']') {
					savedY = (window.innerHeight - bounds.height) / 2
				}

				// align top
				else if (key === 'ArrowUp') {
					savedY = 0 + document.documentElement.scrollTop
				}

				// align bottom
				else if (key === 'ArrowDown') {
					savedY = window.innerHeight - bounds.height + document.documentElement.scrollTop
				}

				// align left
				else if (key === 'ArrowLeft') {
					savedX = 0 + document.documentElement.scrollLeft
				}

				// align right
				else if (key === 'ArrowRight') {
					savedX = window.innerWidth - bounds.width + document.documentElement.scrollLeft
				}

				// fit component
				if (key === 'f') {
					ref.style.width = 'auto'
					ref.style.height = 'auto'

					const { width, height } = ref.getBoundingClientRect()

					savedWidth = width
					savedHeight = height
				}
			}

			saveComponent(id, { x: savedX })
		})

		// move by keys
		document.addEventListener('keydown', e => {
			if (!$isMoveMode || $selected !== id) return

			const { key, ctrlKey } = e

			if (ctrlKey) {
				if (key === 'j') {
					savedY -= 10
				} else if (key === 'k') {
					savedY += 10
				} else if (key === 'h') {
					savedX -= 10
				} else if (key === 'l') {
					savedX += 10
				}
			} else {
				if (key === 'j') {
					savedY -= 1
				} else if (key === 'k') {
					savedY += 1
				} else if (key === 'h') {
					savedX -= 1
				} else if (key === 'l') {
					savedX += 1
				}
			}

			saveComponent(id, { x: savedX, y: savedY })
		})

		// set mouse down, keep isResizingOrMoving
		ref.addEventListener('mousedown', () => {
			mouseIsDown = true

			if (!['inside', null].includes(boundDirection)) {
				isResizingOrMoving = true
			}
		})

		// Reset mouse down and resizing
		document.addEventListener('mouseup', () => {
			mouseIsDown = false
			isResizingOrMoving = false
			lastMouseXResize = 0
			lastMouseYResize = 0
		})

		// Set selected component
		ref.addEventListener('mousedown', () => {
			if (!$isMoveMode) return
			ref.style.userSelect = 'none'

			selected.set(null)
			selected.set(id)
		})

		// Detect bounds
		ref.addEventListener('mousemove', e => {
			if (isResizingOrMoving || !$isMoveMode) return

			const mouseX = e.clientX
			const mouseY = e.clientY

			const bounds = ref.getBoundingClientRect()

			if (
				// bottom
				mouseX > bounds.left &&
				mouseX < bounds.right &&
				mouseY > bounds.bottom - 10 &&
				mouseY < bounds.bottom
			) {
				boundDirection = 'bottom'
				ref.style.cursor = 'ns-resize'
			} else if (
				// top
				mouseX > bounds.left &&
				mouseX < bounds.right &&
				mouseY > bounds.top &&
				mouseY < bounds.top + 10
			) {
				boundDirection = 'top'
				ref.style.cursor = 'ns-resize'
			} else if (
				// left
				mouseX > bounds.left &&
				mouseX < bounds.left + 10 &&
				mouseY > bounds.top &&
				mouseY < bounds.bottom
			) {
				boundDirection = 'left'
				ref.style.cursor = 'ew-resize'
			} else if (
				// right
				mouseX > bounds.right - 10 &&
				mouseX < bounds.right &&
				mouseY > bounds.top &&
				mouseY < bounds.bottom
			) {
				boundDirection = 'right'
				ref.style.cursor = 'ew-resize'
			} else {
				ref.style.cursor = 'move'
				boundDirection = 'inside'
			}
		})

		// Set null bound outside
		ref.addEventListener('mouseleave', () => {
			if (isResizingOrMoving) return

			boundDirection = null
		})

		// Resize component
		document.addEventListener('mousemove', e => {
			if (!ref) return

			if (!mouseIsDown || !$isMoveMode) return

			if (boundDirection) {
				const { clientX, clientY } = e
				const bounds = ref.getBoundingClientRect()
				const w = bounds.width
				const h = bounds.height
				const l = bounds.left
				const t = bounds.top

				const ww = window.innerWidth
				const wh = window.innerHeight

				const diffX = clientX - (lastMouseXResize || clientX)
				const diffY = clientY - (lastMouseYResize || clientY)

				lastMouseXResize = clientX
				lastMouseYResize = clientY

				if (boundDirection === 'top') {
					// is top bound
					if (t + diffY <= 0) return

					ref.style.height = `${h - diffY}px`
					ref.style.top = `${t + diffY}px`
				} else if (boundDirection === 'bottom') {
					// is bottom bound
					if (t + h + diffY >= wh) return

					ref.style.height = `${h + diffY}px`
				} else if (boundDirection === 'left') {
					// is left bound
					if (l + diffX <= 0) return

					ref.style.width = `${w - diffX}px`
					ref.style.left = `${l + diffX}px`
				} else if (boundDirection === 'right') {
					// is right bound
					if (l + w + diffX >= ww) return

					ref.style.width = `${w + diffX}px`
				}

				const { left, top, width, height } = ref.getBoundingClientRect()

				saveComponent(id, {
					x: left,
					y: top,
					w: width,
					h: height,
				})
			}
		})

		// Move component
		selected.subscribe(s => {
			if (boundDirection !== 'inside' || !ref) return

			let { x, y } = getComponent(id)

			let lastMouseX = 0
			let lastMouseY = 0

			function mouseDown(e: MouseEvent) {
				lastMouseX = e.clientX
				lastMouseY = e.clientY
			}

			function mouseMove(e: MouseEvent) {
				if (s !== id) return

				const { clientX, clientY } = e
				const diffX = clientX - lastMouseX
				const diffY = clientY - lastMouseY

				lastMouseX = clientX
				lastMouseY = clientY

				x += diffX
				y += diffY

				const bounds = ref.getBoundingClientRect()
				const w = bounds.width

				const ww = window.innerWidth

				if (x < 0) x = 0
				if (y < 0) y = 0

				if (x + w > ww) x = ww - w

				ref.style.left = `${x}px`
				ref.style.top = `${y}px`

				savedX = x
				savedY = y

				saveComponent(id, { x, y })
			}

			function mouseUp() {
				document.body.removeEventListener('mousedown', mouseDown)
				document.body.removeEventListener('mousemove', mouseMove)
				document.body.removeEventListener('mouseup', mouseUp)
			}

			if (s === id && $isMoveMode) {
				document.body.addEventListener('mousedown', mouseDown)
				document.body.addEventListener('mousemove', mouseMove)
				document.body.addEventListener('mouseup', mouseUp)
			}
		})
	})
</script>

<div
	{id}
	style="left: {savedX}px; top: {savedY}px; width: {savedWidth === 'auto'
		? 'auto'
		: `${savedWidth}px`}; height: {savedHeight === 'auto' ? 'auto' : `${savedHeight}px`};"
	class={`${$isMoveMode ? 'cursor-move border-2 border-contrast' : ''} absolute`}
	bind:this={ref}
>
	<slot />
</div>
