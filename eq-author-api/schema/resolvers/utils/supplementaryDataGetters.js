const { find } = require("lodash");

const getSupplementaryDataLists = (ctx) => {
  return ctx.questionnaire?.supplementaryData?.data;
};

const getSupplementaryDataListById = (ctx, id) =>
  find(getSupplementaryDataLists(ctx), { id });

const getSupplementaryDataAsCollectionListById = (ctx, id) => {
  const list = getSupplementaryDataListById(ctx, id);
  if (!list) {
    return;
  }
  const fields = list.schemaFields.map((field) => {
    return {
      ...field,
      label: field.selector
        ? field.identifier + " - " + field.selector
        : field.identifier,
    };
  });
  return {
    ...list,
    answers: fields,
  };
};

module.exports = {
  getSupplementaryDataLists,
  getSupplementaryDataListById,
  getSupplementaryDataAsCollectionListById,
};
