const {
  ERR_UNIQUE_PAGE_DESCRIPTION,
} = require("../../../constants/validationErrorCodes");
const createValidationError = require("../createValidationError");
const { getPages, getSections } = require("../../../schema/resolvers/utils");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validatePageDescription",
    $data: true,
    validate: function isValid(
      _schema,
      label,
      _parentSchema,
      {
        parentData,
        parentDataProperty: fieldName,
        instancePath,
        rootData: questionnaire,
      }
    ) {
      const sections = getSections({ questionnaire });
      const pages = getPages({ questionnaire });
      let allPageDescriptions = [];

      sections?.forEach((section) => {
        if (section.id === parentData.id) {
          if (fieldName === "introductionPageDescription") {
            allPageDescriptions.push(section.sectionSummaryPageDescription);
          } else {
            allPageDescriptions.push(section.introductionPageDescription);
          }
        } else {
          allPageDescriptions.push(section.introductionPageDescription);
          allPageDescriptions.push(section.sectionSummaryPageDescription);
        }
      });
      pages?.forEach((page) => {
        if (page.id !== parentData.id) {
          allPageDescriptions.push(page.pageDescription);
        } else {
          if (page.pageType === "ListCollectorPage") {
            if (fieldName === "pageDescription") {
              allPageDescriptions.push(page.anotherPageDescription);
              allPageDescriptions.push(page.addItemPageDescription);
            } else if (fieldName === "anotherPageDescription") {
              allPageDescriptions.push(page.pageDescription);
              allPageDescriptions.push(page.addItemPageDescription);
            } else {
              allPageDescriptions.push(page.pageDescription);
              allPageDescriptions.push(page.anotherPageDescription);
            }
          } else if (page.confirmation) {
            allPageDescriptions.push(page.confirmation.pageDescription);
          }
        }
      });

      let hasDuplicates = false;
      if (fieldName === "pageDescription") {
        hasDuplicates = allPageDescriptions.includes(
          parentData.pageDescription
        );
      } else if (fieldName === "introductionPageDescription") {
        hasDuplicates = allPageDescriptions.includes(
          parentData.introductionPageDescription
        );
      } else if (fieldName === "sectionSummaryPageDescription") {
        hasDuplicates = allPageDescriptions.includes(
          parentData.sectionSummaryPageDescription
        );
      } else if (fieldName === "anotherPageDescription") {
        hasDuplicates = allPageDescriptions.includes(
          parentData.anotherPageDescription
        );
      } else if (fieldName === "addItemPageDescription") {
        hasDuplicates = allPageDescriptions.includes(
          parentData.addItemPageDescription
        );
      }

      if (hasDuplicates) {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            ERR_UNIQUE_PAGE_DESCRIPTION,
            questionnaire
          ),
        ];
        return false;
      } else {
        return true;
      }
    },
  });
