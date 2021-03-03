const jsondiffpatch = require("jsondiffpatch");
const { omit, first, isNil } = require("lodash");
const { logger } = require("../../utils/logger");
const { v4: uuidv4 } = require("uuid");
const {
  QuestionnaireModel,
  QuestionnaireVersionsModel,
  dynamoose,
  justListFields,
  UserModel,
  CommentsModel,
} = require("../models/DynamoDB");

const {
  questionnaireCreationEvent,
} = require("../../utils/questionnaireEvents");

const omitTimestamps = (questionnaire) =>
  omit({ ...questionnaire }, ["updatedAt", "createdAt"]);

const diffPatcher = jsondiffpatch.create({
  objectHash: (obj) => obj.id,
});

const saveModel = (model, options = {}) =>
  new Promise((resolve, reject) => {
    model.save(options, (err) => {
      if (err) {
        reject(err);
      }
      resolve(model);
    });
  });

const saveMetadata = (metadata) => {
  return saveModel(new QuestionnaireModel(metadata));
};

const createUser = (user) => {
  const { id, email, name, externalId, picture } = user;
  return saveModel(
    new UserModel({
      id: id || uuidv4(),
      email,
      name,
      externalId,
      picture,
    })
  );
};

const createComments = (questionnaireId) => {
  return saveModel(
    new CommentsModel({
      questionnaireId,
      comments: {},
    })
  );
};

const saveComments = (comments) => saveModel(comments);
const updateUser = (user) => saveModel(user);

const getUserByExternalId = (externalId) =>
  new Promise((resolve, reject) => {
    UserModel.scan({ externalId: { eq: externalId } }).exec((err, user) => {
      if (err) {
        reject(err);
      }
      resolve(first(user));
    });
  });

const getUserById = (id) =>
  new Promise((resolve, reject) => {
    UserModel.queryOne({ id: { eq: id } }).exec((err, user) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  });

const listUsers = () =>
  new Promise((resolve, reject) => {
    UserModel.scan()
      .all()
      .exec((err, users) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(users);
      });
  });

const getCommentsForQuestionnaire = (questionnaireId) =>
  new Promise((resolve, reject) => {
    CommentsModel.scan({ questionnaireId: { eq: questionnaireId } }).exec(
      (err, comments) => {
        if (err) {
          reject(err);
        }

        const comment = first(comments);
        if (!isNil(comment)) {
          resolve(comment);
        } else {
          resolve(createComments(questionnaireId));
        }
      }
    );
  });

const createQuestionnaire = async (questionnaire, ctx) => {
  const updatedAt = new Date();
  await saveModel(
    new QuestionnaireModel({
      ...justListFields(questionnaire),
      history: [questionnaireCreationEvent(questionnaire, ctx)],
      updatedAt,
    })
  );
  return saveModel(
    new QuestionnaireVersionsModel({
      ...questionnaire,
      updatedAt,
    })
  );
};

const createHistoryEvent = (questionnaireId, historyEvent) =>
  new Promise((resolve, reject) => {
    QuestionnaireModel.queryOne({ id: { eq: questionnaireId } }).exec(
      async (err, questionnaire) => {
        if (err) {
          reject(err);
        }
        questionnaire.history.unshift(historyEvent);

        await saveModel(new QuestionnaireModel(questionnaire));
        resolve(questionnaire.history);
      }
    );
  });

const getQuestionnaireMetaById = (id) =>
  new Promise((resolve, reject) => {
    QuestionnaireModel.queryOne({ id: { eq: id } }).exec(
      async (err, questionnaire) => {
        if (err) {
          reject(err);
        }

        resolve(questionnaire);
      }
    );
  });

const getQuestionnaire = (id) =>
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

        if (!questionnaire.editors) {
          questionnaire.editors = [];
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

const deleteQuestionnaire = (id) => {
  return new Promise((resolve, reject) => {
    QuestionnaireModel.delete({ id: id }, function (err) {
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

        const transformedQuestionnaires = questionnaires
          .map((q) => ({ ...q, editors: q.editors || [] }))
          .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
        resolve(transformedQuestionnaires);
      });
  });
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
  getUserById,
  getUserByExternalId,
  createUser,
  updateUser,
  listUsers,
  createHistoryEvent,
  getQuestionnaireMetaById,
  getCommentsForQuestionnaire,
  saveComments,
  createComments,
  saveMetadata,
  UserModel,
};
