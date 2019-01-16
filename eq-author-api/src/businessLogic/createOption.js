const uuid = require("uuid");

module.exports = () => ({
  id: uuid.v4(),
  label: "",
  description: "",
  value: "",
  qCode: ""
});
