const { get, set } = require("lodash");

const fetchData = (getQuestionnaire) => async (req, res, next) => {
  let result;

  try {
    result = await getQuestionnaire(
      req.params.questionnaireId,
      res.locals.accessToken
    );
  } catch (err) {
    return next(err);
  }

  const questionnaire = get(result, "data.questionnaire");

  if (!questionnaire) {
    return res.status(404).send({
      params: req.params,
      error: result.errors,
    });
  }

  set(res, "locals.questionnaire", questionnaire);
  return next();
};

module.exports = fetchData;
