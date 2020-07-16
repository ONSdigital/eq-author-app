const Ajv = require("ajv");
const { get, uniqBy, map, groupBy, sum } = require("lodash");

const schemas = require("./schemas");

const {
  PAGES,
  OPTIONS,
  ANSWERS,
  SECTIONS,
  CONFIRMATION,
  CONFIRMATION_OPTION,
  VALIDATION,
  EXPRESSIONS,
  MIN_VALUE,
  MAX_VALUE,
  MIN_DURATION,
  MAX_DURATION,
  START_DATE,
  END_DATE,
} = require("../../constants/validationErrorTypes");

const {
  ERR_EARLIEST_AFTER_LATEST,
  ERR_MAX_DURATION_TOO_SMALL,
} = require("../../constants/validationErrorCodes");

const ajv = new Ajv({ allErrors: true, jsonPointers: true, $data: true });

require("ajv-errors")(ajv);
require("./customKeywords")(ajv);
require("ajv-keywords")(ajv, "select");

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

const convertObjectType = objectType => {
  switch (objectType) {
    case "additionalAnswer":
    case "properties":
      return ANSWERS;

    case MIN_VALUE:
    case MAX_VALUE:
    case MIN_DURATION:
    case MAX_DURATION:
    case START_DATE:
    case END_DATE:
      return VALIDATION;

    case "positive":
    case "negative":
      return CONFIRMATION_OPTION;

    default:
      return objectType;
  }
};

module.exports = questionnaire => {
  //These are errors that are reported in two or more places however we only want to add to the total count once.
  const duplicatedErrorMessages = {
    ERR_MIN_LARGER_THAN_MAX: { occurrencesPerError: 2 },
    [ERR_EARLIEST_AFTER_LATEST]: { occurrencesPerError: 2 },
    [ERR_MAX_DURATION_TOO_SMALL]: { occurrencesPerError: 2 },
  };
  const topLevelEntities = [PAGES, CONFIRMATION, SECTIONS];

  const entitiesWithChildren = [PAGES, CONFIRMATION];
  const removeDuplicateCounts = object => {
    map(object, (entity, key) => {
      if (entitiesWithChildren.includes(key)) {
        map(entity, item => {
          const groupedErrors = groupBy(item.errors, error => error.errorCode);
          const totalErrors = sum(
            map(groupedErrors, (errors, errorCode) => {
              if (duplicatedErrorMessages[errorCode]) {
                return Math.round(
                  errors.length /
                    duplicatedErrorMessages[errorCode].occurrencesPerError
                );
              }
              return errors.length;
            })
          );
          item.totalCount = totalErrors;
        });
      }
    });
    const totalErrors = sum(
      map(topLevelEntities, entityKey =>
        sum(map(object[entityKey], item => item.totalCount))
      )
    );
    object.totalCount = totalErrors;

    return object;
  };

  validate(questionnaire);

  if (!validate.errors) {
    return {
      [ANSWERS]: {},
      [PAGES]: {},
      [OPTIONS]: {},
      [SECTIONS]: {},
      [CONFIRMATION]: {},
      [CONFIRMATION_OPTION]: {},
      [VALIDATION]: {},
      [EXPRESSIONS]: {},
      totalCount: 0,
    };
  }

  const errorMessages = validate.errors.filter(
    err => err.keyword === "errorMessage"
  );

  console.log("\n\nerrorMessages", errorMessages);
  const transformedMessages = uniqBy(errorMessages, "dataPath")
    .map(error => {
      const dataPath = error.dataPath.split("/");

      const fieldname = dataPath.pop();
      let objectType = dataPath[dataPath.length - 1];

      if (!isNaN(objectType)) {
        // Must be in array of object type so get object type
        // e.g. /sections/0/pages/0/answers/0/options/0/label
        objectType = dataPath[dataPath.length - 2];
      }

      const contextPath = dataPath.slice(1).join(".");

      const contextObj = get(questionnaire, contextPath);

      const objectId =
        objectType === "expressions"
          ? dataPath.includes("skipConditions")
            ? `${objectType}-skipConditions`
            : `${objectType}-routing`
          : objectType;

      return {
        id: `${objectId}-${contextObj.id}-${fieldname}`,
        entityId: contextObj.id,
        type: convertObjectType(objectType),
        field: fieldname,
        errorCode: error.message,
        dataPath: dataPath.slice(1),
      };
    })
    .reduce(
      (structure, error) => {
        const { entityId, type, dataPath } = error;

        const errorInfo = structure[type][entityId] || {
          id: entityId,
          totalCount: 0,
          errors: [],
        };

        structure[type][entityId] = {
          ...errorInfo,
          totalCount: errorInfo.totalCount + 1,
          errors: [...errorInfo.errors, error],
        };

        const isChildOfPage =
          dataPath[0] === "sections" &&
          dataPath[2] === "pages" &&
          dataPath.length > 5;

        if (isChildOfPage) {
          const sectionIndex = parseInt(dataPath[1], 10);
          const pageIndex = parseInt(dataPath[3], 10);
          const page = questionnaire.sections[sectionIndex].pages[pageIndex];

          let pageType = PAGES;
          let pageId = page.id;

          if (dataPath[4] === "confirmation") {
            pageType = CONFIRMATION;
            pageId = page.confirmation.id;
          }

          const existingPageErrors = get(
            structure,
            `${pageType}.${pageId}.errors`
          );
          const errorInfo = {
            id: pageId,
            errors: existingPageErrors
              ? [...structure[pageType][pageId].errors, error]
              : [error],
          };
          structure[pageType][pageId] = {
            ...errorInfo,
          };
        }
        console.log("\n\nstructure", structure.expressions);
        console.log(JSON.stringify(structure, null, 7));
        return structure;
      },
      {
        [ANSWERS]: {},
        [PAGES]: {},
        [OPTIONS]: {},
        [SECTIONS]: {},
        [CONFIRMATION]: {},
        [CONFIRMATION_OPTION]: {},
        [VALIDATION]: {},
        [EXPRESSIONS]: {},
        totalCount: errorMessages.length,
      }
    );

  return removeDuplicateCounts(transformedMessages);
};
