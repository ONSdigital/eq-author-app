const { getAbsolutePositionById } = require("../../../schema/resolvers/utils");

module.exports = function(ajv) {
  ajv.addKeyword("idPreceedsCurrentEntity", {
    $data: true,
    validate: (
      theirId,
      { id: ourId },
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) => {
      const ourPosition = getAbsolutePositionById({ questionnaire }, ourId);
      const theirPosition = getAbsolutePositionById({ questionnaire }, theirId);

      return theirPosition < ourPosition;
    },
  });
};
