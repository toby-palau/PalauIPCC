import type { Config } from "tailwindcss"

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		colors: {
			"transparent": "transparent",
			"blue": "#63A4D1",
			"black": {
				"DEFAULT": "#222223",
				"light": "#2C2C2D",
				"dark": "#1E1E1F",
			},
			"white": {
				"DEFAULT": "#FFFFFF",
				"light": "#F7F7F7",
				"dark": "#CDCDCD",
			},
			"green": {
				"DEFAULT": "#4CAF50",
				"light": "#8BC34A",
				"dark": "#388E3C",
			},
			"red": {
				"DEFAULT": "#F44336",
				"light": "#E57373",
				"dark": "#D32F2F",
			},
		},
		extend: {
			keyframes: {
				wave: {
					'0%': { transform: 'rotate(0.0deg)' },
					'20%': { transform: 'rotate(1.5deg)' },
					'40%': { transform: 'rotate(-1.5deg)' },
					'60%': { transform: 'rotate(1.5deg)' },
					'80%': { transform: 'rotate(0.0deg)' },
					'100%': { transform: 'rotate(0.0deg)' },
				},
			},
			animation: {
				wiggle: 'wave 0.5s linear 1',
			},
		}
	},
	plugins: [],
}
export default config
