const mockQuestionnaire = require("./mock-questionnaire");
const { noteCreationEvent } = require("../../utils/questionnaireEvents");
const { v4: uuidv4 } = require("uuid");

describe("MongoDB Datastore", () => {
  let questionnaire, user, firstUser, mockComment, ctx;
  let mongoDB;
  jest.isolateModules(() => {
    mongoDB = require("./datastore-mongodb");
  });
  beforeAll(() => {
    jest.resetModules();
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

    it("Should not throw error on listFilteredQuestionnaires", async () => {
      expect(() => mongoDB.listFilteredQuestionnaires({}, ctx)).not.toThrow();
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
        await mongoDB.createQuestionnaire(
          mockQuestionnaire({
            title: "Test questionnaire 5",
            ownerId: "user-2",
            createdAt: new Date(2021, 2, 25, 5, 0, 0, 0),
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

        expect(listOfQuestionnaires.length).toBe(4);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 1");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 4");
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
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 4");
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

        expect(listOfQuestionnaires.length).toBe(6);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 4");
        // Questionnaires created in previous tests
        expect(listOfQuestionnaires[3].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[4].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[5].title).toEqual(
          "Default questionnaire title"
        );
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
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 1");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 2");
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
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 4");
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

        expect(listOfQuestionnaires.length).toBe(7);
        expect(listOfQuestionnaires[0].title).toEqual("Test questionnaire 1");
        expect(listOfQuestionnaires[1].title).toEqual("Test questionnaire 2");
        expect(listOfQuestionnaires[2].title).toEqual("Test questionnaire 3");
        expect(listOfQuestionnaires[3].title).toEqual("Test questionnaire 4");
        // Questionnaires created in previous tests
        expect(listOfQuestionnaires[4].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[5].title).toEqual(
          "Default questionnaire title"
        );
        expect(listOfQuestionnaires[6].title).toEqual(
          "Default questionnaire title"
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
