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

const getMatchQuery = async (input = {}, ctx) => {
  try {
    const {
      searchByTitleOrShortCode = "",
      owner = "",
      createdOnOrAfter,
      createdOnOrBefore,
      access,
      myQuestionnaires,
      questionnairesToExclude,
    } = input;

    const { id: userId } = ctx.user;
    if (createdOnOrBefore) {
      createdOnOrBefore.setHours(23, 59, 59, 999); // Sets `createdOnOrBefore` time to 23:59:59.999 to include all questionnaires created on that day
    }

    const matchQuery = {
      $and: [
        // Searches for questionnaires with `title` or `shortTitle` (short code) containing the search term
        {
          $or: [
            { title: { $regex: searchByTitleOrShortCode, $options: "i" } },
            { shortTitle: { $regex: searchByTitleOrShortCode, $options: "i" } },
          ],
        },
        // Searches for questionnaires with owner name OR email containing the search term - email also handles owner name being null
        {
          $or: [
            { "owner.name": { $regex: owner, $options: "i" } },
            { "owner.email": { $regex: owner, $options: "i" } },
          ],
        },
      ],
    };

    // If both `createdOnOrAfter` and `createdOnOrBefore` are provided, searches for questionnaires created between `createdOnOrAfter` and `createdOnOrBefore` inclusive
    if (createdOnOrAfter && createdOnOrBefore) {
      matchQuery.createdAt = {
        $gte: createdOnOrAfter, // gte: Greater than or equal to
        $lte: createdOnOrBefore, // lte: Less than or equal to
      };
    }
    // If `createdOnOrAfter` is provided without `createdOnOrBefore`, searches for questionnaires created on or after `createdOnOrAfter`
    else if (createdOnOrAfter) {
      matchQuery.createdAt = { $gte: createdOnOrAfter }; // gte: Greater than or equal to
    }
    // If `createdOnOrBefore` is provided without `createdOnOrAfter`, searches for questionnaires created on or before `createdOnOrBefore`
    else if (createdOnOrBefore) {
      matchQuery.createdAt = { $lte: createdOnOrBefore }; // lte: Less than or equal to
    }

    switch (access) {
      // Searches for all questionnaires that are public, the user is an editor of, or the user created (all questionnaires the user has access to)
      case "All":
        matchQuery.$and = matchQuery.$and || [];
        matchQuery.$and.push({
          $or: [
            { isPublic: true },
            { editors: { $in: [userId] } },
            { createdBy: userId },
          ],
        });

        break;
      // Searches for all questionnaires the user can edit (all questionnaires the user is an editor of or the user created)
      case "Editor":
        matchQuery.$and = matchQuery.$and || [];
        matchQuery.$and.push({
          $or: [{ editors: { $in: [userId] } }, { createdBy: userId }],
        });

        break;
      // Searches for all questionnaires the user can view but not edit (all public questionnaires the user is not an editor of and did not create)
      case "ViewOnly":
        matchQuery.$and = matchQuery.$and || [];
        matchQuery.$and.push(
          {
            editors: { $nin: [userId] },
          },
          { createdBy: { $ne: userId } },
          { isPublic: true }
        );

        break;
      // Searches for all non-public questionnaires the user can edit (all questionnaires the user is an editor of or the user created that are not public)
      case "PrivateQuestionnaires":
        matchQuery.$and = matchQuery.$and || [];
        matchQuery.$and.push({
          $or: [{ editors: { $in: [userId] } }, { createdBy: userId }],
          isPublic: false,
        });

        break;
    }

    // TODO: When "My questionnaires" feature is implemented, implement code to filter questionnaires based on questionnaires marked as "My questionnaires"
    if (myQuestionnaires) {
      if (!matchQuery.$and) {
        matchQuery.$and = [];
      }
      matchQuery.$and.push({
        $or: [{ editors: { $in: [userId] } }, { createdBy: userId }],
      });
    }

    // Excludes questionnaires with IDs in `questionnairesToExclude` array
    if (questionnairesToExclude?.length) {
      matchQuery.$and = matchQuery.$and || [];
      matchQuery.$and.push({ id: { $nin: questionnairesToExclude } });
    }

    return matchQuery;
  } catch (error) {
    logger.error(
      { error: error.stack, input },
      "Unable to get match query for filtering questionnaires (from getMatchQuery)"
    );
  }
};

const listFilteredQuestionnaires = async (input = {}, ctx) => {
  try {
    const {
      resultsPerPage = 10,
      firstQuestionnaireIdOnPage,
      lastQuestionnaireIdOnPage,
      sortBy = "createdDateDesc",
    } = input;

    // Gets the questionnaires collection
    const questionnairesCollection = dbo.collection("questionnaires");
    let questionnairesQuery;

    const matchQuery = await getMatchQuery(input, ctx);

    // Gets questionnaires on first page when firstQuestionnaireIdOnPage and lastQuestionnaireIdOnPage are not provided
    if (!firstQuestionnaireIdOnPage && !lastQuestionnaireIdOnPage) {
      questionnairesQuery = questionnairesCollection.aggregate([
        {
          // From the `users` collection, gets the owner (based on `createdBy`) of each questionnaire by performing a join to match questionnaire `createdBy` with user `id`
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "id",
            as: "owner",
          },
        },
        {
          $match: matchQuery,
        },
        {
          $sort: { createdAt: sortBy === "createdDateDesc" ? -1 : 1 }, // Sorts by either most recently created first or earliest created first based on `sortBy`
        },
        {
          $limit: resultsPerPage,
        },
      ]);
    }
    // Gets questionnaires on previous page when firstQuestionnaireIdOnPage is provided without lastQuestionnaireIdOnPage
    else if (firstQuestionnaireIdOnPage && !lastQuestionnaireIdOnPage) {
      // Gets first questionnaire on current page based on firstQuestionnaireIdOnPage
      const firstQuestionnaireOnPage = await questionnairesCollection.findOne({
        id: firstQuestionnaireIdOnPage,
      });

      /*
        Gets questionnaires on previous page based on firstQuestionnaireOnPage
        Only finds questionnaires that meet the search conditions (e.g. owner name matching `owner` search field)
        Uses `gt` (greater than) or `lt` (less than) to find questionnaires created after or before firstQuestionnaireOnPage (based on `sortBy`) meeting the conditions, 
        sorts from earliest created or most recently created first (based on `sortBy`), and limits to `resultsPerPage` number of questionnaires
      */
      questionnairesQuery = questionnairesCollection.aggregate([
        // From the `users` collection, gets the owner (based on `createdBy`) of each questionnaire by performing a join to match questionnaire `createdBy` with user `id`
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "id",
            as: "owner",
          },
        },
        {
          $match: {
            // Searches for questionnaires created after or before firstQuestionnaireOnPage (based on `sortBy`) AND meeting all the search conditions from `matchQuery`
            $and: [
              {
                createdAt:
                  sortBy === "createdDateDesc"
                    ? { $gt: firstQuestionnaireOnPage.createdAt }
                    : { $lt: firstQuestionnaireOnPage.createdAt },
              },
              matchQuery,
            ],
          },
        },
        {
          /* 
            Sorts by either earliest created first or most recently created first based on `sortBy` 
            (previous page, so to get the previous questionnaires, sorts by earliest created first when `sortBy` is `createdDateDesc`
            as otherwise previous page's questionnaires would be the most recently created ones)
          */
          $sort: { createdAt: sortBy === "createdDateDesc" ? 1 : -1 },
        },
        {
          $limit: resultsPerPage,
        },
      ]);
    }
    // Gets questionnaires on next page when lastQuestionnaireIdOnPage is provided without firstQuestionnaireIdOnPage
    else if (!firstQuestionnaireIdOnPage && lastQuestionnaireIdOnPage) {
      // Gets last questionnaire on current page based on lastQuestionnaireIdOnPage
      const lastQuestionnaireOnPage = await questionnairesCollection.findOne({
        id: lastQuestionnaireIdOnPage,
      });

      /* 
        Gets questionnaires on next page based on lastQuestionnaireOnPage
        Only finds questionnaires that meet the search conditions (e.g. owner name matching `owner` search field)
        Uses `lt` (less than) or `gt` (greater than) to find questionnaires created before or after lastQuestionnaireOnPage (based on `sortBy`) meeting the conditions, 
        sorts from most recently created or earliest created first (based on `sortBy`), and limits to `resultsPerPage` number of questionnaires
      */
      questionnairesQuery = questionnairesCollection.aggregate([
        // From the `users` collection, gets the owner (based on `createdBy`) of each questionnaire by performing a join to match questionnaire `createdBy` with user `id`
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "id",
            as: "owner",
          },
        },
        {
          $match: {
            // Searches for questionnaires created before or after lastQuestionnaireOnPage (based on `sortBy`) AND meeting all the search conditions from `matchQuery`
            $and: [
              {
                createdAt:
                  sortBy === "createdDateDesc"
                    ? { $lt: lastQuestionnaireOnPage.createdAt }
                    : { $gt: lastQuestionnaireOnPage.createdAt },
              },
              matchQuery,
            ],
          },
        },
        {
          $sort: { createdAt: sortBy === "createdDateDesc" ? -1 : 1 }, // Sorts by either most recently created first or earliest created first based on `sortBy`
        },
        {
          $limit: resultsPerPage,
        },
      ]);
    } else {
      logger.error(
        { input },
        "Invalid input - received both firstQuestionnaireIdOnPage and lastQuestionnaireIdOnPage, expected only one of these values or neither (from listFilteredQuestionnaires)"
      );
      return;
    }

    const questionnaires = await questionnairesQuery.toArray();

    if (questionnaires.length === 0) {
      logger.debug(
        `No questionnaires found with input: ${JSON.stringify(
          input
        )} (from listFilteredQuestionnaires)`
      );
      return [];
    }

    // Adds empty `editors` to each questionnaire if it does not already have `editors`, otherwise uses existing `editors`
    let transformedQuestionnaires = questionnaires.map((questionnaire) => ({
      ...questionnaire,
      editors: questionnaire.editors || [],
    }));

    /* 
      Sorts questionnaires by most recently created first if firstQuestionnaireIdOnPage is provided without lastQuestionnaireIdOnPage 
      This condition's query previously sorted in reverse order to get the `resultsPerPage` number of questionnaires created after or before firstQuestionnaireOnPage
      This ensures questionnaires are displayed in the correct order (based on `sortBy`) in this condition
    */
    if (firstQuestionnaireIdOnPage && !lastQuestionnaireIdOnPage) {
      if (sortBy === "createdDateDesc") {
        transformedQuestionnaires = transformedQuestionnaires.sort((a, b) =>
          a.createdAt > b.createdAt ? -1 : 1
        );
      } else {
        transformedQuestionnaires = transformedQuestionnaires.sort((a, b) =>
          a.createdAt > b.createdAt ? 1 : -1
        );
      }
    }

    return transformedQuestionnaires;
  } catch (error) {
    logger.error(
      { error: error.stack, input },
      "Unable to retrieve questionnaires (from listFilteredQuestionnaires)"
    );
    return;
  }
};

const getTotalFilteredQuestionnaires = async (input = {}, ctx) => {
  try {
    // Gets the questionnaires collection
    const questionnairesCollection = dbo.collection("questionnaires");

    const matchQuery = await getMatchQuery(input, ctx);

    // Gets the total number of questionnaires that meet the search conditions
    const aggregationResult = await questionnairesCollection
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "id",
            as: "owner",
          },
        },
        {
          $match: matchQuery,
        },
        {
          $count: "totalFilteredQuestionnaires",
        },
      ])
      .next();

    // Sets default `totalFilteredQuestionnaires` to 0 if no questionnaires are returned - prevents error when destructuring `totalFilteredQuestionnaires` with no results
    const { totalFilteredQuestionnaires = 0 } = aggregationResult || {};

    return totalFilteredQuestionnaires;
  } catch (error) {
    logger.error(
      { error: error.stack, input },
      "Unable to get total filtered questionnaires (from getTotalFilteredQuestionnaires)"
    );
    return;
  }
};

const getTotalPages = async (input = {}, ctx) => {
  try {
    const { resultsPerPage = 10 } = input;

    const totalFilteredQuestionnaires = await getTotalFilteredQuestionnaires(
      input,
      ctx
    );

    // Calculates the total number of pages by dividing the total number of filtered questionnaires by the number of results per page, and rounding up
    const totalPages = Math.ceil(totalFilteredQuestionnaires / resultsPerPage);

    return totalPages;
  } catch (error) {
    logger.error(
      { error: error.stack, input },
      "Unable to get total pages (from getTotalPages)"
    );
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
  listFilteredQuestionnaires,
  getTotalFilteredQuestionnaires,
  getTotalPages,
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
