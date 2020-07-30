const {
  DELETED_PIPING_TITLE,
} = require("../../../constants/validationErrorCodes");
const cheerio = require("cheerio");
const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");

module.exports = function(ajv) {
  ajv.addKeyword("validatePipingInTitle", {
    $data: true,
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) {
      isValid.errors = [];

      const splitDataPath = dataPath.split("/");
      const currentPage =
        questionnaire.sections[splitDataPath[2]].pages[splitDataPath[4]];

      const previousAnswersForPage = getPreviousAnswersForPage(
        questionnaire,
        currentPage.id,
        true
      );
      console.log("\n\npreviousAnswersForPage", previousAnswersForPage);

      const $ = cheerio.load(entityData);
      const pipedIdList = [];

      $("p")
        .find("span")
        .each(function(index, element) {
          pipedIdList.push($(element).data());
        });

      console.log("\n\npipedIdList", pipedIdList);

      let pipingDeleted = false;

      pipedIdList.forEach(dataItem => {
        if (dataItem.piped === "answers") {
          const found = previousAnswersForPage.some(
            el => el.id === dataItem.id
          );
          if (!found) {
            pipingDeleted = true;
            console.log("\n\nid - - - - - - - ", dataItem.id);
            console.log("noooooooooooooooooo");
          }
        }
      });

      if (pipingDeleted) {
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath,
            message: DELETED_PIPING_TITLE,
            params: {},
          },
        ];
        return false;
      }
      return true;
    },
  });
};
