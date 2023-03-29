const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#bb85dd',
				secondary: '#AD87F5',
				dark: '#553C80',
				gray: '#837599',
				black: '#312D34',
                white: '#E7DDEE',
                bg: '#262440',
                contrast: '#EB81CB'
			},
		},
	},
	plugins: [require('tailwind-scrollbar')],
}
