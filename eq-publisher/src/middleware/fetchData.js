const { get } = require("lodash");

const fetchData = API => async (req, res, next) => {
  let result;

  try {
    result = await API.getAuthorData(req.params.questionnaireId);
  } catch (err) {
    return next(err);
  }

  const questionnaire = get(result, "data.questionnaire");

  if (!questionnaire) {
    return res.status(404).send({
      params: req.params,
      error: result.errors
    });
  }

  res.locals.questionnaire = questionnaire;
  return next();
};

module.exports = fetchData;
