const fs = require("fs");
const path = require("path");
const { ulid } = require("ulidx");

// const generateLookupFile = () => {
//     const jsonFilePath = path.resolve("data", "ipcc-question-flow.json");
//     const fileContents = fs.readFileSync(jsonFilePath, "utf8");
//     const { chapters } = JSON.parse(fileContents);

//     const csvFilePath = path.resolve("data", "lookup.csv");
//     const csvFile = fs.createWriteStream(csvFilePath);
//     csvFile.write("questionID,questionText,chapterId,chapterTitle\n");

//     for (const chapter of chapters) {
//         for (const page of chapter.pages) {
//             if (page.pageType === "question") csvFile.write(`"${page.pid}","${page.question.questionText}","${chapter.cid}","${chapter.chapterTitle}"\n`);
//         }
//     }
// }

const regenerateIds = () => {
	const jsonFilePath = path.resolve("data", "esrs-m1-question-flow.json");
	const fileContents = fs.readFileSync(jsonFilePath, "utf8");
	const { chapters } = JSON.parse(fileContents);
	for (const chapter of chapters) {
		chapter.cid = `CID_${ulid()}`;
		for (const page of chapter.pages) {
			page.pid = `PID_${ulid()}`;
			if (page.pageType === "question" && page.question.options) {
				const optionMapping: { [oldOid: string]: string } = {};
				for (const option of page.question.options) {
					const newOid = `OID_${ulid()}`;
					optionMapping[option.oid] = newOid;
					option.oid = newOid;
				}
				page.question.correctAnswer = page.question.correctAnswer.map(
					(o: string) => optionMapping[o]
				);
			}
		}
	}
	fs.writeFileSync(jsonFilePath, JSON.stringify({ chapters }, null, 4));
};

regenerateIds();
