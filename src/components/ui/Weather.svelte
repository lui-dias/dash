<script lang="ts">
	import { onMount } from 'svelte'
	import { useFetch } from '../../useFetch'
	import Loading from './Loading.svelte'

	type Weather = {
		current_condition: CurrentCondition[]
		nearest_area: NearestArea[]
		request: Request[]
		weather: WeatherElement[]
	}

	type CurrentCondition = {
		FeelsLikeC: string
		FeelsLikeF: string
		cloudcover: string
		humidity: string
		localObsDateTime: string
		observation_time: string
		precipInches: string
		precipMM: string
		pressure: string
		pressureInches: string
		temp_C: string
		temp_F: string
		uvIndex: string
		visibility: string
		visibilityMiles: string
		weatherCode: string
		weatherDesc: WeatherDesc[]
		weatherIconUrl: WeatherDesc[]
		winddir16Point: string
		winddirDegree: string
		windspeedKmph: string
		windspeedMiles: string
	}

	type WeatherDesc = {
		value: string
	}

	type NearestArea = {
		areaName: WeatherDesc[]
		country: WeatherDesc[]
		latitude: string
		longitude: string
		population: string
		region: WeatherDesc[]
		weatherUrl: WeatherDesc[]
	}

	type Request = {
		query: string
		type: string
	}

	type WeatherElement = {
		astronomy: Astronomy[]
		avgtempC: string
		avgtempF: string
		date: Date
		hourly: Hourly[]
		maxtempC: string
		maxtempF: string
		mintempC: string
		mintempF: string
		sunHour: string
		totalSnow_cm: string
		uvIndex: string
	}

	type Astronomy = {
		moon_illumination: string
		moon_phase: string
		moonrise: string
		moonset: string
		sunrise: string
		sunset: string
	}

	type Hourly = {
		DewPointC: string
		DewPointF: string
		FeelsLikeC: string
		FeelsLikeF: string
		HeatIndexC: string
		HeatIndexF: string
		WindChillC: string
		WindChillF: string
		WindGustKmph: string
		WindGustMiles: string
		chanceoffog: string
		chanceoffrost: string
		chanceofhightemp: string
		chanceofovercast: string
		chanceofrain: string
		chanceofremdry: string
		chanceofsnow: string
		chanceofsunshine: string
		chanceofthunder: string
		chanceofwindy: string
		cloudcover: string
		humidity: string
		precipInches: string
		precipMM: string
		pressure: string
		pressureInches: string
		tempC: string
		tempF: string
		time: string
		uvIndex: string
		visibility: string
		visibilityMiles: string
		weatherCode: string
		weatherDesc: WeatherDesc[]
		weatherIconUrl: WeatherDesc[]
		winddir16Point: string
		winddirDegree: string
		windspeedKmph: string
		windspeedMiles: string
	}

	let lat = 0
	let lon = 0

	let data: Weather | undefined = undefined
	let error: Error | undefined = undefined
	let isLoading: boolean = true

	onMount(() => {
		navigator.geolocation.getCurrentPosition(async ({ coords }) => {
			lat = coords.latitude
			lon = coords.longitude

			const r = await fetch(`https://wttr.in/${lat},${lon}?format=j1`)

			if (r.ok) {
				data = await r.json()
			} else {
				error = new Error('Error')
			}

			isLoading = false
		})
	})
</script>

{#if isLoading}
	<Loading />
{:else if $error}
	<div>Error</div>
{:else}
	<div>
		<div>
			<strong class="text-white text-2xl">
				{data?.current_condition[0].temp_C}
			</strong>
			<span class="text-primary font-bold text-xl"> °C </span>
		</div>
	</div>
{/if}
