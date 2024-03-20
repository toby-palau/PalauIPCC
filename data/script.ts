const fs = require("fs");
const path = require("path");
const { ulid } = require("ulidx");

let option = process.argv.slice(2)[0];
let filename = process.argv.slice(2)[1];


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
	const jsonFilePath = path.resolve("data", filename);
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

const fillInDisplayLogicIds = () => {
	const jsonFilePath = path.resolve("data", filename);
	const fileContents = fs.readFileSync(jsonFilePath, "utf8");
	const { chapters } = JSON.parse(fileContents);
	for (const chapter of chapters) {
		let i = 0;
		for (const page of chapter.pages) {
			console.log({ pageId: page.pid, pageType: page.pageType });
			if (page.pageType === "question") {
				if (
					chapter.pages[i + 1]?.pageType !== "narrator" ||
					chapter.pages[i + 2]?.pageType !== "narrator"
				) {
					console.log("Expected narrator pages after question");
					continue;
				}

				if (
					!chapter.pages[i + 1]?.displayLogic ||
					!chapter.pages[i + 2]?.displayLogic
				) {
					console.log(
						"Expected narrator pages to not have display logic"
					);
					continue;
				}
				chapter.pages[i + 1].displayLogic = {
					pid: page.pid,
					type: "answeredCorrectly",
					correct: true,
				};
				chapter.pages[i + 2].displayLogic = {
					pid: page.pid,
					type: "answeredCorrectly",
					correct: false,
				};
				console.log(`Updated display logic for question ${page.pid}`);
			}
			i++;
		}
	}
	fs.writeFileSync(jsonFilePath, JSON.stringify({ chapters }, null, 4));
};

if (option == "-h") {
	console.log("-r for regenerate IDs");
	console.log("-f for filling in diplay logic PIDs");
	console.log("-b for both");
} else if (option == "-r") {
	console.log("Regenerating IDs");
	regenerateIds();
	console.log("Regenerated IDs");
} else if (option == "-r") {
	console.log("filling in diplay logic PIDs");
	fillInDisplayLogicIds();
	console.log("filled in diplay logic PIDs");
} else if (option == "-b") {
	console.log("Regenerating IDs");
	regenerateIds();
	console.log("Regenerated IDs");
	console.log("filling in diplay logic PIDs");
	fillInDisplayLogicIds();
	console.log("filled in diplay logic PIDs");
} else {
	console.log("option not found");
}