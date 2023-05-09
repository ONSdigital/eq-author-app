const {
  ERR_UNIQUE_PAGE_DESCRIPTION,
} = require("../../../constants/validationErrorCodes");
const createValidationError = require("../createValidationError");
const { getPages } = require("../../../schema/resolvers/utils");

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
      const pages = getPages({ questionnaire });
      let allPageDescriptions = [];
      pages?.forEach((page) => {
        if (page.id !== parentData.id) {
          allPageDescriptions.push(page.pageDescription);
        }
      });
      const hasDuplicates = allPageDescriptions.includes(
        parentData.pageDescription
      );

      console.log("hasDuplicates :>> ", hasDuplicates);
      console.log("parentData :>> ", parentData);
      if (hasDuplicates) {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            ERR_UNIQUE_PAGE_DESCRIPTION,
            questionnaire
          ),
        ];
        console.log("isValid :>> ", isValid);
        return false;
      } else {
        return true;
      }
    },
  });
