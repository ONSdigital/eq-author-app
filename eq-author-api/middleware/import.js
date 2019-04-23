const uuid = require("uuid");
const { createQuestionnaire } = require("../utils/datastore");

module.exports = async (req, res) => {
  console.log(req.body);
  const input = req.body;
  input.id = uuid.v4();
  input.createdAt = new Date();
  const savedQuestionnaire = await createQuestionnaire(input);
  res.json({
    id: savedQuestionnaire.id,
  });
};
