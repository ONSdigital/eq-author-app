module.exports = function(ajv) {
  ajv.addKeyword("uniquePropertyValueInArrayOfObjects", {
    validate: function uniqueLabelFn(
      propertyName,
      entityData,
      currentDataPath,
      parentDataPath,
      parentData
    ) {
      uniqueLabelFn.errors = [];

      const entityValue = entityData[propertyName];
      if (typeof entityValue === "undefined") {
        return true;
      }

      const entitiesWithSameValue = parentData.filter(
        d => d[propertyName] === entityValue
      );

      if (entitiesWithSameValue.length <= 1) {
        return true;
      }

      const err = {
        keyword: "errorMessage",
        dataPath: `${parentDataPath}/${propertyName}`,
        message: "ERR_UNIQUE_REQUIRED",
        params: {
          keyword: "uniqueLabel",
        },
      };

      uniqueLabelFn.errors.push(err);

      return false;
    },
    $data: true,
    errors: true,
  });

  return ajv;
};
