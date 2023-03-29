export function humanizeData(date: Date): string {
	const now = new Date()
	const diff = Math.abs(now.getTime() - date.getTime())
	const seconds = Math.floor(diff / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (days > 0) {
		return `${days} ${days > 1 ? 'dias' : 'dia'} atrás`
	} else if (hours > 0) {
		return `${hours} ${hours > 1 ? 'horas' : 'hora'} atrás`
	} else if (minutes > 0) {
		return `${minutes} ${minutes > 1 ? 'minutos' : 'minuto'} atrás`
	} else if (seconds > 0) {
		return `${seconds} ${seconds > 1 ? 'segundos' : 'segundo'} atrás`
	}

	return 'agora mesmo'
}
