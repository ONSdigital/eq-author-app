const {
  getAbsolutePositionById,
} = require("../../../schema/resolvers/utils/helpers");

module.exports = function (ajv) {
  ajv.addKeyword("idPreceedsCurrentEntity", {
    $data: true,
    validate: (
      theirId,
      currentSchema,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) => {
      const ourId = currentSchema.id || parentData.id;
      const ourPosition = getAbsolutePositionById({ questionnaire }, ourId);
      const theirPosition = getAbsolutePositionById({ questionnaire }, theirId);

      // This keyword passes if target ID doesn't exist in order to simplify existing AJV schema
      // To check if an ID exists, use the "idExists" custom keyword
      return theirPosition ? theirPosition < ourPosition : true;
    },
  });
};
