const jsondiffpatch = require("jsondiffpatch");
const { omit } = require("lodash");
const logger = require("pino")();

const {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
} = require("../db/models/DynamoDB");

const omitTimestamps = questionnaire =>
  omit({ ...questionnaire }, ["updatedAt", "createdAt"]);

const diffPatcher = jsondiffpatch.create({
  objectHash: obj => obj.id,
});

const saveModel = (model, options = {}) =>
  new Promise((resolve, reject) => {
    model.save(options, err => {
      if (err) {
        reject(err);
      }
      resolve(model);
    });
  });

const createQuestionnaire = async questionnaire => {
  await saveModel(
    new QuestionnaireModel(omit(questionnaire, "sections", "metadata"))
  );
  const result = await saveModel(
    new QuestionnaireVersionsModel({
      ...questionnaire,
      updatedAt: Date.now(),
    })
  );
  return result;
};

const getQuestionnaire = id => {
  return new Promise((resolve, reject) => {
    QuestionnaireVersionsModel.queryOne({ id: { eq: id } })
      .descending()
      .consistent()
      .exec((err, questionnaire) => {
        if (err) {
          reject(err);
        }

        if (!questionnaire.sections) {
          questionnaire.sections = [];
        }

        if (!questionnaire.metadata) {
          questionnaire.metadata = [];
        }
        resolve(questionnaire);
      });
  });
};

const MAX_UPDATE_TIMES = 3;
const saveQuestionnaire = async (questionnaire, count = 0) => {
  if (count === MAX_UPDATE_TIMES) {
    throw new Error(`Failed after trying to update ${MAX_UPDATE_TIMES} times`);
  }
  const originalQuestionnaire = {
    metadata: [],
    sections: [],
    ...questionnaire.originalItem(),
  };

  const latestVersion = await getQuestionnaire(questionnaire.id);

  const questionnaireToDiffAgainst =
    latestVersion.updatedAt > questionnaire.originalItem().updatedAt
      ? latestVersion
      : originalQuestionnaire;

  const diff = diffPatcher.diff(
    omitTimestamps(questionnaireToDiffAgainst),
    omitTimestamps(questionnaire)
  );

  if (!diff) {
    return questionnaire;
  }

  try {
    await saveModel(questionnaire, {
      updateTimestamps: true,
    });
  } catch (e) {
    if (!e.code || e.code !== "ConditionalCheckFailedException") {
      throw e;
    }

    logger.warn(`Dynamoose merging on save id: ${questionnaire.id}`, diff);

    const latestVersion = await getQuestionnaire(questionnaire.id);
    diffPatcher.patch(latestVersion, diff);
    await saveQuestionnaire(latestVersion, ++count);
  }
};

const deleteQuestionnaire = id => {
  return new Promise((resolve, reject) => {
    QuestionnaireModel.delete({ id: id }, function(err) {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const listQuestionnaires = () => {
  return new Promise((resolve, reject) => {
    QuestionnaireModel.scan()
      .all()
      .exec((err, questionnaires) => {
        if (err) {
          reject(err);
        }
        resolve(questionnaires);
      });
  });
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
};
