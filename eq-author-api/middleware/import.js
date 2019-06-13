const uuid = require("uuid");
const { createQuestionnaire } = require("../utils/datastore");

module.exports = async (req, res) => {
  const input = req.body;
  input.id = uuid.v4();
  input.createdAt = new Date();
  input.editors = [];
  const savedQuestionnaire = await createQuestionnaire(input);
  res.json({
    id: savedQuestionnaire.id,
  });
};
