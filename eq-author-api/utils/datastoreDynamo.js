const jsondiffpatch = require("jsondiffpatch");
const { omit, set } = require("lodash");
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
  const result = await saveModel(
    new QuestionnaireVersionsModel({
      ...questionnaire,
    })
  );

  await saveModel(
    new QuestionnaireModel(
      set(
        omit(questionnaire, "sections", "metadata"),
        "latestVersion",
        result.updatedAt
      )
    )
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

const getLatestVersion = id => {
  return new Promise((resolve, reject) => {
    QuestionnaireModel.queryOne({ id: { eq: id } })
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

const MAX_UPDATE_TIMES = 3;
const saveQuestionnaire = async (
  questionnaireVersionModel,
  count = 0,
  patch
) => {
  if (count === MAX_UPDATE_TIMES) {
    throw new Error(`Failed after trying to update ${MAX_UPDATE_TIMES} times`);
  }
  const originalQuestionnaireVersion = {
    metadata: [],
    sections: [],
    ...questionnaireVersionModel.originalItem(),
  };

  const diff = diffPatcher.diff(
    omitTimestamps(originalQuestionnaireVersion),
    omitTimestamps(questionnaireVersionModel)
  );

  if (!diff) {
    return questionnaireVersionModel;
  }

  try {
    const questionnaireModel = await getLatestVersion(
      questionnaireVersionModel.id
    );

    // Save new version
    const result = await saveModel(questionnaireVersionModel, {
      updateTimestamps: true,
    });

    // Update latestVersion
    const originalLatestVersion = questionnaireModel.latestVersion;
    await saveModel(
      set(questionnaireModel, "latestVersion", result.updatedAt),
      {
        updateTimestamps: true,
        condition: "latestVersion = :latestVersion",
        conditionValues: {
          latestVersion: originalLatestVersion,
        },
      }
    );
  } catch (e) {
    if (!e.code || e.code !== "ConditionalCheckFailedException") {
      throw e;
    }

    const patchToApply = patch || diff;
    logger.warn(
      `Dynamoose merging on save id: ${questionnaireVersionModel.id}`,
      patchToApply
    );

    const dbQuestionnaire = await getQuestionnaire(
      questionnaireVersionModel.id
    );
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
