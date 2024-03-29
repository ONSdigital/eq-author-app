const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const { removeEmpty } = require("../../utils/removeEmpty");
const { pick } = require("lodash/fp");
const { baseQuestionnaireFields } = require("../baseQuestionnaireSchema");
const { logger } = require("../../utils/logger");
const {
  questionnaireCreationEvent,
  historyCreationForImport,
} = require("../../utils/questionnaireEvents");

let dbo, connection;

const createIndexes = async () => {
  let collection = dbo.collection("questionnaires");
  let result = await collection.createIndex({ id: 1 });
  logger.info(`Questionnaire Index created: ${result}`);

  collection = dbo.collection("versions");
  result = await collection.createIndex({ id: 1, updatedAt: -1 });
  logger.info(`versions Index created: ${result}`);

  collection = dbo.collection("comments");
  result = await collection.createIndex({ questionnaireId: 1 });
  logger.info(`comments Index created: ${result}`);

  collection = dbo.collection("users");
  result = await collection.createIndex({ id: 1 });
  logger.info(`Users id Index created: ${result}`);

  collection = dbo.collection("users");
  result = await collection.createIndex({ externalId: 1 });
  logger.info(`Users externalId Index created: ${result}`);
};

const connectDB = async (overrideUrl = "") => {
  try {
    const url = overrideUrl || process.env.MONGO_URL;
    connection = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    dbo = await connection.db();
    logger.info("Database connected");
    createIndexes();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

const BASE_FIELDS = [
  ...Object.keys(baseQuestionnaireFields),
  "updatedAt",
  "history",
];

const justListFields = pick(BASE_FIELDS);

const createQuestionnaire = async (questionnaire, ctx, imported) => {
  const updatedAt = new Date();
  const createdAt = updatedAt;

  if (!questionnaire.id) {
    questionnaire.id = uuidv4();
  }
  if (!questionnaire.createdAt) {
    questionnaire.createdAt = createdAt;
  }

  let { id } = questionnaire;

  delete questionnaire._id;

  const historyArray = imported
    ? [historyCreationForImport(questionnaire, ctx)]
    : [questionnaireCreationEvent(questionnaire, ctx)];

  const baseQuestionnaire = removeEmpty({
    ...justListFields(questionnaire),
    history: historyArray,
    updatedAt,
  });

  const versionQuestionnaire = removeEmpty({
    ...questionnaire,
    updatedAt,
  });

  try {
    let collection = dbo.collection("questionnaires");
    await collection.insertOne(baseQuestionnaire);
    collection = dbo.collection("versions");
    await collection.insertOne(versionQuestionnaire);
  } catch (error) {
    logger.error(error, `Unable to create questionnaire with ID: ${id}`);
  }

  logger.info(`Created questionnaire with ID: ${id}`);

  return {
    ...questionnaire,
    updatedAt,
  };
};

const getQuestionnaire = async (id) => {
  try {
    const collection = dbo.collection("versions");
    const questionnaire = await collection.findOne(
      { id: id },
      { sort: { updatedAt: -1 } }
    );

    if (!questionnaire) {
      logger.info("No questionnaires found");
      return null;
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
    return questionnaire;
  } catch (error) {
    logger.error(
      error,
      `Unable to get latest version of questionnaire with ID: ${id}`
    );
    return;
  }
};

const getQuestionnaireMetaById = async (id) => {
  try {
    const collection = dbo.collection("questionnaires");
    const questionnaire = await collection.findOne({ id: id });

    if (!questionnaire) {
      logger.info("No base questionnaire found");
      return null;
    }

    return questionnaire;
  } catch (error) {
    logger.error(error, `Error getting base questionnaire with ID ${id}`);
    return;
  }
};

const saveQuestionnaire = async (changedQuestionnaire) => {
  const { id } = changedQuestionnaire;

  try {
    if (!id) {
      throw new Error(
        "Unable to save questionnaire; cannot find required field: ID"
      );
    }

    const updatedAt = new Date();

    const originalQuestionnaire = await getQuestionnaire(id);

    const updatedQuestionnaire = removeEmpty({
      ...originalQuestionnaire,
      ...changedQuestionnaire,
    });

    let collection = dbo.collection("questionnaires");
    await collection.updateOne(
      { id: id },
      { $set: { ...justListFields(updatedQuestionnaire), updatedAt } }
    );

    delete updatedQuestionnaire._id;
    collection = dbo.collection("versions");
    await collection.insertOne({
      ...updatedQuestionnaire,
      updatedAt,
    });

    return { ...updatedQuestionnaire, updatedAt };
  } catch (error) {
    logger.error(error, `Error updating questionnaire with ID ${id}`);
    return;
  }
};

const deleteQuestionnaire = async (id) => {
  try {
    const collection = dbo.collection("questionnaires");
    await collection.deleteOne({ id: id });
    return;
  } catch (error) {
    logger.error(error, `Unable to delete questionnaire with ID: ${id}`);
    return;
  }
};

const createUser = async (user) => {
  let { id, name, email } = user;
  const updatedAt = new Date();

  try {
    if (!email) {
      throw new Error("Cannot create new user without required field: email");
    }

    if (!id) {
      id = uuidv4();
    }

    if (!name) {
      name = email;
    }

    const collection = dbo.collection("users");
    await collection.insertOne({ ...user, id, name, email, updatedAt });
  } catch (error) {
    logger.error(error, `Error creating user with ID: ${id}: `);
    return;
  }

  return { ...user, id, name, updatedAt };
};

const getUserByExternalId = async (externalId) => {
  try {
    if (!externalId) {
      throw new Error("Cannot find user without required field 'externalId'");
    }

    const collection = dbo.collection("users");
    const user = await collection.findOne({ externalId: externalId });

    if (!user) {
      logger.info(`User with external ID ${externalId} not found`);
      return;
    }

    return { ...user, id: user.id };
  } catch (error) {
    logger.error(error, `Unable to find user with external ID ${externalId}`);
    return;
  }
};

const getUserById = async (id) => {
  try {
    const collection = dbo.collection("users");
    const user = await collection.findOne({ id: id });

    if (!user) {
      logger.info("No users found");
      return;
    }

    return { ...user, id: user.id };
  } catch (error) {
    logger.error(error, `Error getting user with ID: ${id}`);
    return;
  }
};

const listQuestionnaires = async () => {
  try {
    const collection = dbo.collection("questionnaires");
    const questionnaires = await collection.find().toArray();

    if (questionnaires.length === 0) {
      logger.info("No questionnaires found");
      return [];
    }

    const transformedQuestionnaires = questionnaires
      .map((q) => ({ ...q, editors: q.editors || [] }))
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    return transformedQuestionnaires;
  } catch (error) {
    logger.error(error, "Unable to retrieve questionnaires");
    return;
  }
};

const createComments = async (questionnaireId) => {
  try {
    if (!questionnaireId) {
      throw new Error(
        "Cannot create default comments without required paramater: questionnaireId"
      );
    }
    const defaultComments = { questionnaireId, comments: {} };
    const collection = dbo.collection("comments");
    await collection.insertOne(defaultComments);
    return defaultComments;
  } catch (error) {
    logger.error(
      error,
      `Unable to create comment structure for questionnaire with ID ${questionnaireId}`
    );
    return;
  }
};

const listUsers = async () => {
  try {
    const collection = dbo.collection("users");
    const users = await collection.find().toArray();
    if (users.length === 0) {
      logger.info("No users found");
      return [];
    }

    return users;
  } catch (error) {
    logger.error(error, `Unable to get a list of all users`);
    return;
  }
};

const saveMetadata = async (metadata) => {
  const { id } = metadata;

  if (!id) {
    throw new Error(
      "Cannot find required field ID within the given base questionnaire"
    );
  }

  try {
    const updatedMetadata = { ...metadata, updatedAt: new Date() };
    const collection = dbo.collection("questionnaires");
    await collection.updateOne({ id: id }, { $set: updatedMetadata });
    return updatedMetadata;
  } catch (error) {
    logger.error(error, `Cannot update base questionnaire with ID ${id}`);
    return;
  }
};

const createHistoryEvent = async (qid, event) => {
  try {
    if (!qid) {
      throw new Error(
        "Unable to create a history event without first parameter: qid"
      );
    }

    if (!event) {
      throw new Error(
        "Unable to create history event without second paramater: event"
      );
    }
    const questionnaire = await getQuestionnaireMetaById(qid);

    if (questionnaire?.history?.length) {
      questionnaire.history.unshift(event);
    } else {
      questionnaire.history = [];
      questionnaire.history.unshift(event);
    }

    const collection = dbo.collection("questionnaires");
    await collection.updateOne(
      { id: qid },
      { $set: { history: questionnaire.history } }
    );

    return questionnaire.history;
  } catch (error) {
    logger.error(
      error,
      `Error creating history event in questionnaire with ID ${qid}`
    );
    return;
  }
};

const updateUser = async (changedUser) => {
  const { id } = changedUser;
  try {
    if (!id) {
      throw new Error("Cannot update user without required field: id");
    }
    const collection = dbo.collection("users");
    const existingUser = await collection.findOne({ id: id });
    changedUser.updatedAt = new Date();
    const user = Object.assign(existingUser, changedUser);
    await collection.updateOne({ id: id }, { $set: user });
    return user;
  } catch (error) {
    logger.error(error, `Unable update user with ID ${id}`);
    return;
  }
};

const saveComments = async (updatedCommentsObject) => {
  const { questionnaireId, comments: updatedComments } = updatedCommentsObject;
  try {
    if (!questionnaireId) {
      throw new Error(
        "Unable to save comments without required field: questionnaireId"
      );
    }

    const collection = dbo.collection("comments");
    await collection.updateOne(
      { questionnaireId: questionnaireId },
      { $set: { comments: { ...updatedComments } } },
      { upsert: true }
    );

    return updatedComments;
  } catch (error) {
    logger.error(
      error,
      `Unable to save comments for questionnaire with ID ${questionnaireId}`
    );
    return;
  }
};

const getCommentsForQuestionnaire = async (questionnaireId) => {
  try {
    const collection = dbo.collection("comments");
    const comments = await collection.findOne({
      questionnaireId: questionnaireId,
    });
    if (!comments) {
      return createComments(questionnaireId);
    }
    return comments;
  } catch (error) {
    logger.error(
      error,
      `Unable to get comments for questionnaire with ID ${questionnaireId}`
    );
    return;
  }
};

const getUserByName = async (name) => {
  try {
    const collection = dbo.collection("users");
    const user = await collection.findOne({
      name: name,
    });
    if (!user) {
      logger.info("No user found by name");
      return;
    }
    return user;
  } catch (error) {
    logger.error(error, `Unable to get a user by name`);
    return;
  }
};

const getUserByEmail = async (email) => {
  try {
    const collection = dbo.collection("users");
    const user = await collection.findOne({
      email: email,
    });
    if (!user) {
      logger.info("No user found by name");
      return;
    }
    return user;
  } catch (error) {
    logger.error(error, `Unable to get a user by name`);
    return;
  }
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  listQuestionnaires,
  getQuestionnaire,
  getQuestionnaireMetaById,
  createComments,
  createUser,
  getUserByExternalId,
  getUserById,
  listUsers,
  createHistoryEvent,
  saveMetadata,
  getCommentsForQuestionnaire,
  saveComments,
  updateUser,
  getUserByName,
  getUserByEmail,
  connectDB,
};
