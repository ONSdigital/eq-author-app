const createTheme = (attrs = {}) => ({
  enabled: true,
  shortName: "business",
  legalBasisCode: "NOTICE_1",
  eqId: "",
  formType: "",
  ...attrs,
  id: attrs.shortName || "default",
});

module.exports = createTheme;
