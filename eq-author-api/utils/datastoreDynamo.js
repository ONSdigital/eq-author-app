const jsondiffpatch = require("jsondiffpatch");
const { omit, isEqual } = require("lodash");
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
      resolve();
    });
  });

const createQuestionnaire = async questionnaire => {
  await saveModel(
    new QuestionnaireModel(omit(questionnaire, "sections", "metadata"))
  );
  await saveModel(
    new QuestionnaireVersionsModel({
      ...questionnaire,
      updatedAt: Date.now(),
    })
  );

  return questionnaire;
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
        resolve(questionnaire);
      });
  });
};

const MAX_UPDATE_TIMES = 2;
const saveQuestionnaire = async (questionnaire, count = 0) => {
  if (count === MAX_UPDATE_TIMES) {
    throw new Error(`Failed after trying to update ${MAX_UPDATE_TIMES} times`);
  }
  const originalQuestionnaire = {
    metadata: [],
    sections: [],
    ...questionnaire.originalItem(),
  };
  let equal = isEqual(originalQuestionnaire, questionnaire);
  if (equal) {
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

    const patch = diffPatcher.diff(originalQuestionnaire, questionnaire);
    logger.warn(`Dynamoose merging on save id: ${questionnaire.id}`, patch);
    const dbQuestionnaire = await getQuestionnaire(questionnaire.id);
    diffPatcher.patch(dbQuestionnaire, patch);
    await saveQuestionnaire(dbQuestionnaire, ++count);
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
