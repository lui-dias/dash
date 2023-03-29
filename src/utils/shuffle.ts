export function shuffle<T>(array: T[]): T[] {
	const copy = [...array]
	for (let i = 0; i < copy.length; i++) {
		const j = Math.floor(Math.random() * copy.length)

        const temp = copy[i]
        copy[i] = copy[j]
        copy[j] = temp
	}
	return copy
}
