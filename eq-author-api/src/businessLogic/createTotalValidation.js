const { v4: uuidv4 } = require("uuid");

const { CUSTOM } = require("../../constants/validationEntityTypes");
const { EQUAL } = require("../../constants/validationConditions");

module.exports = (overrides = {}) => ({
  id: uuidv4(),
  enabled: false,
  entityType: CUSTOM,
  condition: EQUAL,
  previousAnswer: null,
  custom: null,
  validateUnanswered: true,
  ...overrides,
});
