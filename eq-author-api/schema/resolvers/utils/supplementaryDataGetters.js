const { find, some } = require("lodash");

const getSupplementaryDataLists = (ctx) => {
  return ctx.questionnaire?.supplementaryData?.data;
};

const getSupplementaryDataListById = (ctx, id) =>
  find(getSupplementaryDataLists(ctx), { id });

const convertSupplementaryDataToCollectionList = (list) => {
  const fields = list?.schemaFields?.map((field) => {
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

const getSupplementaryDataAsCollectionListById = (ctx, id) => {
  const list = getSupplementaryDataListById(ctx, id);
  if (list) {
    return convertSupplementaryDataToCollectionList(list);
  }
};

const getSupplementaryDataAsCollectionListbyFieldId = (ctx, id) => {
  const supplementaryDataList = find(
    getSupplementaryDataLists(ctx),
    ({ schemaFields }) => schemaFields && some(schemaFields, { id })
  );
  if (!supplementaryDataList) {
    return;
  }
  return convertSupplementaryDataToCollectionList(supplementaryDataList);
};

module.exports = {
  getSupplementaryDataLists,
  getSupplementaryDataListById,
  getSupplementaryDataAsCollectionListById,
  getSupplementaryDataAsCollectionListbyFieldId,
};
