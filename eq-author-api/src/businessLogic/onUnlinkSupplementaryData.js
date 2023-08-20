const cheerio = require("cheerio");

const onUnlinkSupplementaryData = (questionnaire, oldSupplementaryData) => {
  const pipedAnswerIdRegex = /data-piped="supplementary" data-id="(.+?)"/gm;
  const trimDateRangeId = (id) => id.replace(/(from|to)$/, "");

  const supplementaryDataFieldIds = [];
  const supplementaryDataListIds = [];
  oldSupplementaryData.forEach((list) => {
    supplementaryDataListIds.push(list.id);
    list.schemaFields.forEach((field) => {
      supplementaryDataFieldIds.push(field.id);
    });
  });

  const updatePipingValue = (htmlText, answerId, newValue) => {
    if (!htmlText) {
      return htmlText;
    }
    const htmlDoc = cheerio.load(htmlText, null, false);
    const dataSpan = htmlDoc(`span[data-id=${answerId}]`);
    dataSpan.each((i, elem) => {
      elem.children[0].data = `[${newValue.replace(/(<([^>]+)>)/gi, "")}]`;
    });
    return htmlDoc.html();
  };

  const traverseObject = (obj) => {
    let matches;
    if (!obj || typeof obj !== "object") {
      return;
    }

    Object.keys(obj).forEach((key) => {
      if (
        typeof obj[key] === "string" &&
        [
          "title",
          "label",
          "description",
          "introductionTitle",
          "introductionContent",
        ].includes(key)
      ) {
        const pipedIdList = [];
        while ((matches = pipedAnswerIdRegex.exec(obj[key])) !== null) {
          const [, pipedId] = matches;
          pipedIdList.push(trimDateRangeId(pipedId));
        }

        pipedIdList.forEach((pipedId) => {
          if (supplementaryDataFieldIds.includes(pipedId)) {
            obj[key] = updatePipingValue(obj[key], pipedId, "Deleted answer");
          }
        });
      }
      traverseObject(obj[key]);
    });
  };

  traverseObject(questionnaire);

  questionnaire.sections.forEach((section) => {
    if (supplementaryDataListIds.includes(section.repeatingSectionListId)) {
      section.repeatingSectionListId = "";
    }
  });
};

module.exports = onUnlinkSupplementaryData;
