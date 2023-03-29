<script lang="ts">
	import Download from '../icons/Download.svelte'
	import Upload from '../icons/Upload.svelte'

	function exportConfig() {
		const config = Object.entries(localStorage).reduce(
			(acc, [key, value]) => ({ ...acc, [key]: value }),
			{},
		)

		navigator.clipboard.writeText(JSON.stringify(config, null, 4))
	}

    async function importConfig() {
        const clipboard = await navigator.clipboard.readText()

        try {
            const data = JSON.parse(clipboard) as Record<string, any>

            for (const [k, v] of Object.entries(data)) {
                localStorage.setItem(k, v)
            }
        } catch (error) {
            console.error(error)
        }
    }
</script>

<div class="flex gap-x-3">
	<button on:click={exportConfig} title="Copy localStorage to clipboard">
		<Download />
	</button>
	<button on:click={importConfig} title="Import config to localStorage">
		<Upload />
	</button>
</div>
