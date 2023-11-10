import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Palau - IPCC 2023',
	description: 'Palau created this summary of the 2023 IPCC report.',
	openGraph: {
		title: "Palau - IPCC 2023",
		description: "Palau created this summary of the 2023 IPCC report.",
		images: [`http://${process.env.URL}/images/misc/og-image.png`],
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} overscroll-none`}>{children}</body>
		</html>
	)
}
