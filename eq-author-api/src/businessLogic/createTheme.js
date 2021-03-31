const { v4: uuidv4 } = require("uuid");

const createTheme = (attrs = {}) => ({
  id: uuidv4(),
  enabled: true,
  shortName: "default",
  legalBasisCode: "NOTICE_1",
  eqId: "",
  formType: "",
  ...attrs,
});

module.exports = createTheme;
