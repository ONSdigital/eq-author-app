const jsondiffpatch = require("jsondiffpatch");
const { omit, pick, set } = require("lodash");
const logger = require("pino")();

const {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
  dynamoose,
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
      updatedAt: new Date(),
    })
  );

  await saveModel(
    new QuestionnaireModel(
      set(pick(questionnaire, "id"), "latestVersion", result.updatedAt)
    )
  );

  return result;
};

const getQuestionnaireFromList = id => QuestionnaireModel.get({ id });

const getQuestionnaireByIdAndVersion = (id, version) =>
  QuestionnaireVersionsModel.get({
    id,
    updatedAt: version,
  });

const getQuestionnaire = async id => {
  const info = await getQuestionnaireFromList(id);
  if (!info) {
    return null;
  }
  const questionnaire = await getQuestionnaireByIdAndVersion(
    info.id,
    info.latestVersion
  );
  return questionnaire;
};

const MAX_UPDATE_TIMES = 3;
const saveQuestionnaire = async (versionModel, count = 0, patch) => {
  if (count === MAX_UPDATE_TIMES) {
    throw new Error(`Failed after trying to update ${MAX_UPDATE_TIMES} times`);
  }
  const originalQuestionnaireVersion = {
    metadata: [],
    sections: [],
    ...versionModel.originalItem(),
  };

  const diff = diffPatcher.diff(
    omitTimestamps(originalQuestionnaireVersion),
    omitTimestamps(versionModel)
  );

  if (!diff) {
    return versionModel;
  }

  try {
    const originalLatestVersion = originalQuestionnaireVersion.updatedAt;

    const newVersion = new Date();

    await dynamoose.transaction([
      QuestionnaireVersionsModel.transaction.create({
        ...versionModel,
        updatedAt: newVersion,
      }),
      QuestionnaireModel.transaction.update(
        {
          id: versionModel.id,
        },
        { latestVersion: newVersion },
        {
          updateTimestamps: false,
          condition: "latestVersion = :latestVersion",
          conditionValues: {
            latestVersion: originalLatestVersion,
          },
        }
      ),
    ]);
  } catch (e) {
    if (!e.code || e.code !== "TransactionCanceledException") {
      throw e;
    }

    const patchToApply = patch || diff;
    logger.warn(
      `Dynamoose merging on save id: ${versionModel.id}`,
      patchToApply
    );

    const dbQuestionnaire = await getQuestionnaire(versionModel.id);
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

const listQuestionnaireInfo = () => {
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

const listQuestionnaires = async () => {
  const questionnaireInfo = await listQuestionnaireInfo();
  return Promise.all(
    questionnaireInfo.map(({ id, latestVersion }) =>
      getQuestionnaireByIdAndVersion(id, latestVersion)
    )
  );
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
};
