export function debounce(fn: Function, delay: number) {
	let timer: any = null

	return (...args: any[]) => {
		clearTimeout(timer)
		timer = setTimeout(() => fn(...args), delay)
	}
}
