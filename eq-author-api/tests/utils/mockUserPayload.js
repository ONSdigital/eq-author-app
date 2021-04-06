/* eslint-disable camelcase */
const { v4: uuidv4 } = require("uuid");

module.exports = () => ({
  id: uuidv4(),
  externalId: uuidv4(),
  name: uuidv4(),
  email: "eq-team@ons.gov.uk",
  picture: "file:///path/to/some/picture.jpg",
  starredQuestionnaires: [],
});
