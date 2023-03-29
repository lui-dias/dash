const isVisible = (elem: any) =>
	!!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

export function outsideClick(node: any, callback: any) {
	const handleClick = (event: any) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented && isVisible(node)) {
			callback(event)
		}
	}

	document.addEventListener('click', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true)
		},
	}
}
