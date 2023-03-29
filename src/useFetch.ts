import { writable, readonly } from 'svelte/store'

type Options = {
	fetchWhen?: () => boolean
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
	headers?: { [key: string]: string }
	body?: any
}

export function useFetch<T>(url: string, options?: Options) {
	let data = writable<T | undefined>(undefined)
	let error = writable('')
	let isLoading = writable(true)

	if (options?.fetchWhen && options.fetchWhen() === false) {
		return {
			data: readonly(data),
			error: readonly(error),
			isLoading: readonly(isLoading),
		}
	}

	if (options?.fetchWhen) {
		delete options.fetchWhen
	}

	fetch(url, options)
		.then(res => {
			isLoading.set(false)

			return res.json()
		})
		.then(json => {
			data.set(json)
		})
		.catch(err => {
			isLoading.set(false)
			error.set(err)
		})

	return {
		data: readonly(data),
		error: readonly(error),
		isLoading: readonly(isLoading),
	}
}
