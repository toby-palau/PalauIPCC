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
	},
	plugins: [],
}
export default config
