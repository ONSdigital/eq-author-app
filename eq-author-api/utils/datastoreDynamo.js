const jsondiffpatch = require("jsondiffpatch");
const { omit } = require("lodash");
const logger = require("pino")();

const {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
  dynamoose,
  justListFields,
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
  const updatedAt = new Date();
  await saveModel(
    new QuestionnaireModel({ ...justListFields(questionnaire), updatedAt })
  );
  return saveModel(
    new QuestionnaireVersionsModel({ ...questionnaire, updatedAt })
  );
};

const getQuestionnaire = id =>
  new Promise((resolve, reject) => {
    QuestionnaireVersionsModel.queryOne({ id: { eq: id } })
      .descending()
      .consistent()
      .exec((err, questionnaire) => {
        if (err) {
          reject(err);
          return;
        }

        if (!questionnaire) {
          resolve(undefined);
          return;
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

const MAX_UPDATE_TIMES = 3;
const saveQuestionnaire = async (questionnaireModel, count = 0, patch) => {
  if (count === MAX_UPDATE_TIMES) {
    throw new Error(`Failed after trying to update ${MAX_UPDATE_TIMES} times`);
  }
  const originalQuesitonnaire = {
    metadata: [],
    sections: [],
    ...questionnaireModel.originalItem(),
  };

  const diff = diffPatcher.diff(
    omitTimestamps(originalQuesitonnaire),
    omitTimestamps(questionnaireModel)
  );
  if (!diff) {
    return questionnaireModel;
  }

  try {
    const originalUpdatedAt = originalQuesitonnaire.updatedAt;

    const newUpdatedAt = new Date();
    questionnaireModel.updatedAt = newUpdatedAt;

    await dynamoose.transaction([
      QuestionnaireVersionsModel.transaction.create({
        ...questionnaireModel,
        updatedAt: newUpdatedAt,
      }),
      QuestionnaireModel.transaction.update(
        {
          id: questionnaireModel.id,
        },
        justListFields(questionnaireModel),
        {
          updateTimestamps: false,
          condition: "updatedAt = :updatedAt",
          conditionValues: {
            updatedAt: originalUpdatedAt,
          },
        }
      ),
    ]);
  } catch (e) {
    if (
      !e.code ||
      e.code !== "TransactionCanceledException" ||
      !e.message.endsWith("[None, ConditionalCheckFailed]")
    ) {
      throw e;
    }

    const patchToApply = patch || diff;
    logger.warn(
      `Dynamoose merging on save id: ${questionnaireModel.id}`,
      patchToApply
    );

    const latestQuestionnaire = await getQuestionnaire(questionnaireModel.id);

    // We are done if we match the latest questionnaire
    const diffToLatest = diffPatcher.diff(
      omitTimestamps(latestQuestionnaire),
      omitTimestamps(questionnaireModel)
    );
    if (!diffToLatest) {
      return;
    }

    diffPatcher.patch(latestQuestionnaire, patchToApply);
    await saveQuestionnaire(latestQuestionnaire, ++count, patchToApply);
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
        questionnaires.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
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
