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

const connectDB = () => {
  if (process.env.GOOGLE_AUTH_PROJECT_ID) {
    db = new Firestore({
      projectId: process.env.GOOGLE_AUTH_PROJECT_ID,
    });
  } else {
    db = new Firestore();
  }
};

const BASE_FIELDS = [
  ...Object.keys(baseQuestionnaireFields),
  "updatedAt",
  "history",
];

const justListFields = pick(BASE_FIELDS);

const createQuestionnaire = async (questionnaire, ctx) => {
  const updatedAt = new Date();

  if (!questionnaire.id) {
    questionnaire.id = uuidv4();
  }

  let { id } = questionnaire;

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
    await db.collection("questionnaires").doc(id).set(baseQuestionnaire);

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

const getQuestionnaire = async (id) => {
  try {
    const questionnaireSnapshot = await db
      .collection("questionnaires")
      .doc(id)
      .collection("versions")
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();
    if (questionnaireSnapshot.empty) {
      logger.info("No questionnaires found");
      return null;
    }
    const transformedQuestionnaires = questionnaireSnapshot.docs.map((doc) => ({
      ...doc.data(),
      editors: doc.data().editors || [],
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    }));
    return transformedQuestionnaires[0];
  } catch (err) {
    logger.error(
      `Unable to get latest version of questionnaire with ID: ${id}`
    );
    logger.error(err);
    return err;
  }
};

const getQuestionnaireMetaById = async (id) => {
  try {
    const questionnaireSnapshot = await db
      .collection("questionnaires")
      .doc(id)
      .get();

    if (questionnaireSnapshot.empty) {
      logger.info("No base questionnaire found");
      return null;
    }

    const questionnaire = {
      ...questionnaireSnapshot.data(),
      history: questionnaireSnapshot.data().history.map((historyItem) => ({
        ...historyItem,
        time: historyItem.time.toDate(),
      })),
      updatedAt: questionnaireSnapshot.data().updatedAt.toDate(),
      createdAt: questionnaireSnapshot.data().createdAt.toDate(),
    };
    return questionnaire;
  } catch (error) {
    logger.error(`Error getting base questionnaire with ID ${id}`);
    logger.error(error);
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

    const createdAt = new Date();
    const updatedAt = createdAt;

    const originalQuestionnaire = await getQuestionnaire(id);

    const updatedQuestionnaire = removeEmpty({
      ...originalQuestionnaire,
      ...changedQuestionnaire,
    });

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

    return { ...updatedQuestionnaire, updatedAt };
  } catch (error) {
    logger.error(`Error updating questionnaire with ID ${id}`);
    logger.error(error);
    return;
  }
};

const listQuestionnaires = async () => {
  try {
    const questionnairesSnapshot = await db.collection("questionnaires").get();

    if (questionnairesSnapshot.empty) {
      logger.info("No questionnaires found");
      return [];
    }

    const questionnaires = questionnairesSnapshot.docs
      .map((doc) => ({
        ...doc.data(),
        editors: doc.data().editors || [],
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      }))
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    return questionnaires || [];
  } catch (error) {
    logger.error("Unable to retrieve questionnaires");
    logger.error(error);
    return;
  }
};

const deleteQuestionnaire = async (id) => {
  try {
    await db.collection("questionnaires").doc(id).delete();
    return;
  } catch (error) {
    logger.error(`Unable to delete questionnaire with ID: ${id}`);
    logger.error(error);
    return;
  }
};

const createUser = async (user) => {
  let { id, name, email } = user;

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

    await db
      .collection("users")
      .doc(id)
      .set({ ...user, id, name, email });
  } catch (error) {
    logger.error(`Error creating user with ID: ${id}: `);
    logger.error(error);
    return;
  }

  return { ...user, id, name };
};

const getUserByExternalId = async (externalId) => {
  try {
    if (!externalId) {
      throw new Error("Cannot find user without required field 'externalId'");
    }

    const userSnapshot = await db
      .collection("users")
      .where("externalId", "==", externalId)
      .limit(1)
      .get();
    if (userSnapshot.empty) {
      logger.info(`User with external ID ${externalId} not found`);
      return;
    }

    const doc = userSnapshot.docs[0];

    return { ...doc.data(), id: doc.id };
  } catch (error) {
    logger.error(`Unable to find user with external ID ${externalId}`);
    logger.error(error);
    return;
  }
};

const getUserById = async (id) => {
  try {
    const userSnapshot = await db.collection("users").doc(id).get();

    if (userSnapshot.empty) {
      logger.info("No users found");
      return;
    }

    return { ...userSnapshot.data(), id: userSnapshot.id };
  } catch (error) {
    logger.error(`Error getting user with ID: ${id}`);
    logger.error(error);
    return error;
  }
};

const listUsers = async () => {
  try {
    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      logger.info("No users found");
      return [];
    }

    return usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    logger.error(`Unable to get a list of all users`);
    logger.error(error);
    return error;
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
    questionnaire.history.unshift(event);

    await db
      .collection("questionnaires")
      .doc(qid)
      .update({ history: questionnaire.history });

    return questionnaire.history;
  } catch (error) {
    logger.error(
      `Error creating history event in questionnaire with ID ${qid}`
    );
    logger.error(error);
    return error;
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
    await db
      .collection("questionnaires")
      .doc(id)
      .update({ ...updatedMetadata });
    return updatedMetadata;
  } catch (error) {
    logger.error(`Cannot update base questionnaire with ID ${id}`);
    logger.error(error);
    return error;
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
    await db.collection("comments").doc(questionnaireId).set(defaultComments);
    return defaultComments;
  } catch (error) {
    logger.error(
      `Unable to create comment structure for questionnaire with ID ${questionnaireId}`
    );
    logger.error(error);
    return error;
  }
};

const getCommentsForQuestionnaire = async (questionnaireId) => {
  try {
    const commentsSnapshot = await db
      .collection("comments")
      .doc(questionnaireId)
      .get();

    const data = commentsSnapshot.data();

    const listOfComponents = Object.keys(data.comments);
    listOfComponents.forEach((component) => {
      const componentComments = data.comments[component];
      data.comments[component] = componentComments.map((comment) => {
        let editedTime;
        if (comment.editedTime) {
          editedTime = comment.editedTime.toDate();
        } else {
          editedTime = null;
        }

        const replies = comment.replies.map((reply) => {
          let editedTime;
          if (reply.editedTime) {
            editedTime = reply.editedTime.toDate();
          } else {
            editedTime = null;
          }

          return {
            ...reply,
            editedTime,
            createdTime: reply.createdTime.toDate(),
          };
        });

        return {
          ...comment,
          replies,
          editedTime,
          createdTime: comment.createdTime.toDate(),
        };
      });
    });
    return data;
  } catch (error) {
    logger.error(
      `Unable to get comments for questionnaire with ID ${questionnaireId}`
    );
    logger.error(error);
    return error;
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
    await db
      .collection("comments")
      .doc(questionnaireId)
      .update({ comments: { ...updatedComments } });
    return updatedComments;
  } catch (error) {
    logger.error(
      `Unable to save comments for questionnaire with ID ${questionnaireId}`
    );
    logger.error(error);
    return error;
  }
};

const updateUser = async (changedUser) => {
  const { id } = changedUser;
  try {
    if (!id) {
      throw new Error("Cannot update user without required field: id");
    }
    const existingUser = await db.collection("users").doc(id).get();
    const user = Object.assign(changedUser, existingUser);
    await db
      .collection("users")
      .doc(id)
      .update({ ...user });
    return user;
  } catch (error) {
    logger.error(`Unable update user with ID ${id}`);
    logger.error(error);
    return error;
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
  connectDB,
};
