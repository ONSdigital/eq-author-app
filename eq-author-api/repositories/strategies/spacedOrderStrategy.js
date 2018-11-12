const {
  isEmpty,
  flow,
  last,
  clamp,
  getOr,
  isNil,
  reject
} = require("lodash/fp");

const SPACING = 1000;

const calculateMidPoint = (a, b) => Math.round((a + b) / 2);

const valuesHaveConverged = (orderBefore, orderAfter) =>
  Math.abs(orderAfter - orderBefore) < 2;

const getMaxOrder = flow(
  last,
  getOr(0, "order")
);

const getPagesBySection = (trx, sectionId) =>
  trx("PagesView")
    .columns("id", "order")
    .where({ sectionId })
    .orderBy("order");

const getSectionsByQuestionnaire = (trx, questionnaireId) =>
  trx("SectionsView")
    .columns("id", "order")
    .where({ questionnaireId })
    .orderBy("order");

const makeSpaceForInsert = (trx, tableName, parentId, order) => {
  const key = tableName === "Sections" ? "questionnaireId" : "sectionId";
  return trx(tableName)
    .where({ [key]: parentId })
    .andWhere("order", ">", order)
    .increment("order", SPACING);
};

const getOrUpdateOrderForInsert = async (
  trx,
  collection,
  type,
  parentId,
  position
) => {
  const maxOrder = getMaxOrder(collection) + SPACING;

  position = isNil(position)
    ? collection.length
    : clamp(0, collection.length, position);

  if (isEmpty(collection)) {
    return SPACING;
  }
  if (position === collection.length) {
    return maxOrder;
  }

  collection.splice(position, 0, { id: "dummyElement" });

  let left = getOr(0, "order", collection[position - 1]);
  let right = getOr(maxOrder, "order", collection[position + 1]);

  if (valuesHaveConverged(left, right)) {
    await makeSpaceForInsert(trx, type, parentId, left);
    right += SPACING;
  }

  return calculateMidPoint(left, right);
};

const getOrUpdateOrderForPageInsert = async (
  trx,
  sectionId,
  movingPageId,
  position
) => {
  const pages = reject(
    { id: parseInt(movingPageId, 10) },
    await getPagesBySection(trx, sectionId)
  );

  return getOrUpdateOrderForInsert(trx, pages, "Pages", sectionId, position);
};

const getOrUpdateOrderForSectionInsert = async (
  trx,
  questionnaireId,
  id,
  position
) => {
  const sections = reject(
    { id: parseInt(id, 10) },
    await getSectionsByQuestionnaire(trx, questionnaireId)
  );

  return getOrUpdateOrderForInsert(
    trx,
    sections,
    "Sections",
    questionnaireId,
    position
  );
};

module.exports = {
  getOrUpdateOrderForPageInsert,
  getOrUpdateOrderForSectionInsert
};
