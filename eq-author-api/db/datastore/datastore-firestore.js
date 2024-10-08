const { Firestore } = require("@google-cloud/firestore");
const { v4: uuidv4 } = require("uuid");
const { logger } = require("../../utils/logger");
const { pick } = require("lodash/fp");
const { omit } = require("lodash");
const { removeEmpty } = require("../../utils/removeEmpty");
const {
  baseQuestionnaireFields,
  saveQuestionnaireFields,
} = require("../baseQuestionnaireSchema");
const {
  questionnaireCreationEvent,
  historyCreationForImport,
} = require("../../utils/questionnaireEvents");

let db;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

const SAVE_FIELDS = [
  ...Object.keys(saveQuestionnaireFields),
  "updatedAt",
  "history",
];

const justListSaveFields = pick(SAVE_FIELDS);

const saveSections = (parentDoc, sections) =>
  Promise.all(
    sections.map((section, position) =>
      parentDoc
        .collection("sections")
        .doc(section.id)
        .set({ ...section, position })
        .catch((error) => {
          logger.error(
            { ...error, section: section },
            "Error writing section (from saveSections)"
          );
          throw error;
        })
    )
  );

const createQuestionnaire = async (questionnaire, ctx, imported) => {
  const updatedAt = new Date();
  const id = questionnaire.id ?? uuidv4();
  const { sections } = questionnaire;

  const historyArray = imported
    ? [historyCreationForImport(questionnaire, ctx)]
    : [questionnaireCreationEvent(questionnaire, ctx)];

  const baseQuestionnaire = removeEmpty({
    id,
    ...justListFields(questionnaire),
    history: historyArray,
    updatedAt,
  });

  const versionQuestionnaire = removeEmpty({
    id,
    ...questionnaire,
    updatedAt,
    sections: undefined,
  });

  try {
    const baseDoc = db.collection("questionnaires").doc(id);
    await baseDoc.set(baseQuestionnaire);
    const versionDoc = baseDoc.collection("versions").doc(uuidv4());
    await versionDoc.set(versionQuestionnaire);
    await saveSections(versionDoc, sections);
  } catch (error) {
    logger.error(
      error,
      `Unable to create questionnaire with ID: ${id} (from createQuestionnaire)`
    );
  }

  logger.info(
    `Created questionnaire with ID: ${id} (from createQuestionnaire)`
  );

  return { ...versionQuestionnaire, sections };
};

const transformedQuestionnaire = (sections, version) => {
  const newSections = sections.length ? sections : version.sections || [];
  newSections.forEach((section) => {
    section.folders?.forEach((folder) => {
      folder.pages?.forEach((page) => {
        page.answers?.forEach((answer) => {
          for (const [, validation] of Object.entries(
            answer.validation || {}
          )) {
            if (validation.custom?.seconds) {
              validation.custom = validation.custom.toDate();
            }
          }
        });
      });
    });
  });

  version.metadata.forEach((metadata) => {
    if (metadata.dateValue?.seconds) {
      metadata.dateValue = metadata.dateValue.toDate();
    }
  });

  version.updatedAt = version.updatedAt.seconds
    ? version.updatedAt.toDate()
    : new Date(version.updatedAt);
  version.createdAt = version.createdAt.seconds
    ? version.createdAt.toDate()
    : new Date(version.createdAt);
  version.editors = version.editors || [];

  version?.publishHistory?.forEach((publishHistoryEvent) => {
    publishHistoryEvent.publishDate = publishHistoryEvent.publishDate.seconds
      ? publishHistoryEvent.publishDate.toDate()
      : new Date(publishHistoryEvent.publishDate);
  });

  return {
    ...version,
    sections: newSections || [],
  };
};

const getQuestionnaire = async (id) => {
  let version, latestVersionSnapshot;
  let retries = 0;

  try {
    do {
      latestVersionSnapshot = (
        await db
          .collection("questionnaires")
          .doc(id)
          .collection("versions")
          .orderBy("createdAt", "desc")
          .limit(1)
          .get()
      ).docs?.[0];

      if (!latestVersionSnapshot) {
        throw new Error("Document doesn't exist (from getQuestionnaire)");
      }

      version = latestVersionSnapshot.data();

      if (version.documentStatus && version.documentStatus !== "clean") {
        await sleep(500);
        if (++retries > 3) {
          throw new Error("Document is not clean");
        }
      }
    } while (version.documentStatus && version.documentStatus !== "clean");

    const sectionsSnapshot = await latestVersionSnapshot?.ref
      ?.collection("sections")
      ?.get();

    const sections =
      !sectionsSnapshot || sectionsSnapshot.empty
        ? []
        : sectionsSnapshot.docs
            .map((snap) => snap.data())
            .sort(({ position: a }, { position: b }) => a - b);

    return transformedQuestionnaire(sections, version);
  } catch (error) {
    logger.error(
      { ...error, qid: id },
      `Unable to get latest version of questionnaire (from getQuestionnaire)`
    );
    return null;
  }
};

const getQuestionnaireMetaById = async (id) => {
  try {
    const questionnaireSnapshot = await db
      .collection("questionnaires")
      .doc(id)
      .get();

    if (questionnaireSnapshot.empty) {
      logger.info(
        "No base questionnaire found (from getQuestionnaireMetaById)"
      );
      return null;
    }

    const questionnaire = {
      ...questionnaireSnapshot.data(),
      history: questionnaireSnapshot.data().history.map((historyItem) => ({
        ...historyItem,
        time: historyItem.time.seconds
          ? historyItem.time.toDate()
          : new Date(historyItem.time),
      })),
      updatedAt: questionnaireSnapshot.data().updatedAt.toDate(),
      createdAt: questionnaireSnapshot.data().createdAt.toDate(),
    };
    return questionnaire;
  } catch (error) {
    logger.error(
      error,
      `Error getting base questionnaire with ID ${id} (from getQuestionnaireMetaById)`
    );
    return;
  }
};

const getQuestionnaireByVersionId = async (id, versionId) => {
  try {
    const versionSnapshot = await db
      .collection("questionnaires")
      .doc(id)
      .collection("versions")
      .doc(versionId)
      .get();

    if (versionSnapshot.empty) {
      throw new Error(
        "Document doesn't exist (from getQuestionnaireByVersionId)"
      );
    }

    const sectionsSnapshot = await versionSnapshot?.ref
      ?.collection("sections")
      ?.get();

    const sections =
      !sectionsSnapshot || sectionsSnapshot.empty
        ? []
        : sectionsSnapshot.docs
            .map((snap) => snap.data())
            .sort(({ position: a }, { position: b }) => a - b);

    logger.info(
      `getQuestionnaireByVersionId called on version with ID: ${versionId} in questionnaire with ID: ${id}`
    );
    const version = versionSnapshot.data();
    return transformedQuestionnaire(sections, version);
  } catch (error) {
    logger.error(
      error,
      `Unable to get version with ID: ${versionId} in questionnaire with ID: ${id} (from getQuestionnaireByVersionId)`
    );
    return null;
  }
};

const saveQuestionnaire = async (changedQuestionnaire) => {
  const { id } = changedQuestionnaire;

  try {
    if (!id) {
      throw new Error(
        "Unable to save questionnaire; cannot find required field: ID (from saveQuestionnaire)"
      );
    }
    const updatedAt = new Date();

    const originalQuestionnaire = await getQuestionnaire(id);

    let sectionCount = originalQuestionnaire?.sections.length;
    logger.info(
      { qid: originalQuestionnaire?.id, sectionCount },
      "Save questionnare: before merge with changed questionnaire"
    );

    const updatedQuestionnaire = removeEmpty({
      ...originalQuestionnaire,
      ...changedQuestionnaire,
    });

    sectionCount = updatedQuestionnaire?.sections.length;
    logger.info(
      { qid: updatedQuestionnaire?.id, sectionCount },
      "Save questionnare: after merge with changed questionnaire"
    );

    const { sections } = updatedQuestionnaire;

    const baseDoc = db.collection("questionnaires").doc(id);
    await baseDoc.update({
      ...justListSaveFields(updatedQuestionnaire),
      updatedAt,
    });

    const versionDoc = baseDoc.collection("versions").doc(uuidv4());

    await versionDoc.set({
      ...omit(updatedQuestionnaire, "sections"),
      updatedAt,
      createdAt: new Date(),
      documentStatus: "dirty",
    });

    try {
      await saveSections(versionDoc, sections);
    } catch (error) {
      await versionDoc.delete();
      throw error;
    }

    await versionDoc.update({
      documentStatus: "clean",
    });

    logger.info(
      { qid: updatedQuestionnaire?.id },
      "Save questionnare: save successful"
    );

    return { ...updatedQuestionnaire, updatedAt };
  } catch (error) {
    logger.error(
      error,
      `Error updating questionnaire with ID ${id} (from saveQuestionnaire)`
    );
    return;
  }
};

const listQuestionnaires = async () => {
  try {
    const questionnairesSnapshot = await db.collection("questionnaires").get();

    if (questionnairesSnapshot.empty) {
      logger.info("No questionnaires found (from listQuestionnaires)");
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
    logger.error(
      error,
      "Unable to retrieve questionnaires (from listQuestionnaires)"
    );
    return;
  }
};

const listFilteredQuestionnaires = async (input) => {
  try {
    const {
      resultsPerPage,
      firstQuestionnaireIdOnPage,
      lastQuestionnaireIdOnPage,
    } = input;

    // Orders questionnaires by when they were created, starting with the newest
    let questionnairesQuery = db
      .collection("questionnaires")
      .orderBy("createdAt", "desc");

    // Gets questionnaires on first page when firstQuestionnaireIdOnPage and lastQuestionnaireIdOnPage are not provided
    if (!firstQuestionnaireIdOnPage && !lastQuestionnaireIdOnPage) {
      questionnairesQuery = questionnairesQuery.limit(resultsPerPage);
    }
    // Gets questionnaires on previous page when firstQuestionnaireIdOnPage is provided without lastQuestionnaireIdOnPage
    else if (firstQuestionnaireIdOnPage && !lastQuestionnaireIdOnPage) {
      // Gets first questionnaire on current page based on firstQuestionnaireIdOnPage
      const firstQuestionnaireOnPage = await db
        .collection("questionnaires")
        .doc(firstQuestionnaireIdOnPage)
        .get();

      // Gets previous questionnaires before firstQuestionnaireOnPage, limiting the number of questionnaires to `resultsPerPage`
      questionnairesQuery = questionnairesQuery
        .endBefore(firstQuestionnaireOnPage)
        .limitToLast(resultsPerPage);
    }
    // Gets questionnaires on next page when lastQuestionnaireIdOnPage is provided without firstQuestionnaireIdOnPage
    else if (lastQuestionnaireIdOnPage && !firstQuestionnaireIdOnPage) {
      // Gets last questionnaire on current page based on lastQuestionnaireIdOnPage
      const lastQuestionnaireOnPage = await db
        .collection("questionnaires")
        .doc(lastQuestionnaireIdOnPage)
        .get();

      // Gets next questionnaires after lastQuestionnaireOnPage, limiting the number of questionnaires to `resultsPerPage`
      questionnairesQuery = questionnairesQuery
        .startAfter(lastQuestionnaireOnPage)
        .limit(resultsPerPage);
    }
    // Throws an error when both firstQuestionnaireIdOnPage and lastQuestionnaireIdOnPage are provided
    else {
      logger.error(
        "Invalid input - both firstQuestionnaireIdOnPage and lastQuestionnaireIdOnPage have been provided (from listFilteredQuestionnaires)"
      );
    }

    const questionnairesSnapshot = await questionnairesQuery.get();

    if (questionnairesSnapshot.empty) {
      logger.info("No questionnaires found (from listFilteredQuestionnaires)");
      return [];
    }

    const questionnaires = questionnairesSnapshot.docs.map((doc) => ({
      ...doc.data(),
      editors: doc.data().editors || [],
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    }));
    return questionnaires || [];
  } catch (error) {
    logger.error(
      error,
      "Unable to retrieve questionnaires (from listFilteredQuestionnaires)"
    );
    return;
  }
};

const deleteQuestionnaire = async (id) => {
  try {
    await db.collection("questionnaires").doc(id).delete();
    return;
  } catch (error) {
    logger.error(
      error,
      `Unable to delete questionnaire with ID: ${id} (from deleteQuestionnaire)`
    );
    return;
  }
};

const createUser = async (user) => {
  let { id, name, email } = user;
  const updatedAt = new Date();

  try {
    if (!email) {
      throw new Error(
        "Cannot create new user without required field: email (from createUser)"
      );
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
      .set({ ...user, id, name, email, updatedAt });
  } catch (error) {
    logger.error(error, `Error creating user with ID: ${id} (from createUser)`);
    return;
  }

  return { ...user, id, name, updatedAt };
};

const getUserByExternalId = async (externalId) => {
  try {
    if (!externalId) {
      throw new Error(
        "Cannot find user without required field 'externalId' (from getUserByExternalId)"
      );
    }

    const userSnapshot = await db
      .collection("users")
      .where("externalId", "==", externalId)
      .limit(1)
      .get();
    if (userSnapshot.empty) {
      logger.info(
        `User with external ID ${externalId} not found (from getUserByExternalId)`
      );
      return;
    }

    const doc = userSnapshot.docs[0];

    return { ...doc.data(), id: doc.id };
  } catch (error) {
    logger.error(
      error,
      `Unable to find user with external ID ${externalId} (from getUserByExternalId)`
    );
    return;
  }
};

const getUserById = async (id) => {
  try {
    const userSnapshot = await db.collection("users").doc(id).get();

    if (userSnapshot.empty) {
      logger.info("No users found (from getUserById");
      return;
    }

    return { ...userSnapshot.data(), id: userSnapshot.id };
  } catch (error) {
    logger.error(error, `Error getting user with ID: ${id} (from getUserById)`);
    return;
  }
};

const listUsers = async () => {
  try {
    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      logger.info("No users found (from listUsers");
      return [];
    }

    return usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    logger.error(error, `Unable to get a list of all users (from listUsers)`);
    return;
  }
};

const createHistoryEvent = async (qid, event) => {
  try {
    if (!qid) {
      throw new Error(
        "Unable to create a history event without first parameter: qid (from createHistoryEvent)"
      );
    }

    if (!event) {
      throw new Error(
        "Unable to create history event without second paramater: event (from createHistoryEvent)"
      );
    }
    const questionnaire = await getQuestionnaireMetaById(qid);

    if (questionnaire?.history?.length) {
      questionnaire.history.unshift(event);
    } else {
      questionnaire.history = [];
      questionnaire.history.unshift(event);
    }

    await db
      .collection("questionnaires")
      .doc(qid)
      .update({ history: questionnaire.history });

    return questionnaire.history;
  } catch (error) {
    logger.error(
      error,
      `Error creating history event in questionnaire with ID ${qid} (from createHistoryEvent)`
    );
    return;
  }
};

const saveMetadata = async (metadata) => {
  const { id } = metadata;

  if (!id) {
    throw new Error(
      "Cannot find required field ID within the given base questionnaire (from saveMetadata)"
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
    logger.error(
      error,
      `Cannot update base questionnaire with ID ${id} (from saveMetadata)`
    );
    return;
  }
};

const createComments = async (questionnaireId) => {
  try {
    if (!questionnaireId) {
      throw new Error(
        "Cannot create default comments without required paramater: questionnaireId (from createComments)"
      );
    }
    const defaultComments = { questionnaireId, comments: {} };
    await db.collection("comments").doc(questionnaireId).set(defaultComments);
    return defaultComments;
  } catch (error) {
    logger.error(
      error,
      `Unable to create comment structure for questionnaire with ID ${questionnaireId} (from createComments)`
    );
    return;
  }
};

const getCommentsForQuestionnaire = async (questionnaireId) => {
  try {
    const commentsSnapshot = await db
      .collection("comments")
      .doc(questionnaireId)
      .get();

    const data = commentsSnapshot.data();

    if (!data) {
      return createComments(questionnaireId);
    }

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
      error,
      `Unable to get comments for questionnaire with ID ${questionnaireId} (from getCommentsForQuestionnaire)`
    );
    return;
  }
};

const saveComments = async (updatedCommentsObject) => {
  const { questionnaireId, comments: updatedComments } = updatedCommentsObject;
  try {
    if (!questionnaireId) {
      throw new Error(
        "Unable to save comments without required field: questionnaireId (from saveComments)"
      );
    }
    await db
      .collection("comments")
      .doc(questionnaireId)
      .update({ comments: { ...updatedComments } });
    return updatedComments;
  } catch (error) {
    logger.error(
      error,
      `Unable to save comments for questionnaire with ID ${questionnaireId} (from saveComments)`
    );
    return;
  }
};

const updateUser = async (changedUser) => {
  const { id } = changedUser;
  try {
    if (!id) {
      throw new Error(
        "Cannot update user without required field: id (from updateUser)"
      );
    }
    const doc = db.collection("users").doc(id);
    const existingUser = await doc.get();
    changedUser.updatedAt = new Date();
    await doc.update(changedUser);
    return { ...existingUser, ...changedUser };
  } catch (error) {
    logger.error(error, `Unable update user with ID ${id} (from updateUser)`);
    return;
  }
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  listQuestionnaires,
  listFilteredQuestionnaires,
  getQuestionnaire,
  getQuestionnaireMetaById,
  getQuestionnaireByVersionId,
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
