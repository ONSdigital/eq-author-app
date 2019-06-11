/* eslint-disable camelcase */
const uuid = require("uuid");

module.exports = () => ({
  id: uuid.v4(),
  externalId: uuid.v4(),
  name: uuid.v4(),
  email: "eq-team@ons.gov.uk",
  picture: "file:///path/to/some/picture.jpg",
});
