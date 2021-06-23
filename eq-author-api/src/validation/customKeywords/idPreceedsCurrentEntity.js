const { getAbsolutePositionById } = require("../../../schema/resolvers/utils");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "idPreceedsCurrentEntity",
    $data: true,
    validate: (
      theirId,
      currentEntity,
      _parentSchema,
      { parentData, rootData: questionnaire }
    ) => {
      const ourId = currentEntity?.id || parentData?.id;
      if (!ourId || !theirId) {
        return true;
      }

      const ourPosition = getAbsolutePositionById({ questionnaire }, ourId);
      const theirPosition = getAbsolutePositionById({ questionnaire }, theirId);

      // This keyword passes if target ID doesn't exist in order to simplify existing AJV schema
      // To check if an ID exists, use the "idExists" custom keyword
      return ourPosition !== undefined && theirPosition !== undefined
        ? theirPosition < ourPosition
        : true;
    },
  });
