import { MetadataRoute } from "next"
 
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
			"/hidden-dashboard", 
			"/hidden-dashboard/*", 
			"/api", 
			"/api/*", 
			"/*/chapters", 
			"/*/chapters/*"
			],
		},
		sitemap: `${process.env.URL ?? "https://quiz.palauproject.com"}/sitemap.xml`,
	}
}
