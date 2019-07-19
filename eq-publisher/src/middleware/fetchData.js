const { get } = require("lodash");

const setQuestionnaire = async (res, questionnaire) => {
  res.locals.questionnaire = questionnaire;
};

const fetchData = getQuestionnaire => async (req, res, next) => {
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

  await setQuestionnaire(res, questionnaire);
  return next();
};

module.exports = fetchData;
