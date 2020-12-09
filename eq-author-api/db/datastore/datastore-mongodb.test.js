const datastore = require("./datastore-mongodb");
const mockQuestionnnaire = require("./mock-questionnaire");
const { noteCreationEvent } = require("../../utils/questionnaireEvents");
const { v4: uuidv4 } = require("uuid");

describe("MongoDB Datastore", () => {
  let questionnaire, user, firstUser, mockComment, ctx;

  beforeEach(() => {
    questionnaire = mockQuestionnnaire();
    ctx = {
      user: {
        id: 123,
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
    it("Should not throw error on listQuestionnaires", async () => {
      expect(() => datastore.listQuestionnaires()).not.toThrow();
    });

    it("Should not throw error on createQuestionnaire", async () => {
      expect(() =>
        datastore.createQuestionnaire(questionnaire, ctx)
      ).not.toThrow();
    });

    it("Should not throw error on getQuestionnaire", async () => {
      expect(() => datastore.getQuestionnaire("567")).not.toThrow();
    });

    it("Should not throw error on getQuestionnaireMetaById ", async () => {
      expect(() => datastore.getQuestionnaireMetaById("567")).not.toThrow();
    });

    it("Should not throw error on saveQuestionnaire", async () => {
      expect(() => datastore.saveQuestionnaire(questionnaire)).not.toThrow();
    });

    it("Should not throw error on saveMetadata", async () => {
      questionnaire.id = "567";
      expect(() => datastore.saveMetadata(questionnaire)).not.toThrow();
    });

    it("Should not throw error on deleteQuestionnaire", async () => {
      expect(() => datastore.deleteQuestionnaire("567")).not.toThrow();
    });

    it("Should not throw error on listUsers", async () => {
      expect(() => datastore.listUsers()).not.toThrow();
    });

    it("Should not throw error on createUser", async () => {
      expect(() => datastore.createUser(user)).not.toThrow();
    });

    it("Should not throw error on getUserByExternalId", async () => {
      expect(() => datastore.deleteQuestionnaire("567")).not.toThrow();
    });

    it("Should not throw error on getUserById", async () => {
      expect(() => datastore.getUserById("567")).not.toThrow();
    });

    it("Should not throw error on updateUser", async () => {
      expect(() => datastore.updateUser(user)).not.toThrow();
    });

    it("Should not throw error on createComments", async () => {
      expect(() => datastore.createComments("567")).not.toThrow();
    });

    it("Should not throw error on saveComments", async () => {
      expect(() =>
        datastore.saveComments({ questionnaireId: "567" })
      ).not.toThrow();
    });

    it("Should not throw error on getCommentsForQuestionnaire", async () => {
      expect(() => datastore.getCommentsForQuestionnaire("567")).not.toThrow();
    });

    it("Should not throw error on createHistoryEvent", async () => {
      expect(() => datastore.createHistoryEvent("567", {})).not.toThrow();
    });
  });

  describe("Main functions", () => {
    beforeAll(async () => {
      await datastore.connectDB();
    });

    describe("Getting a list of questionnaires when empty", () => {
      it("Should return an empty array if no questionnaires are found", async () => {
        const listOfQuestionnaires = await datastore.listQuestionnaires();
        expect(listOfQuestionnaires.length).toBe(0);
        expect(Array.isArray(listOfQuestionnaires)).toBeTruthy();
      });
    });

    describe("Creating a questionnaire", () => {
      it("Should give the questionnaire an ID if one is not given", async () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(questionnaire.id).toBeFalsy();
        const questionnaireFromDb = await datastore.createQuestionnaire(
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
        const questionnaireFromDb = await datastore.createQuestionnaire(
          questionnaire,
          ctx
        );
        expect(questionnaireFromDb.id).toMatch("123");
      });
    });

    describe("Getting the latest questionnaire version", () => {
      it("Should should handle when an ID is not provided", () => {
        expect(() => datastore.getQuestionnaire()).not.toThrow();
      });

      it("Should return null when it cannot find the questionnaire", async () => {
        const questionnaireFromDb = await datastore.getQuestionnaire("567");
        expect(questionnaireFromDb).toBeNull();
        expect(datastore.getQuestionnaire("567")).resolves.toBeNull();
      });

      it("Should transform Timestamps into JS Date objects", async () => {
        const questionnaireFromDb = await datastore.getQuestionnaire("123");
        expect(questionnaireFromDb.createdAt instanceof Date).toBeTruthy();
        expect(questionnaireFromDb.updatedAt instanceof Date).toBeTruthy();
      });

      it("Should get a questionnaire with missing section, metadata and editors", async () => {
        delete questionnaire.sections;
        delete questionnaire.metadata;
        delete questionnaire.editors;
        questionnaire.id = "456";
        await datastore.createQuestionnaire(questionnaire, ctx);
        const questionnaireFromDb = await datastore.getQuestionnaire("456");
        expect(questionnaireFromDb.id).toMatch("456");
      });
    });

    describe("Getting the base questionnaire", () => {
      it("Should handle when an ID is not provided", () => {
        expect(() => datastore.getQuestionnaireMetaById()).not.toThrow();
      });

      it("Should return null when it cannot find the questionnaire", async () => {
        const baseQuestionnaireFromDb = await datastore.getQuestionnaireMetaById(
          "567"
        );
        expect(baseQuestionnaireFromDb).toBeNull();
        expect(datastore.getQuestionnaire("567")).resolves.toBeNull();
      });

      it("Should transform Timestamps into JS Data objects", async () => {
        const baseQuestionnaireFromDb = await datastore.getQuestionnaireMetaById(
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
        expect(() => datastore.saveQuestionnaire(questionnaire)).not.toThrow();
      });

      it("Should update the 'updatedAt' property", async () => {
        const updatedAt = new Date();
        const savedQuestionnaire = await datastore.saveQuestionnaire({
          id: "123",
          updatedAt,
          ...questionnaire,
        });
        expect(updatedAt !== savedQuestionnaire.updatedAt).toBeTruthy();
      });
    });

    describe("Getting a list of questionnaires", () => {
      it("Should transform Timestamps into JS Date objects", async () => {
        const listOfQuestionnaires = await datastore.listQuestionnaires();

        expect(listOfQuestionnaires[0].updatedAt instanceof Date).toBeTruthy();
        expect(listOfQuestionnaires[0].createdAt instanceof Date).toBeTruthy();
      });
    });

    describe("Deleting a questionnaire", () => {
      it("Should handle when an ID has not been given", () => {
        expect(() => datastore.deleteQuestionnaire()).not.toThrow();
      });
    });

    describe("Getting a list of users", () => {
      it("Should return an empty array if no users are found", async () => {
        const listOfUsers = await datastore.listUsers();
        expect(listOfUsers.length).toBe(0);
        expect(Array.isArray(listOfUsers)).toBeTruthy();
      });
    });

    describe("Creating a user", () => {
      it("Should create a user with a provided id", async () => {
        const userFromDb = await datastore.createUser(firstUser);
        expect(userFromDb.id).toBeTruthy();
        expect(userFromDb.id).toMatch("999-999");
      });

      it("Should give the user an ID if one is not given", async () => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const userFromDb = await datastore.createUser(user);
        expect(userFromDb.id).toBeTruthy();
        expect(userFromDb.id).toMatch(uuidRegex);
      });

      it("Should use the email as the users name if one is not given", async () => {
        delete user.name;
        const userFromDb = await datastore.createUser(user);
        expect(userFromDb.name).toBeTruthy();
        expect(userFromDb.name).toMatch(userFromDb.email);
      });

      it("Should handle any errors that may occur", () => {
        delete user.email;
        expect(() => datastore.createUser(user)).not.toThrow();
      });
    });

    describe("Getting a user by their external ID", () => {
      it("Should handle when an ID is not provided", () => {
        expect(() => datastore.getUserByExternalId()).not.toThrow();
      });

      it("Should return nothing if the user cannot be found", async () => {
        const user = await datastore.getUserByExternalId("123");
        expect(user).toBeUndefined();
      });

      it("Should return the user from the externalId", async () => {
        const userFromDb = await datastore.getUserByExternalId(
          firstUser.externalId
        );
        expect(userFromDb.id).toBe(firstUser.id);
      });
    });

    describe("Getting a user by their ID", () => {
      it("Should handle when an ID is not provided", () => {
        expect(() => datastore.getUserById()).not.toThrow();
      });
      it("Should return nothing if the user cannot be found", async () => {
        const user = await datastore.getUserById("123");
        expect(user).toBeUndefined();
      });
      it("Should return user from the ID", async () => {
        const userFromDb = await datastore.getUserById(firstUser.id);
        expect(userFromDb.id).toBe(firstUser.id);
      });
    });

    describe("Getting a list of users 2", () => {
      it("Should use the Firestore document ID as the ID for each user", async () => {
        const usersFromDb = await datastore.listUsers();
        expect(usersFromDb[0].id).toBe(firstUser.id);
      });
    });

    describe("Updating a user", () => {
      it("Should handle not finding an ID within the given user object", () => {
        expect(() => datastore.updateUser(user)).not.toThrow();
      });
      it("Should return the updated user object", async () => {
        const changedUser = {
          ...user,
          name: "Harry James Potter",
          id: "999-999",
        };
        const userFromDb = await datastore.updateUser(changedUser);

        expect(userFromDb).toMatchObject(changedUser);
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
          datastore.createHistoryEvent(null, mockHistoryEvent)
        ).not.toThrow();
      });
      it("Should handle when an event has not been given", () => {
        expect(() => datastore.createHistoryEvent("123", null)).not.toThrow();
      });
      it("Should put the new history event at the front of the list", async () => {
        const questionnaireHistory = await datastore.createHistoryEvent(
          "123",
          mockHistoryEvent
        );

        expect(questionnaireHistory[0] === mockHistoryEvent).toBeTruthy();
      });
    });

    describe("Saving a base questionnaire", () => {
      it("Should handle when an ID cannot be found within the given base questionnaire", async () => {
        await expect(datastore.saveMetadata({})).rejects.toThrow();
      });

      it("Should update the 'updatedAt' property", async () => {
        const baseQuestionnaire = await datastore.getQuestionnaireMetaById(
          "123"
        );
        baseQuestionnaire.updatedAt = new Date();
        const updatedBaseQuestionnaire = await datastore.saveMetadata(
          baseQuestionnaire
        );

        expect(
          updatedBaseQuestionnaire.updatedAt !== baseQuestionnaire.updatedAt
        ).toBeTruthy();
      });
    });

    describe("Creating default comments", () => {
      it("Should handle when a questionnaireId has not been given", () => {
        expect(() => datastore.createComments()).not.toThrow();
      });
      it("Should return a default comments object", async () => {
        const commentsFromDb = await datastore.createComments("123");
        expect(commentsFromDb).toMatchObject({
          comments: {},
          questionnaireId: "123",
        });
      });
    });

    describe("Saving a comment", () => {
      it("Should handle a questionnaireId not being found within the given comments object", () => {
        expect(() =>
          datastore.saveComments({ comments: [mockComment] })
        ).not.toThrow();
      });
      it("Should return the questionnaire comments object", async () => {
        const mockCommentObj = {
          "123-456-789": [mockComment],
        };

        const commentsFromDb = await datastore.saveComments({
          questionnaireId: "123",
          comments: mockCommentObj,
        });
        expect(commentsFromDb).toMatchObject(mockCommentObj);
      });
    });

    describe("Getting the comments for a questionnaire", () => {
      it("Should handle when a questionnareId has not been given", () => {
        expect(() => datastore.getCommentsForQuestionnaire()).not.toThrow();
      });
      it("Should transform Firestore Timestamps into JS Date objects", async () => {
        const listOfComments = await datastore.getCommentsForQuestionnaire(
          "123"
        );
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
