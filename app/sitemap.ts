import { listAllChapters } from '@root/services/QuestionFlowService';
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const chapters = await listAllChapters();
	const baseUrl = process.env.URL ?? "https://ipcc.palauproject.com";
	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		...chapters.map(c => ({
			url: `${baseUrl}/chapters/${c.cid}`,
			lastModified: new Date(),
			changeFrequency: "daily" as "daily",
			priority: 0.8,
		}))
	];
}
