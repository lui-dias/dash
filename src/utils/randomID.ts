export function randomID(size = 10) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let id = ''
	for (let i = 0; i < size; i++) {
		id += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return id
}
