// const deepMap = require("deep-map");
// const { v4: uuidv4 } = require("uuid");

// Transforms questionnaire into a hash map, mapping IDs to absolute positions
// Thereafter allows O(1) lookup to check if IDs exist & get their positions
const generateOrderedIdMap = ({ questionnaire }) => {
  const map = new Map();

  const traverseIds = (obj) => {
    if (!obj || typeof obj !== "object") {
      return;
    }

    for (const key of Object.keys(obj)) {
      if (key === "id") {
        continue; // Process parent's ID after all children are processed
      }

      if (typeof obj[key] === "object") {
        traverseIds(obj[key]);
      }
    }

    if (obj.id && typeof obj.id === "string") {
      map.set(obj.id, map.size);
    }
  };

  traverseIds(questionnaire);
  return map;
};

// Memoized interface to generateOrderedIdMap
// Only re-compute ordered ID hash map when necessary (different questionnaire / questionnaire has changed)
const getOrderedIdMap = (ctx) => {
  if (getOrderedIdMap.lastInvokation) {
    const {
      questionnaireId,
      updatedAt,
      result,
    } = getOrderedIdMap.lastInvokation;
    if (
      ctx.questionnaire.id === questionnaireId &&
      ctx.questionnaire.updatedAt === updatedAt
    ) {
      return result;
    }
  }

  getOrderedIdMap.lastInvokation = {
    questionnaireId: ctx.questionnaire.id,
    updatedAt: ctx.questionnaire.updatedAt,
    result: generateOrderedIdMap(ctx),
  };

  return getOrderedIdMap.lastInvokation.result;
};

// Efficiently check if questionnaire contains entity with given id
const idExists = (ctx, id) => getOrderedIdMap(ctx).get(id) !== undefined;

// Efficiently get absolute position in questionnaire for entity with given id
// Later pages, answers etc. have higher values than earlier pages, answers, etc.
// const getAbsolutePositionById = (ctx, id) => getOrderedIdMap(ctx).get(id);

// const remapAllNestedIds = (entity) => {
//   const transformationMatrix = {};
//   const remappedIdEntity = deepMap(entity, (value, key) => {
//     if (key === "id") {
//       const newEntityId = uuidv4();
//       transformationMatrix[value] = newEntityId;
//       return newEntityId;
//     }
//     return value;
//   });
//   return deepMap(remappedIdEntity, (value) => {
//     if (Object.keys(transformationMatrix).includes(value)) {
//       return transformationMatrix[value];
//     }
//     return value;
//   });
// };

module.exports = {
  idExists,
  //   getAbsolutePositionById,
  //   generateOrderedIdMap,
  //   getOrderedIdMap,
  //   remapAllNestedIds,
};
