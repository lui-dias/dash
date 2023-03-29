export function removeDuplicateObject<T extends Record<string, any>>(array: T[], key: string): T[] {
	return array.filter((obj, index, self) => {
		return self.findIndex(t => t[key] === obj[key]) === index
	})
}
