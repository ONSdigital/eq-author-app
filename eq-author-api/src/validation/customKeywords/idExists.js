const { idExists } = require("../../../schema/resolvers/utils");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "idExists",
    $data: true,
    validate: (id, _data, _parentSchema, { rootData: questionnaire }) =>
      idExists({ questionnaire }, id),
  });
