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
  objecHash: obj => obj.id,
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

const MAX_UPDATE_TIMES = 2;
const saveQuestionnaire = async (questionnaire, count = 0, patch) => {
  logger.info(
    // eslint-disable-next-line
    `${count} = ${__stack.map(s => s.getFunctionName() || "unknown").join("|")}`
  );
  if (count === MAX_UPDATE_TIMES) {
    throw new Error(`Failed after trying to update ${MAX_UPDATE_TIMES} times`);
  }
  const originalQuestionnaire = {
    metadata: [],
    sections: [],
    ...questionnaire.originalItem(),
  };

  const diff = diffPatcher.diff(
    omitTimestamps(originalQuestionnaire),
    omitTimestamps(questionnaire)
  );

  if (!diff) {
    return questionnaire;
  }

  const newUpdatedAt = new Date();
  const oldUpdatedAt = new Date(originalQuestionnaire.updatedAt).getTime();
  questionnaire.updatedAt = newUpdatedAt;
  try {
    await saveModel(questionnaire, {
      updateTimestamps: false,
      condition: "updatedAt = :updatedAt",
      conditionValues: {
        updatedAt: oldUpdatedAt,
      },
    });
  } catch (e) {
    if (!e.code || e.code !== "ConditionalCheckFailedException") {
      throw e;
    }

    const patchToApply = patch || diff;
    logger.warn(
      `Dynamoose merging on save id: ${questionnaire.id}`,
      patchToApply
    );

    const dbQuestionnaire = await getQuestionnaire(questionnaire.id);
    diffPatcher.patch(dbQuestionnaire, patchToApply);
    await saveQuestionnaire(dbQuestionnaire, ++count, patchToApply);
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
