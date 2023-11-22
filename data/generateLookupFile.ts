const fs = require("fs");
const path = require("path");

(() => {
    const jsonFilePath = path.resolve("data", "question-flow.json");
    const fileContents = fs.readFileSync(jsonFilePath, "utf8");
    const { chapters } = JSON.parse(fileContents);

    const csvFilePath = path.resolve("data", "lookup.csv");
    const csvFile = fs.createWriteStream(csvFilePath);
    csvFile.write("questionID,questionText,chapterId,chapterTitle\n");

    for (const chapter of chapters) {
        for (const page of chapter.pages) {
            if (page.pageType === "question") csvFile.write(`"${page.pid}","${page.question.questionText}","${chapter.cid}","${chapter.chapterTitle}"\n`);
        }
    }
})();