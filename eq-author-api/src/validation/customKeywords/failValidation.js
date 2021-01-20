module.exports = function(ajv) {
  ajv.addKeyword("failValidation", {
    validate: () => false,
  });
};
