const mockQuestionnaire = require("./mock-questionnaire");
const { noteCreationEvent } = require("../../utils/questionnaireEvents");
const { v4: uuidv4 } = require("uuid");

const mockLoggerDebug = jest.fn();
const mockLoggerInfo = jest.fn();
const mockLoggerError = jest.fn();

describe("MongoDB Datastore", () => {
  let questionnaire, user, firstUser, mockComment, ctx;
  let mongoDB;
  jest.isolateModules(() => {
    mongoDB = require("./datastore-mongodb");
  });

  jest.mock("../../utils/logger", () => ({
    logger: {
      debug: mockLoggerDebug,
      info: mockLoggerInfo,
      error: mockLoggerError,
    },
  }));

  beforeAll(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    questionnaire = mockQuestionnaire({});
    ctx = {
      user: {
        id: "user-1",
      },
    };
    user = {
      email: "harrypotter@hogwarts.ac.uk",
      name: "Harry Potter",
      externalId: "TheBoyWhoLived",
      picture: "",
    };
    firstUser = {
      id: "999-999",
      email: "firstperson@hogwarts.ac.uk",
      name: "A Man",
      externalId: "first-person",
      picture: "",
    };
    mockComment = {
      id: uuidv4(),
      commentText: "Oh I do like to be beside the seaside",
      userId: "123",
      createdTime: new Date(),
      editedTime: new Date(),
      replies: [
        {
          createdTime: new Date(),
          editedTime: new Date(),
        },
      ],
    };
  });

  describe("Error handling for failed DB connection", () => {
    it("Should throw error on connect to db", async () => {
      expect(() =>
        mongoDB.connectDB("BrokenConnectionString")
      ).rejects.toThrow();
    });

    it("Should not throw error on listQuestionnaires", async () => {
      expect(() => mongoDB.listQuestionnaires()).not.toThrow();
    });

    it("Should log error message without throwing error on listFilteredQuestionnaires", async () => {
      expect(() => mongoDB.listFilteredQuestionnaires({}, ctx)).not.toThrow();
      expect(mockLoggerError).toHaveBeenCalledWith(
        {
          error: expect.any(String),
          input: {},
        },
        "Unable to retrieve questionnaires (from listFilteredQuestionnaires)"
      );
    });

    it("Should log error message without throwing error on getTotalPages", async () => {
      expect(() => mongoDB.getTotalPages({}, ctx)).not.toThrow();
      expect(mockLoggerError).toHaveBeenCalledWith(
        {
          error: expect.any(String),
          input: {},
        },
        "Unable to get total pages (from getTotalPages)"
      );
    });

    it("Should not throw error on createQuestionnaire", async () => {
      expect(() =>
        mongoDB.createQuestionnaire(questionnaire, ctx)
      ).not.toThrow();
    });

    it("Should not throw error on getQuestionnaire", async () => {
      expect(() => mongoDB.getQuestionnaire("567")).not.toThrow();
    });

    it("Should not throw error on getQuestionnaireMetaById ", async () => {
      expect(() => mongoDB.getQuestionnaireMetaById("567")).not.toThrow();
    });

    it("Should not throw error on saveQuestionnaire", async () => {
      expect(() => mongoDB.saveQuestionnaire(questionnaire)).not.toThrow();
    });

    it("Should not throw error on saveMetadata", async () => {
      questionnaire.id = "567";
      expect(() => mongoDB.saveMetadata(questionnaire)).not.toThrow();
    });

    it("Should not throw error on deleteQuestionnaire", async () => {
      expect(() => mongoDB.deleteQuestionnaire("567")).not.toThrow();
    });

    it("Should not throw error on listUsers", async () => {
      expect(() => mongoDB.listUsers()).not.toThrow();
    });

    it("Should not throw error on createUser", async () => {
      expect(() => mongoDB.createUser(user)).not.toThrow();
    });

    it("Should not throw error on getUserByExternalId", async () => {
      expect(() => mongoDB.deleteQuestionnaire("567")).not.toThrow();
    });

    it("Should not throw error on getUserById", async () => {
      expect(() => mongoDB.getUserById("567")).not.toThrow();
    });

    it("Should not throw error on updateUser", async () => {
      expect(() => mongoDB.updateUser(user)).not.toThrow();
    });

    it("Should not throw error on createComments", async () => {
      expect(() => mongoDB.createComments("567")).not.toThrow();
    });

    it("Should not throw error on saveComments", async () => {
      expect(() =>
        mongoDB.saveComments({ questionnaireId: "567" })
      ).not.toThrow();
    });

    it("Should not throw error on getCommentsForQuestionnaire", async () => {
      expect(() => mongoDB.getCommentsForQuestionnaire("567")).not.toThrow();
    });

    it("Should not throw error on createHistoryEvent", async () => {
      expect(() => mongoDB.createHistoryEvent("567", {})).not.toThrow();
    });
  });

  describe("Main functions", () => {
    beforeAll(async () => {
      await mongoDB.connectDB();
    });

    describe("Getting a list of questionnaires when empty", () => {
      it("Should return an empty array if no questionnaires are found", async () => {
        const listOfQuestionnaires = await mongoDB.listQuestionnaires();
        expect(listOfQuestionnaires.length).toBe(0);
        expect(Array.isArray(listOfQuestionnaires)).toBeTruthy();
      });
    });

    describe("Creating a questionnaire", () => {
      it("Should give the questionnaire an ID if one is not given", async () => {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(questionnaire.id).toBeFalsy();
        const questionnaireFromDb = await mongoDB.createQuestionnaire(
          questionnaire,
          ctx
        );
        expect(questionnaire.id).toBeTruthy();
        expect(questionnaireFromDb.id).toMatch(uuidRegex);
      });

      it("Should leave the questionnaire ID as is if one is given", async () => {
        expect(questionnaire.id).toBeFalsy();
        questionnaire.id = "123";
        expect(questionnaire.id).toBeTruthy();
        const questionnaireFromDb = await mongoDB.createQuestionnaire(
          questionnaire,
          ctx
        );
        expect(questionnaireFromDb.id).toMatch("123");
      });
    });

    describe("Getting the latest questionnaire version", () => {
      it("Should should handle when an ID is not provided", () => {
        expect(() => mongoDB.getQuestionnaire()).not.toThrow();
      });

      it("Should return null when it cannot find the questionnaire", async () => {
        const questionnaireFromDb = await mongoDB.getQuestionnaire("567");
        expect(questionnaireFromDb).toBeNull();
        expect(mongoDB.getQuestionnaire("567")).resolves.toBeNull();
      });

      it("Should transform Timestamps into JS Date objects", async () => {
        const questionnaireFromDb = await mongoDB.getQuestionnaire("123");
        expect(questionnaireFromDb.createdAt instanceof Date).toBeTruthy();
        expect(questionnaireFromDb.updatedAt instanceof Date).toBeTruthy();
      });

      it("Should get a questionnaire with missing section, metadata and editors", async () => {
        delete questionnaire.sections;
        delete questionnaire.metadata;
        delete questionnaire.editors;
        questionnaire.id = "456";
        await mongoDB.createQuestionnaire(questionnaire, ctx);
        const questionnaireFromDb = await mongoDB.getQuestionnaire("456");
        expect(questionnaireFromDb.id).toMatch("456");
      });
    });

    describe("Getting the base questionnaire", () => {
      it("Should handle when an ID is not provided", () => {
        expect(() => mongoDB.getQuestionnaireMetaById()).not.toThrow();
      });

      it("Should return null when it cannot find the questionnaire", async () => {
        const baseQuestionnaireFromDb = await mongoDB.getQuestionnaireMetaById(
          "567"
        );
        expect(baseQuestionnaireFromDb).toBeNull();
        expect(mongoDB.getQuestionnaire("567")).resolves.toBeNull();
      });

      it("Should transform Timestamps into JS Data objects", async () => {
        const baseQuestionnaireFromDb = await mongoDB.getQuestionnaireMetaById(
          "123"
        );

        expect(baseQuestionnaireFromDb.createdAt instanceof Date).toBeTruthy();
        expect(baseQuestionnaireFromDb.updatedAt instanceof Date).toBeTruthy();
        expect(
          baseQuestionnaireFromDb.history[0].time instanceof Date
        ).toBeTruthy();
      });
    });

    describe("Saving a questionnaire", () => {
      it("Should handle when an ID cannot be found within the given questionnaire", () => {
        expect(() => mongoDB.saveQuestionnaire(questionnaire)).not.toThrow();
      });

      it("Should update the 'updatedAt' property", async () => {
        const updatedAt = new Date();
        const savedQuestionnaire = await mongoDB.saveQuestionnaire({
          id: "123",
          updatedAt,
          ...questionnaire,
        });
        expect(updatedAt !== savedQuestionnaire.updatedAt).toBeTruthy();
      });
    });

    describe("Getting a list of questionnaires", () => {
      it("Should transform Timestamps into JS Date objects", async () => {
        const listOfQuestionnaires = await mongoDB.listQuestionnaires();

        expect(listOfQuestionnaires[0].updatedAt instanceof Date).toBeTruthy();
        expect(listOfQuestionnaires[0].createdAt instanceof Date).toBeTruthy();
      });
    });

    describe("Deleting a questionnaire", () => {
      it("Should handle when an ID has not been given", () => {
        expect(() => mongoDB.deleteQuestionnaire()).not.toThrow();
      });
    });

    describe("Getting a list of users", () => {
      it("Should return an empty array if no users are found", async () => {
        const listOfUsers = await mongoDB.listUsers();
        expect(listOfUsers.length).toBe(0);
        expect(Array.isArray(listOfUsers)).toBeTruthy();
      });
    });

    describe("Creating a user", () => {
      it("Should create a user with a provided id", async () => {
        const userFromDb = await mongoDB.createUser(firstUser);
        expect(userFromDb.id).toBeTruthy();
        expect(userFromDb.id).toMatch("999-999");
        expect(userFromDb.updatedAt instanceof Date).toBeTruthy();
      });

      it("Should give the user an ID if one is not given", async () => {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const userFromDb = await mongoDB.createUser(user);
        expect(userFromDb.id).toBeTruthy();
        expect(userFromDb.id).toMatch(uuidRegex);
      });

      it("Should use the email as the users name if one is not given", async () => {
        delete user.name;
        const userFromDb = await mongoDB.createUser(user);
        expect(userFromDb.name).toBeTruthy();
        expect(userFromDb.name).toMatch(userFromDb.email);
      });

      it("Should handle any errors that may occur", () => {
        delete user.email;
        expect(() => mongoDB.createUser(user)).not.toThrow();
      });
    });

    describe("Getting a user by their external ID", () => {
      it("Should handle when an ID is not provided", () => {
        expect(() => mongoDB.getUserByExternalId()).not.toThrow();
      });

      it("Should return nothing if the user cannot be found", async () => {
        const user = await mongoDB.getUserByExternalId("123");
        expect(user).toBeUndefined();
      });

      it("Should return the user from the externalId", async () => {
        const userFromDb = await mongoDB.getUserByExternalId(
          firstUser.externalId
        );
        expect(userFromDb.id).toBe(firstUser.id);
      });
    });

    describe("Getting a user by their ID", () => {
      it("Should handle when an ID is not provided", () => {
        expect(() => mongoDB.getUserById()).not.toThrow();
      });
      it("Should return nothing if the user cannot be found", async () => {
        const user = await mongoDB.getUserById("123");
        expect(user).toBeUndefined();
      });
      it("Should return user from the ID", async () => {
        const userFromDb = await mongoDB.getUserById(firstUser.id);
        expect(userFromDb.id).toBe(firstUser.id);
      });
    });

    describe("Getting a list of users 2", () => {
      it("Should use the Firestore document ID as the ID for each user", async () => {
        const usersFromDb = await mongoDB.listUsers();
        expect(usersFromDb[0].id).toBe(firstUser.id);
      });
    });

    describe("Updating a user", () => {
      it("Should handle not finding an ID within the given user object", () => {
        expect(() => mongoDB.updateUser(user)).not.toThrow();
      });
      it("Should return the updated user object", async () => {
        const changedUser = {
          ...user,
          name: "Harry James Potter",
          id: "999-999",
        };
        const userFromDb = await mongoDB.updateUser(changedUser);
        expect(userFromDb.updatedAt instanceof Date).toBeTruthy();

        expect(userFromDb).toMatchObject(changedUser);
      });
    });

    describe("Getting a list of filtered questionnaires", () => {
      beforeAll(async () => {
        await mongoDB.createUser({
          id: "user-1",
          email: "user1@example.com",
          name: "Joe Bloggs",
          externalId: "user-1",
          picture: "",
        });

        await mongoDB.createUser({
          id: "user-2",
          email: "user2@example.com",
          name: "Jane Smith",
          externalId: "user-2",
          picture: "",
        });

        await mongoDB.createUser({
          id: "test-user",
          email: "test-user@example.com",
          name: "Test User",
          externalId: "test-user",
          picture: "",
        });

        await mongoDB.createQuestionnaire(
          mockQuestionnaire({
            title: "Test questionnaire 1",
            ownerId: "user-1",
            createdAt: new Date(2021, 2, 5, 5, 0, 0, 0),
          }),
          ctx
        );
        await mongoDB.createQuestionnaire(
          mockQuestionnaire({
            title: "Test questionnaire 2",
            ownerId: "user-1",
            createdAt: new Date(2021, 2, 10, 5, 0, 0, 0),
          }),
          ctx
        );
        await mongoDB.createQuestionnaire(
          mockQuestionnaire({
            title: "Test questionnaire 3",
            ownerId: "user-2",
            editors: ["user-1"],
            createdAt: new Date(2021, 2, 15, 5, 0, 0, 0),
          }),
          ctx
        );
        await mongoDB.createQuestionnaire(
          mockQuestionnaire({
            title: "Test questionnaire 4",
            ownerId: "user-2",
            createdAt: new Date(2021, 2, 20, 5, 0, 0, 0),
          }),
          ctx
        );
        // ** "Test questionnaire 5" is not included in several test assertions as it is not public and `ctx.user` is not owner/editor
        await mongoDB.createQuestionnaire(
          mockQuestionnaire({
            title: "Test questionnaire 5",
            ownerId: "user-2",
            createdAt: new Date(2021, 2, 25, 5, 0, 0, 0),
            isPublic: false,
          }),
          ctx
        );
        await mongoDB.createQuestionnaire(
          mockQuestionnaire({
            title: "Test questionnaire 6",
            ownerId: "user-1",
            createdAt: new Date(2021, 2, 30, 5, 0, 0, 0),
            isPublic: false,
          }),
          ctx
        );
      });

      it("Should return questionnaires with title containing the search term", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "Test questionnaire",
            owner: "",
            access: "All",
            resultsPerPage: 10,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(5);
        // "Test questionnaire 6" is first as default sort is newest to oldest
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 6");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 4");
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[4].title).toEqual("Test questionnaire 1");
      });

      it("Should return questionnaires with owner containing the `owner` search term", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "Jane",
            access: "All",
            resultsPerPage: 10,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(2);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 4");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 3");
      });

      it("Should return questionnaires created on or after the searched date", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            createdOnOrAfter: new Date(2021, 2, 10),
            access: "All",
            resultsPerPage: 10,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(7);
        /* 
          Questionnaires with titles "Default questionnaire title" are created in previous tests.
          These appear first when sorted by newest to oldest as their `createdAt` dates are most recent.
        */
        expect(listOfQuestionnaires[0].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[1].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[2].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[6].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[5].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[4].title).toEqual("Test questionnaire 4");
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 6");
      });

      it("Should return questionnaires created on or before the searched date", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            createdOnOrBefore: new Date(2021, 2, 10),
            access: "All",
            resultsPerPage: 10,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(2);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 1");
      });

      it("Should return questionnaires created between the searched dates", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            createdOnOrAfter: new Date(2021, 2, 10),
            createdOnOrBefore: new Date(2021, 2, 20),
            access: "All",
            resultsPerPage: 10,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(3);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 4");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 2");
      });

      it("Should return relevant questionnaires when searching by access `All`", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "All",
            resultsPerPage: 10,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(8);
        /* 
          Questionnaires with titles "Default questionnaire title" are created in previous tests.
          These appear first when sorted by newest to oldest as their `createdAt` dates are most recent.
        */
        expect(listOfQuestionnaires[0].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[1].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[2].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 6");
        expect(listOfQuestionnaires[4].title).toEqual("Test questionnaire 4");
        expect(listOfQuestionnaires[5].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[6].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[7].title).toEqual("Test questionnaire 1");
      });

      it("Should return relevant questionnaires when searching by access `Editor`", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "Editor",
            resultsPerPage: 10,
          },
          ctx
        );

        // Expects all questionnaires where `ctx.user` is the owner (`ctx.user` created the questionnaire) or an editor
        expect(listOfQuestionnaires.length).toBe(4);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 6"); // "user-1" created the questionnaire
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 3"); // "user-1" is an editor
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 2"); // "user-1" created the questionnaire
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 1"); // "user-1" created the questionnaire
      });

      it("Should return relevant questionnaires when searching by access `ViewOnly`", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "ViewOnly",
            resultsPerPage: 10,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(4);
        /* 
          Questionnaires with titles "Default questionnaire title" are created in previous tests.
          These appear first when sorted by newest to oldest as their `createdAt` dates are most recent.
        */
        expect(listOfQuestionnaires[0].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[1].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[2].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 4");
      });

      it("Should return relevant questionnaires when searching by access `PrivateQuestionnaires`", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "PrivateQuestionnaires",
            resultsPerPage: 10,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(1);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 6");
      });

      it("Should return relevant questionnaires when `myQuestionnaires` is true", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "All",
            resultsPerPage: 10,
            myQuestionnaires: true,
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(4);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 6");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 1");
      });

      it("Should return questionnaires on previous page when `firstQuestionnaireIdOnPage` is provided without `lastQuestionnaireIdOnPage`", async () => {
        // Gets questionnaires with "All" access to get a questionnaire ID to use as `firstQuestionnaireIdOnPage`
        const allQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "All",
            resultsPerPage: 10,
          },
          ctx
        );

        const listOfPreviousPageQuestionnaires =
          await mongoDB.listFilteredQuestionnaires(
            {
              search: "",
              owner: "",
              access: "All",
              resultsPerPage: 2, // Limits to 2 questionnaires per page to test a small number of questionnaires on previous page
              firstQuestionnaireIdOnPage: allQuestionnaires[6].id,
            },
            ctx
          );

        expect(listOfPreviousPageQuestionnaires.length).toBe(2);
        // The two questionnaires before the first questionnaire on the page (based on firstQuestionnaireIdOnPage)
        expect(listOfPreviousPageQuestionnaires[0].title).toEqual(
          "Test questionnaire 4"
        );
        expect(listOfPreviousPageQuestionnaires[1].title).toEqual(
          "Test questionnaire 3"
        );
      });

      it("Should return questionnaires on next page when `lastQuestionnaireIdOnPage` is provided without `firstQuestionnaireIdOnPage`", async () => {
        // Gets questionnaires with "All" access to get a questionnaire ID to use as `lastQuestionnaireIdOnPage`
        const allQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "All",
            resultsPerPage: 10,
          },
          ctx
        );

        const listOfNextPageQuestionnaires =
          await mongoDB.listFilteredQuestionnaires(
            {
              search: "",
              owner: "",
              access: "All",
              resultsPerPage: 2, // Limits to 2 questionnaires per page to test a small number of questionnaires on next page
              lastQuestionnaireIdOnPage: allQuestionnaires[3].id,
            },
            ctx
          );

        expect(listOfNextPageQuestionnaires.length).toBe(2);
        // The two questionnaires after the last questionnaire on the page (based on lastQuestionnaireIdOnPage)
        expect(listOfNextPageQuestionnaires[0].title).toEqual(
          "Test questionnaire 4"
        );
        expect(listOfNextPageQuestionnaires[1].title).toEqual(
          "Test questionnaire 3"
        );
      });

      it("Should log an error message when both `firstQuestionnaireIdOnPage` and `lastQuestionnaireIdOnPage` are provided", async () => {
        const listFilteredQuestionnairesInput = {
          search: "",
          owner: "",
          access: "All",
          resultsPerPage: 10,
          firstQuestionnaireIdOnPage: "123",
          lastQuestionnaireIdOnPage: "456",
        };

        await mongoDB.listFilteredQuestionnaires(
          listFilteredQuestionnairesInput,
          ctx
        );

        expect(mockLoggerError).toHaveBeenCalledTimes(1);
        expect(mockLoggerError).toHaveBeenCalledWith(
          {
            input: listFilteredQuestionnairesInput,
          },
          "Invalid input - received both firstQuestionnaireIdOnPage and lastQuestionnaireIdOnPage, expected only one of these values or neither (from listFilteredQuestionnaires)"
        );
      });

      it("Should log a debug message when no questionnaires are found", async () => {
        const listFilteredQuestionnairesInput = {
          search: "Lorem ipsum", // Search term contained in no questionnaires
          owner: "",
          access: "All",
          resultsPerPage: 10,
        };

        // `listOfQuestionnaires` should be an empty array as no questionnaires contain the search term
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          listFilteredQuestionnairesInput,
          ctx
        );

        expect(mockLoggerDebug).toHaveBeenCalledTimes(1);
        expect(mockLoggerDebug).toHaveBeenCalledWith(
          `No questionnaires found with input: ${JSON.stringify(
            listFilteredQuestionnairesInput
          )} (from listFilteredQuestionnaires)`
        );
        expect(listOfQuestionnaires).toEqual([]);
      });

      it("Should sort questionnaires on first page from oldest to newest when `sortBy` is `createdDateAsc`", async () => {
        const listOfQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "All",
            resultsPerPage: 10,
            sortBy: "createdDateAsc",
          },
          ctx
        );

        expect(listOfQuestionnaires.length).toBe(8);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 1");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 4");
        expect(listOfQuestionnaires[4].title).toEqual("Test questionnaire 6");
        /* 
          Questionnaires with titles "Default questionnaire title" are created in previous tests.
          These appear last when sorted by oldest to newest as their `createdAt` dates are most recent.
        */
        expect(listOfQuestionnaires[5].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[6].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[7].title).toEqual(
          "Default questionnaire title"
        );
      });

      it("Should sort questionnaires on previous page from oldest to newest when `sortBy` is `createdDateAsc`", async () => {
        // Gets questionnaires with "All" access to get a questionnaire ID to use as `firstQuestionnaireIdOnPage`
        const allQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "All",
            resultsPerPage: 10,
            sortBy: "createdDateAsc",
          },
          ctx
        );

        const listOfPreviousPageQuestionnaires =
          await mongoDB.listFilteredQuestionnaires(
            {
              search: "",
              owner: "",
              access: "All",
              resultsPerPage: 2,
              firstQuestionnaireIdOnPage: allQuestionnaires[4].id,
              sortBy: "createdDateAsc",
            },
            ctx
          );

        expect(listOfPreviousPageQuestionnaires.length).toBe(2);
        // The two questionnaires before the first questionnaire on the page (based on firstQuestionnaireIdOnPage)
        expect(listOfPreviousPageQuestionnaires[0].title).toEqual(
          "Test questionnaire 3"
        );
        expect(listOfPreviousPageQuestionnaires[1].title).toEqual(
          "Test questionnaire 4"
        );
      });

      it("Should sort questionnaires on next page from oldest to newest when `sortBy` is `createdDateAsc`", async () => {
        // Gets questionnaires with "All" access to get a questionnaire ID to use as `lastQuestionnaireIdOnPage`
        const allQuestionnaires = await mongoDB.listFilteredQuestionnaires(
          {
            search: "",
            owner: "",
            access: "All",
            resultsPerPage: 10,
            sortBy: "createdDateAsc",
          },
          ctx
        );

        const listOfNextPageQuestionnaires =
          await mongoDB.listFilteredQuestionnaires(
            {
              search: "",
              owner: "",
              access: "All",
              resultsPerPage: 2,
              lastQuestionnaireIdOnPage: allQuestionnaires[1].id,
              sortBy: "createdDateAsc",
            },
            ctx
          );

        expect(listOfNextPageQuestionnaires.length).toBe(2);
        // The two questionnaires after the last questionnaire on the page (based on lastQuestionnaireIdOnPage)
        expect(listOfNextPageQuestionnaires[0].title).toEqual(
          "Test questionnaire 3"
        );
        expect(listOfNextPageQuestionnaires[1].title).toEqual(
          "Test questionnaire 4"
        );
      });
    });

    describe("Getting total page count", () => {
      it("Should get the total number of pages based on the number of questionnaires and results per page", async () => {
        const totalPageCount = await mongoDB.getTotalPages(
          {
            resultsPerPage: 3, // As 8 questionnaires should be returned (from previously created questionnaires), uses 3 questionnaires per page to test total page count is rounded up
            search: "",
            owner: "",
            access: "All",
          },
          ctx
        );

        expect(totalPageCount).toBe(3); // (8 questionnaires) / (3 results per page) gives 3 total pages after rounding up
      });

      it("Should return 0 when no questionnaires are found", async () => {
        const totalPageCount = await mongoDB.getTotalPages(
          {
            resultsPerPage: 10,
            search: "Lorem ipsum", // Search term contained in no questionnaires
            owner: "",
            access: "All",
          },
          ctx
        );

        expect(mockLoggerError).not.toHaveBeenCalled();
        expect(totalPageCount).toBe(0);
      });

      it("Should log an error message on exception", async () => {
        await mongoDB.getTotalPages(); // No arguments to trigger exception

        // Two calls as `getMatchQuery` also throws an error due to no context object
        expect(mockLoggerError).toHaveBeenCalledTimes(2);
        expect(mockLoggerError).toHaveBeenCalledWith(
          {
            input: {},
            error: expect.any(String),
          },
          "Unable to get match query for filtering questionnaires (from getMatchQuery)"
        );
        expect(mockLoggerError).toHaveBeenCalledWith(
          {
            input: {},
            error: expect.any(String),
          },
          "Unable to get total pages (from getTotalPages)"
        );
      });
    });

    describe("Creating a history event", () => {
      let mockHistoryEvent;
      beforeEach(() => {
        mockHistoryEvent = noteCreationEvent(
          {
            ...ctx,
            questionnaire,
            user: { ...user, id: "123" },
          },
          "He defeated the dark lord!"
        );
      });
      it("Should handle when a qid has not been given", () => {
        expect(() =>
          mongoDB.createHistoryEvent(null, mockHistoryEvent)
        ).not.toThrow();
      });
      it("Should handle when an event has not been given", () => {
        expect(() => mongoDB.createHistoryEvent("123", null)).not.toThrow();
      });
      it("Should put the new history event at the front of the list", async () => {
        const questionnaireHistory = await mongoDB.createHistoryEvent(
          "123",
          mockHistoryEvent
        );

        expect(questionnaireHistory[0] === mockHistoryEvent).toBeTruthy();
      });
    });

    describe("Saving a base questionnaire", () => {
      it("Should handle when an ID cannot be found within the given base questionnaire", async () => {
        await expect(mongoDB.saveMetadata({})).rejects.toThrow();
      });

      it("Should update the 'updatedAt' property", async () => {
        const baseQuestionnaire = await mongoDB.getQuestionnaireMetaById("123");
        baseQuestionnaire.updatedAt = new Date();
        const updatedBaseQuestionnaire = await mongoDB.saveMetadata(
          baseQuestionnaire
        );

        expect(
          updatedBaseQuestionnaire.updatedAt !== baseQuestionnaire.updatedAt
        ).toBeTruthy();
      });
    });

    describe("Creating default comments", () => {
      it("Should handle when a questionnaireId has not been given", () => {
        expect(() => mongoDB.createComments()).not.toThrow();
      });
      it("Should return a default comments object", async () => {
        const commentsFromDb = await mongoDB.createComments("123");
        expect(commentsFromDb).toMatchObject({
          comments: {},
          questionnaireId: "123",
        });
      });
    });

    describe("Saving a comment", () => {
      it("Should handle a questionnaireId not being found within the given comments object", () => {
        expect(() =>
          mongoDB.saveComments({ comments: [mockComment] })
        ).not.toThrow();
      });
      it("Should return the questionnaire comments object", async () => {
        const mockCommentObj = {
          "123-456-789": [mockComment],
        };

        const commentsFromDb = await mongoDB.saveComments({
          questionnaireId: "123",
          comments: mockCommentObj,
        });
        expect(commentsFromDb).toMatchObject(mockCommentObj);
      });
    });

    describe("Getting the comments for a questionnaire", () => {
      it("Should handle when a questionnareId has not been given", () => {
        expect(() => mongoDB.getCommentsForQuestionnaire()).not.toThrow();
      });
      it("Should transform Firestore Timestamps into JS Date objects", async () => {
        const listOfComments = await mongoDB.getCommentsForQuestionnaire("123");
        expect(
          listOfComments.comments["123-456-789"][0].createdTime instanceof Date
        ).toBeTruthy();
        expect(
          listOfComments.comments["123-456-789"][0].replies[0]
            .createdTime instanceof Date
        ).toBeTruthy();
        expect(
          listOfComments.comments["123-456-789"][0].editedTime instanceof Date
        ).toBeTruthy();
        expect(
          listOfComments.comments["123-456-789"][0].replies[0]
            .editedTime instanceof Date
        ).toBeTruthy();
      });
    });
  });
});
