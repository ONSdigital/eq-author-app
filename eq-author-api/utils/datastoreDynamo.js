const jsondiffpatch = require("jsondiffpatch");
const { omit } = require("lodash");
const logger = require("pino")();

const {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
} = require("../db/models/DynamoDB");

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

const MAX_UPDATE_TIMES = 3;
const saveQuestionnaire = async (questionnaire, count = 0, patch) => {
  if (count === MAX_UPDATE_TIMES) {
    throw new Error(`Failed after trying to update ${MAX_UPDATE_TIMES} times`);
  }
  const originalQuestionnaire = {
    metadata: [],
    sections: [],
    ...questionnaire.originalItem(),
  };

  //Makes diff accurate
  questionnaire.createdAt = questionnaire.createdAt.toISOString();
  questionnaire.updatedAt = questionnaire.updatedAt.toISOString();

  if (!diffPatcher.diff(originalQuestionnaire, questionnaire)) {
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

    const patchToApply =
      patch || diffPatcher.diff(originalQuestionnaire, questionnaire);
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
