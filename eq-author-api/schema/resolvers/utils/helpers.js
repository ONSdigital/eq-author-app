const deepMap = require("deep-map");
const { v4: uuidv4 } = require("uuid");

const collator = new Intl.Collator("en", { numeric: true });

// Transforms questionnaire into a hash map, mapping IDs to absolute positions
// Thereafter allows O(1) lookup to check if IDs exist & get their positions
const generateOrderedIdMap = ({ questionnaire }) => {
  const map = new Map();

  const traverseIds = (obj) => {
    if (!obj || typeof obj !== "object") {
      return;
    }

    Object.keys(obj)
      .sort(collator.compare)
      .forEach((key) => traverseIds(obj[key]));

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
    const { questionnaireId, updatedAt, result } =
      getOrderedIdMap.lastInvokation;
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
const getAbsolutePositionById = (ctx, id) => getOrderedIdMap(ctx).get(id);

const remapAllNestedIds = (entity) => {
  const transformationMatrix = {};

  // Deep Map (https://github.com/mcmath/deep-map) seems to ignore the "custom"
  // key and not return. To avoid this, you can pass {inPlace: True} as a parameter
  // so that it mutates the object coming in, instead of returning a new object.

  const remappedIdEntity = deepMap(
    entity,
    (value, key) => {
      if (key === "id") {
        const newEntityId = uuidv4();
        transformationMatrix[value] = newEntityId;

        return newEntityId;
      }

      return value;
    },
    { inPlace: true }
  );

  return deepMap(
    remappedIdEntity,
    (value) => {
      if (Object.keys(transformationMatrix).includes(value)) {
        return transformationMatrix[value];
      }
      return value;
    },
    { inPlace: true }
  );
};

const getPosition = (position, comparator) =>
  typeof position === "number" ? position : comparator.length;

const getMovePosition = (section, pageId, position) => {
  if (!section.folders) {
    throw new Error("Section doesn't have a folder");
  }

  let pointer = 0;
  let positionMap = {};

  for (let i = 0; i < section.folders.length; i++) {
    for (let j = 0; j < section.folders[i].pages.length; j++) {
      const page = section.folders[i].pages[j];
      if (page.id === pageId) {
        positionMap.previous = {
          folderIndex: i,
          pageIndex: j,
          page,
        };
      }
      if (pointer === position) {
        positionMap.next = { folderIndex: i };
      }
      pointer++;
    }
  }

  const { previous, next } = positionMap;
  return { previous, next };
};

const stripQCodes = (entity) =>
  deepMap(
    entity,
    (value, key) => (["qCode", "secondaryQCode"].includes(key) ? null : value),
    { inPlace: true }
  );

module.exports = {
  idExists,
  getAbsolutePositionById,
  generateOrderedIdMap,
  getOrderedIdMap,
  remapAllNestedIds,
  getPosition,
  getMovePosition,
  stripQCodes,
};
