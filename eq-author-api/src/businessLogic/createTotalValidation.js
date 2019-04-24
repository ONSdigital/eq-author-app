const uuid = require("uuid").v4;

const { CUSTOM } = require("../../constants/validationEntityTypes");
const { EQUAL } = require("../../constants/validationConditions");

module.exports = (overrides = {}) => ({
  id: uuid(),
  enabled: false,
  entityType: CUSTOM,
  condition: EQUAL,
  previousAnswer: null,
  custom: null,
  ...overrides,
});
