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
      .update({ updatedAt });

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

const deleteQuestionnaire = async id => {
  return db
    .collection("questionnaires")
    .doc(id)
    .collection("versions")
    .delete()
    .catch(err => {
      logger.error(`Unable to delete questionnaire with ID: ${id}`);
      logger.error(err);
    });
};

const createComments = async () => [];

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

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  listQuestionnaires,
  getQuestionnaire,
  createComments,
  createUser,
  getUserByExternalId,
  getUserById,
  listUsers,
};
