import { writable, Writable } from 'svelte/store'

export const isMoveMode: Writable<boolean> = writable(false)
export const selected: Writable<string | null> = writable(null)
