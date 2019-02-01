const { generateToken } = require("../utils/jwtHelper");
const { assign, isNil, isEmpty } = require("lodash");
const { sanitiseMetadata } = require("../utils/sanitiseMetadata");
const loadQuestionnaire = require("../utils/loadQuestionnaire");

const buildClaims = metadata => {
  const result = {
    claims: {},
    errors: [],
  };

  metadata.map(({ key, value, id, type }) => {
    if (isNil(key) || key.trim() === "") {
      result.errors.push(id);
    }

    return assign(result.claims, {
      [key]:
        type === "Date" ? new Date(value).toISOString().split("T")[0] : value,
    });
  });

  return result;
};

module.exports.buildClaims = buildClaims;

module.exports.getLaunchUrl = async (req, res, next) => {
  const questionnaireId = req.params.questionnaireId;
  const questionnaire = JSON.parse(loadQuestionnaire(questionnaireId));
  const result = questionnaire.metadata;

  const { errors, claims: metadataValues } = buildClaims(result);

  if (!isEmpty(errors)) {
    next(
      new Error(
        `You have empty metadata keys, check your metadata and try again.`
      )
    );
  } else {
    const sanitisedMetadata = await sanitiseMetadata(
      metadataValues,
      questionnaireId
    );

    const jwt = await generateToken(sanitisedMetadata);

    res.redirect(`${process.env.RUNNER_SESSION_URL}${jwt}`);
  }
};
