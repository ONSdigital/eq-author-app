const { Firestore } = require("@google-cloud/firestore");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../../utils/logger");
const { pick } = require("lodash/fp");
const { removeEmpty } = require("../../utils/removeEmpty");
const { baseQuestionnaireFields } = require("../baseQuestionnaireSchema");
const {
  questionnaireCreationEvent,
} = require("../../utils/questionnaireEvents");

let db;
if (process.env.GOOGLE_AUTH_PROJECT_ID) {
  db = new Firestore({
    projectId: process.env.GOOGLE_AUTH_PROJECT_ID,
  });
} else {
  db = new Firestore();
}

const BASE_FIELDS = [
  ...Object.keys(baseQuestionnaireFields),
  "updatedAt",
  "history",
];

const justListFields = pick(BASE_FIELDS);

const createQuestionnaire = async (questionnaire, ctx) => {
  const updatedAt = new Date();
  const { id } = questionnaire;

  const baseQuestionnaire = removeEmpty({
    ...justListFields(questionnaire),
    history: [questionnaireCreationEvent(questionnaire, ctx)],
    updatedAt,
  });

  const versionQuestionnaire = removeEmpty({
    ...questionnaire,
    updatedAt,
  });

  try {
    await db
      .collection("questionnaires")
      .doc(id)
      .set(baseQuestionnaire);

    await db
      .collection("questionnaires")
      .doc(id)
      .collection("versions")
      .doc(uuidv4())
      .set(versionQuestionnaire);
  } catch (error) {
    logger.error(`Unable to create questionnaire with ID: ${id}`);
    logger.error(error);
  }

  logger.info(`Created questionnaire with ID: ${id}`);

  return {
    ...questionnaire,
    updatedAt,
  };
};

const getQuestionnaire = id =>
  new Promise(async (resolve, reject) => {
    const questionnaire = await db
      .collection("questionnaires")
      .doc(id)
      .collection("versions")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          logger.info("No questionnaires found");
          return;
        }

        const transformedQuestionnaires = snapshot.docs.map(doc => ({
          ...doc.data(),
          editors: doc.data().editors || [],
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        }));

        return transformedQuestionnaires[0];
      })
      .catch(err => {
        logger.error(
          `Unable to get latest version of questionnaire with ID: ${id}`
        );
        logger.error(err);

        reject(err);
      });
    resolve(questionnaire);
  });

const getQuestionnaireMetaById = id =>
  new Promise(async (resolve, reject) => {
    try {
      const questionnaire = await db
        .collection("questionnaires")
        .doc(id)
        .get()
        .then(snapshot => ({
          ...snapshot.data(),
          history: snapshot.data().history.map(historyItem => ({
            ...historyItem,
            time: historyItem.time.toDate(),
          })),
          updatedAt: snapshot.data().updatedAt.toDate(),
          createdAt: snapshot.data().createdAt.toDate(),
        }));
      resolve(questionnaire);
    } catch (error) {
      logger.error(`Error getting base questionnaire with ID ${id}`);
      logger.error(error);
      reject(error);
    }
  });

const saveQuestionnaire = async changedQuestionnaire => {
  const { id } = changedQuestionnaire;

  const createdAt = new Date();
  const updatedAt = createdAt;

  const originalQuestionnaire = await getQuestionnaire(id);

  const updatedQuestionnaire = removeEmpty({
    ...originalQuestionnaire,
    ...changedQuestionnaire,
  });

  try {
    await db
      .collection("questionnaires")
      .doc(id)
      .update({ ...justListFields(updatedQuestionnaire), updatedAt });

    await db
      .collection("questionnaires")
      .doc(id)
      .collection("versions")
      .doc(uuidv4())
      .set({
        ...updatedQuestionnaire,
        updatedAt,
        createdAt,
      });
  } catch (error) {
    logger.error(`Error updating questionnaire with ID ${id}`);
    logger.error(error);
  }
};

const listQuestionnaires = async () => {
  const docRef = db.collection("questionnaires");
  const questionnaires = await docRef
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        logger.info("No questionnaires found");
        return;
      }

      return snapshot.docs
        .map(doc => ({
          ...doc.data(),
          editors: doc.data().editors || [],
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        }))
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    })
    .catch(err => {
      logger.err("Error getting documents", err);
    });

  return questionnaires || [];
};

const deleteQuestionnaire = id =>
  new Promise(async (resolve, reject) => {
    try {
      await db
        .collection("questionnaires")
        .doc(id)
        .delete();
      resolve();
    } catch (error) {
      logger.error(`Unable to delete questionnaire with ID: ${id}`);
      logger.error(error);
      reject(error);
    }
  });

const createUser = user =>
  new Promise(async (resolve, reject) => {
    let { id, name } = user;

    if (!id) {
      id = uuidv4();
    }

    if (!name) {
      name = user.email;
    }

    try {
      await db
        .collection("users")
        .doc(id)
        .set({ ...user, id, name });
    } catch (error) {
      logger.error(`Error creating user with ID: ${id}: `);
      logger.error(error);
      reject(error);
    }

    resolve();
  });

const getUserByExternalId = externalId =>
  new Promise(async (resolve, reject) => {
    const docRef = db.collection("users");
    const user = await docRef
      .where("externalId", "==", externalId)
      .limit(1)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          logger.info("No users found");
          return;
        }

        const doc = snapshot.docs[0];

        resolve({ ...doc.data(), id: doc.id });
      })
      .catch(err => {
        logger.error("Error getting documents");
        logger.error(err);
        reject(err);
      });
    resolve(user);
  });

const getUserById = async id => {
  const user = await db
    .collection("users")
    .doc(id)
    .get()
    .then(doc => {
      if (doc.empty) {
        logger.info("No users found");
        return;
      }

      return { ...doc.data(), id: doc.id };
    })
    .catch(err => {
      logger.error(`Error getting user with ID: ${id}`);
      logger.error(err);
    });

  return user;
};

const listUsers = async () => {
  const docRef = db.collection("users");
  const users = await docRef.get().then(snapshot => {
    if (snapshot.empty) {
      logger.info("No users found");
      return;
    }

    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  });

  return users;
};

const createHistoryEvent = (qid, event) =>
  new Promise(async (resolve, reject) => {
    try {
      const questionnaire = await getQuestionnaireMetaById(qid);
      questionnaire.history.unshift(event);

      await db
        .collection("questionnaires")
        .doc(qid)
        .update({ history: questionnaire.history });

      resolve(questionnaire.history);
    } catch (error) {
      logger.error(
        `Error creating history event in questionnaire with ID ${qid}`
      );
      logger.error(error);
      reject(error);
    }
  });

const saveMetadata = metadata =>
  new Promise(async (resolve, reject) => {
    const { id } = metadata;

    try {
      const updateMetadata = await db
        .collection("questionnaires")
        .doc(id)
        .update({ ...metadata });
      resolve(updateMetadata);
    } catch (error) {
      logger.error(`Cannot update base questionnaire with ID ${id}`);
      logger.error(error);
      reject(error);
    }
  });

const createComments = async questionnaireId =>
  new Promise(async (resolve, reject) => {
    const defaultComments = { questionnaireId, comments: {} };
    try {
      await db
        .collection("comments")
        .doc(questionnaireId)
        .set(defaultComments);
      resolve(defaultComments);
    } catch (error) {
      logger.error(
        `Unable to create comment structure for questionnaire with ID ${questionnaireId}`
      );
      logger.error(error);
      reject(error);
    }
  });

const getCommentsForQuestionnaire = questionnaireId =>
  new Promise(async (resolve, reject) => {
    try {
      const questionnaireComments = await db
        .collection("comments")
        .doc(questionnaireId)
        .get()
        .then(doc => doc.data());

      resolve(questionnaireComments);
    } catch (error) {
      logger.error(
        `Unable to get comments for questionnaire with ID ${questionnaireId}`
      );
      logger.error(error);
      reject(error);
    }
  });

const saveComments = newComments =>
  new Promise(async (resolve, reject) => {
    const { questionnaireId, comments } = newComments;
    try {
      await db
        .collection("comments")
        .doc(questionnaireId)
        .update({ ...comments });
      resolve(newComments);
    } catch (error) {
      logger.error(
        `Unable to save comments for questionnaire with ID ${questionnaireId}`
      );
      logger.error(error);
      reject(error);
    }
  });

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
};
