const { idExists } = require("../../../schema/resolvers/utils");

module.exports = function (ajv) {
  ajv.addKeyword("idExists", {
    $data: true,
    validate: (
      id,
      entityData,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) => idExists({ questionnaire }, id),
  });
};
