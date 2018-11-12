const { omit, head, get, isNil, isFunction } = require("lodash");
const {
  getOrUpdateOrderForPageInsert,
  getOrUpdateOrderForSectionInsert
} = require("../spacedOrderStrategy");

const insertData = async (
  trx,
  tableName,
  data,
  callback,
  returning = "*",
  position
) => {
  const returnedData = await trx
    .table(tableName)
    .insert(data)
    .returning(returning)
    .then(callback);

  if (returnedData.order) {
    let updateOrder = getOrUpdateOrderForPageInsert;
    let parentId = returnedData.sectionId;
    if (tableName === "Sections") {
      updateOrder = getOrUpdateOrderForSectionInsert;
      parentId = returnedData.questionnaireId;
    }
    const order = await updateOrder(trx, parentId, returnedData.id, position);

    await trx
      .table(tableName)
      .update({ order })
      .where({ id: returnedData.id });
  }

  return returnedData;
};

const selectData = (trx, tableName, columns, where, orderBy) => {
  const queryP = trx
    .select(columns)
    .from(tableName)
    .where(where);
  if (orderBy) {
    const { column, direction } = orderBy;
    queryP.orderBy(column, direction);
  }
  return queryP;
};

const duplicateRecord = async (
  trx,
  tableName,
  record,
  overrides = {},
  position
) => {
  const duplicatedRecord = omit(record, "id", "createdAt", "updatedAt");
  const { parentRelation, ...other } = overrides;

  if (!isNil(parentRelation)) {
    duplicatedRecord[get(parentRelation, "columnName")] = get(
      parentRelation,
      "id"
    );
  }

  const newRecord = { ...duplicatedRecord, ...other };

  return insertData(trx, tableName, newRecord, head, "*", position);
};

const FIELDS_TO_NEVER_DUPLICATE = ["id", "createdAt", "updatedAt"];

const duplicateTree = async (trx, tree, references) => {
  if (tree.length === 0) {
    return;
  }

  const [entityTypeToDuplicate, ...restOfTree] = tree;

  if (Array.isArray(entityTypeToDuplicate)) {
    await Promise.all(
      entityTypeToDuplicate.map(type => duplicateTree(trx, [type], references))
    );
    return duplicateTree(trx, restOfTree, references);
  }

  const {
    name,
    links,
    table,
    where,
    noIsDeleted,
    transform
  } = entityTypeToDuplicate;

  const selectQuery = trx
    .select("*")
    .from(table)
    .where(builder => {
      const parentLinks = links.filter(l => l.parent);
      parentLinks.forEach(({ column, entityName }) => {
        const ids = Object.keys(references[entityName] || {});
        builder.orWhereIn(column, ids);
      });

      if (where) {
        builder.andWhereRaw(where);
      }
      if (!noIsDeleted) {
        builder.andWhere({ isDeleted: false });
      }
    })
    .orderBy("id");

  const originalEntities = await selectQuery;

  if (originalEntities.length === 0) {
    return duplicateTree(trx, restOfTree, references);
  }

  const transformReferences = entity =>
    links.reduce(
      (e, { column, entityName }) => ({
        ...e,
        [column]: (references[entityName] || {})[e[column]] || e[column]
      }),
      omit(entity, FIELDS_TO_NEVER_DUPLICATE)
    );

  const transformedEntities = originalEntities.map(transformReferences);

  const transformed = isFunction(transform)
    ? transformedEntities.map(transform)
    : transformedEntities;

  const newEntities = await trx
    .insert(transformed)
    .into(table)
    .returning("id");

  references[name] = references[name] || {};

  newEntities.forEach((newId, index) => {
    const original = originalEntities[index];
    references[name][original.id] = newId;
  });

  return duplicateTree(trx, restOfTree, references);
};

module.exports = {
  insertData,
  selectData,
  duplicateRecord,
  duplicateTree
};
