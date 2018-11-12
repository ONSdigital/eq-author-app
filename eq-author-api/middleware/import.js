const buildQuestionnaire = require("../tests/utils/buildTestQuestionnaire");

module.exports = async (req, res) => {
  const data = (req.body.data || req.body).questionnaire || req.body;
  try {
    await buildQuestionnaire(data);
    res.json({
      status: "OK"
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.status(500);
    res.json({
      error: e
    });
  }
};
