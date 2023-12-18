import { QuizIdType } from '@root/@types/shared.types';
import { listAllChapters } from '@root/services/QuestionFlowService';
import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.URL ?? "https://quiz.palauproject.com";
	const resultArray: MetadataRoute.Sitemap = [];
	for (const quizId of ["ipcc", "cop"]) {
		const chapters = await listAllChapters(quizId as QuizIdType);
		resultArray.push({
			url: `${baseUrl}/${quizId}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		});
		resultArray.push(
			...chapters.map(c => ({
				url: `${baseUrl}/${quizId}/chapters/${c.cid}`,
				lastModified: new Date(),
				changeFrequency: "daily" as "daily",
				priority: 0.8,
			}))
		);
	}
	return resultArray;
}
