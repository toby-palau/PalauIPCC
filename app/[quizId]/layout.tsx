import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { QuizIdType } from "@root/@types/shared.types";


const inter = DM_Sans({ subsets: ["latin"] })

export const generateMetadata = ({ params }: { params: { quizId: QuizIdType } }): Metadata => {
	if (params.quizId === "ipcc") return {
		metadataBase: new URL(`${process.env.URL ?? "https://quiz.palauproject.com"}`),
		title: "IPCC for dummies",
		description: "Explore bite-sized chapters of the IPCC report in a gamified format. Learn about expert strategies for adaptation and mitigation without being overwhelmed by dense research papers.",
		keywords: ["Climate change education", "IPCC 2023", "Gamified learning", "Interactive climate scenarios", "Sustainability", "Educational games", "Climate action", "Environmental challenges"],
		verification: {
			google: ["xWmWb_2Fjr2R6QRZjfgvYcO0fwaecB7iRHL_4gkMQkk"]
		},
		openGraph: {
			title: "IPCC for dummies",
			description: "Explore bite-sized chapters of the IPCC report in a gamified format. Learn about expert strategies for adaptation and mitigation without being overwhelmed by dense research papers.",
			images: ["/images/misc/og-image-ipcc.png"],
		}
	}
	else return {
		metadataBase: new URL(`${process.env.URL ?? "https://quiz.palauproject.com"}`),
		title: "COP28 Recap",
		description: "Dive into the key topics of COP28 with this engaging quiz. Test your knowledge on climate action goals, renewable energy, and global challenges in a concise and informative way.",
		keywords: ["Climate change education", "COP28", "Gamified learning", "Interactive climate scenarios", "Sustainability", "Educational games", "Climate action", "Environmental challenges"],
		verification: {
			google: ["xWmWb_2Fjr2R6QRZjfgvYcO0fwaecB7iRHL_4gkMQkk"]
		},
		openGraph: {
			title: "COP28 Recap",
			description: "Dive into the key topics of COP28 with this engaging quiz. Test your knowledge on climate action goals, renewable energy, and global challenges in a concise and informative way.",
			images: ["/images/misc/og-image-cop.png"],
		}
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} overscroll-none`}>
				{children}
				<Analytics />
			</body>
		</html>
	)
}
