const createTheme = (attrs = {}) => ({
  enabled: true,
  shortName: "default",
  legalBasisCode: "NOTICE_1",
  eqId: "",
  formType: "",
  ...attrs,
  id: attrs.shortName || "default",
});

module.exports = createTheme;
