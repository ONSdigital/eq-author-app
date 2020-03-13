const { Firestore } = require("@google-cloud/firestore");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../../utils/logger");
const {
  questionnaireCreationEvent,
} = require("../../utils/questionnaireEvents");

const FieldValue = require("firebase-admin").firestore.FieldValue;

let db;
if (process.env.GOOGLE_AUTH_PROJECT_ID) {
  db = new Firestore({
    projectId: process.env.GOOGLE_AUTH_PROJECT_ID,
  });
} else {
  db = new Firestore();
}

const createQuestionnaire = async (questionnaire, ctx) => {
  const {
    id,
    isPublic,
    title,
    createdBy,
    type,
    publishStatus,
    editors,
    version,
    legalBasis,
    navigation,
    surveyId,
    theme,
    summary,
    sections,
    metadata,
    surveyVersion,
  } = questionnaire;

  const baseSchema = {
    id,
    isPublic,
    title,
    createdBy,
    type,
    publishStatus,
    editors,
    history: [questionnaireCreationEvent(questionnaire, ctx)],
  };

  const versionsSchema = {
    ...baseSchema,
    title,
    legalBasis,
    surveyId,
    navigation,
    metadata,
    summary,
    theme,
    sections,
    surveyVersion,
    version,
  };

  try {
    await db
      .collection("questionnaires")
      .doc(id)
      .set({
        ...baseSchema,
        created: FieldValue.serverTimestamp(),
      });

    await db
      .collection("questionnaires")
      .doc(id)
      .collection("versions")
      .doc(uuidv4())
      .set({
        ...versionsSchema,
        created: FieldValue.serverTimestamp(),
      });
  } catch (error) {
    logger.error(error);
  }

  logger.info(`Created questionnaire with ID: ${id}`);

  return { ...baseSchema, ...versionsSchema };
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
        .map(doc => ({ ...doc.data(), editors: doc.data().editors || [] }))
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    })
    .catch(err => {
      logger.err("Error getting documents", err);
    });

  return questionnaires || [];
};

const getQuestionnaire = async id => {
  const questionnaire = await db
    .collection("questionnaires")
    .doc(id)
    .collection("versions")
    .orderBy("created", "desc")
    .limit(1)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        logger.info("No questionnaires found");
        return;
      }

      return snapshot.docs[0].data();
    })
    .catch(err => {
      logger.error(
        `Unable to get latest version of questionnaire with ID: ${id}`,
        err
      );
    });

  console.log(questionnaire);
  return questionnaire;
};

const deleteQuestionnaire = async id => {
  return await db
    .collection("questionnaires")
    .doc(id)
    .collection("versions")
    .delete()
    .catch(err => {
      logger.error(`Unable to delete questionnaire with ID: ${id}`, err);
    });
};

const createComments = async () => [];

const createUser = async user => {
  let { id, email, name, externalId } = user;

  if (!id) {
    id = uuidv4();
  }

  try {
    await db
      .collection("users")
      .doc(id)
      .set({ email, name, externalId });
  } catch (error) {
    logger.error(error);
  }
};

const getUserByExternalId = async externalId => {
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

      return { ...doc.data(), id: doc.id };
    })
    .catch(err => {
      logger.error("Error getting documents", err);
    });

  return user;
};

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
      logger.error(`Error getting user with ID: ${id}`, err);
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
  deleteQuestionnaire,
  listQuestionnaires,
  getQuestionnaire,
  createComments,
  createUser,
  getUserByExternalId,
  getUserById,
  listUsers,
};
