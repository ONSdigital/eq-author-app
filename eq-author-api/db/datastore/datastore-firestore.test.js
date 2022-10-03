const { Firestore } = require("@google-cloud/firestore");
const {
  createQuestionnaire,
  getQuestionnaire,
  getQuestionnaireMetaById,
  saveQuestionnaire,
  listQuestionnaires,
  deleteQuestionnaire,
  createUser,
  getUserByExternalId,
  getUserById,
  listUsers,
  createHistoryEvent,
  saveMetadata,
  createComments,
  getCommentsForQuestionnaire,
  saveComments,
  updateUser,
  connectDB,
} = require("./datastore-firestore");
const { v4: uuidv4 } = require("uuid");

const { noteCreationEvent } = require("../../utils/questionnaireEvents");

jest.mock("@google-cloud/firestore", () => {
  class Firestore {
    constructor(projectId) {
      this.projectId = projectId;
    }
  }

  Firestore.prototype = {};
  Firestore.prototype.collection = jest.fn(() => new Firestore());
  Firestore.prototype.doc = (id) => {
    if (!id) {
      throw new Error("ID not provided");
    }
    return new Firestore();
  };
  Firestore.prototype.set = jest.fn(() => new Firestore());
  Firestore.prototype.update = jest.fn(() => new Firestore());
  Firestore.prototype.orderBy = jest.fn(() => new Firestore());
  Firestore.prototype.where = jest.fn(() => new Firestore());
  Firestore.prototype.limit = jest.fn(() => new Firestore());
  Firestore.prototype.get = jest.fn(() => ({
    empty: true,
    docs: [],
  }));

  return {
    Firestore,
  };
});

describe("Firestore Datastore", () => {
  let questionnaireWithoutSections,
    questionnaire,
    sections,
    baseQuestionnaire,
    user,
    ctx;

  beforeAll(connectDB);

  beforeEach(() => {
    baseQuestionnaire = {
      isPublic: true,
      title: "Working from home",
      createdBy: "123",
      createdAt: {
        toDate: () => new Date(),
      },
      updatedAt: {
        toDate: () => new Date(),
      },
      history: [
        {
          time: {
            toDate: () => new Date(),
          },
        },
      ],
      type: "Social",
      shortTitle: "",
      publishStatus: "Unpublished",
      introduction: {},
      editors: [],
    };

    questionnaireWithoutSections = {
      ...baseQuestionnaire,
      theme: "default",
      legalBasis: "Voluntary",
      navigation: false,
      metadata: [],
      summary: false,
      version: 13,
      surveyVersion: 1,
    };

    sections = [
      {
        id: uuidv4(),
        title: "",
        introductionEnabled: false,
        position: 0,
        folders: [
          {
            id: "123",
            pages: [
              {
                id: uuidv4(),
                pageType: "QuestionPage",
                title: "",
                description: "",
                descriptionEnabled: false,
                guidanceEnabled: false,
                definitionEnabled: false,
                additionalInfoEnabled: false,
                answers: [],
                routing: null,
                alias: null,
              },
            ],
          },
        ],
        alias: "",
      },
    ];

    questionnaire = {
      ...questionnaireWithoutSections,
      sections,
    };

    user = {
      email: "harrypotter@hogwarts.ac.uk",
      name: "Harry Potter",
      externalId: "TheBoyWhoLived",
      picture: "",
    };

    ctx = {
      user: {
        id: 123,
      },
    };
  });

  afterEach(() => {
    Firestore.prototype.get.mockImplementation(() => ({
      empty: true,
      docs: [],
    }));
  });

  describe("Creating a questionnaire", () => {
    it("Should give the questionnaire an ID if one is not given", async () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(questionnaire.id).toBeFalsy();
      const questionnaireFromDb = await createQuestionnaire(questionnaire, ctx);
      expect(questionnaireFromDb.id).toMatch(uuidRegex);
    });

    it("Should leave the questionnaire ID as is if one is given", async () => {
      expect(questionnaire.id).toBeFalsy();
      questionnaire.id = "123";
      expect(questionnaire.id).toBeTruthy();
      const questionnaireFromDb = await createQuestionnaire(questionnaire, ctx);
      expect(questionnaireFromDb.id).toMatch("123");
    });
  });

  describe("Getting the latest questionnaire version", () => {
    it("Should should handle when an ID is not provided", () => {
      expect(() => getQuestionnaire()).not.toThrow();
    });

    it("Should return null when it cannot find the questionnaire", async () => {
      const questionnaireFromDb = await getQuestionnaire("123");
      expect(questionnaireFromDb).toBeNull();
      expect(getQuestionnaire("123")).resolves.toBeNull();
    });

    it("Should transform Firestore Timestamps into JS Date objects", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [{ data: () => questionnaire }],
      }));
      const questionnaireFromDb = await getQuestionnaire("123");

      expect(questionnaireFromDb.createdAt instanceof Date).toBeTruthy();
      expect(questionnaireFromDb.updatedAt instanceof Date).toBeTruthy();
    });

    it("Should reconstruct sections from subcollection if present", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          {
            data: () => questionnaireWithoutSections,
            ref: {
              collection: () => ({
                get: () => ({
                  empty: false,
                  docs: sections.map((section) => ({ data: () => section })),
                }),
              }),
            },
          },
        ],
      }));

      const questionnaireFromDb = await getQuestionnaire("123");
      expect(questionnaireFromDb.sections).toEqual(sections);
    });
  });

  describe("Getting the base questionnaire", () => {
    it("Should handle when an ID is not provided", () => {
      expect(() => getQuestionnaireMetaById()).not.toThrow();
    });

    it("Should return null when it cannot find the questionnaire", async () => {
      const baseQuestionnaireFromDb = await getQuestionnaireMetaById("123");
      expect(baseQuestionnaireFromDb).toBeNull();
      expect(getQuestionnaire("123")).resolves.toBeNull();
    });

    it("Should transform Firestore Timestamps into JS Data objects", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        data: () => baseQuestionnaire,
      }));
      const baseQuestionnaireFromDb = await getQuestionnaireMetaById("123");

      expect(baseQuestionnaireFromDb.createdAt instanceof Date).toBeTruthy();
      expect(baseQuestionnaireFromDb.updatedAt instanceof Date).toBeTruthy();
      expect(
        baseQuestionnaireFromDb.history[0].time instanceof Date
      ).toBeTruthy();
    });
  });

  describe("Saving a questionnaire", () => {
    it("Should handle when an ID cannot be found within the given questionnaire", () => {
      expect(() => saveQuestionnaire(questionnaire)).not.toThrow();
    });

    it("Should update the 'updatedAt' property", async () => {
      const updatedAt = new Date();
      const savedQuestionnaire = await saveQuestionnaire({
        id: "123",
        updatedAt,
        ...questionnaire,
      });
      expect(updatedAt !== savedQuestionnaire.updatedAt).toBeTruthy();
    });
  });

  describe("Getting a list of questionnaires", () => {
    it("Should return an empty array if no questionnaires are found", async () => {
      const listOfQuestionnaires = await listQuestionnaires();
      expect(listOfQuestionnaires.length).toBe(0);
      expect(Array.isArray(listOfQuestionnaires)).toBeTruthy();
    });

    it("Should transform Firestore Timestamps into JS Date objects", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        docs: [
          {
            data: () => ({ id: "123", ...baseQuestionnaire }),
          },
        ],
      }));

      const listOfQuestionnaires = await listQuestionnaires();

      expect(listOfQuestionnaires[0].updatedAt instanceof Date).toBeTruthy();
      expect(listOfQuestionnaires[0].createdAt instanceof Date).toBeTruthy();
    });
  });

  describe("Deleting a questionnaire", () => {
    it("Should handle when an ID has not been given", () => {
      expect(() => deleteQuestionnaire()).not.toThrow();
    });
  });

  describe("Creating a user", () => {
    it("Should give the user an ID if one is not given", async () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const userFromDb = await createUser(user);
      expect(userFromDb.id).toBeTruthy();
      expect(userFromDb.id).toMatch(uuidRegex);
      console.log(JSON.stringify(userFromDb));
      expect(userFromDb.updatedAt instanceof Date).toBeTruthy();
    });

    it("Should use the email as the users name if one is not given", async () => {
      delete user.name;
      const userFromDb = await createUser(user);
      expect(userFromDb.name).toBeTruthy();
      expect(userFromDb.name).toMatch(userFromDb.email);
    });

    it("Should handle any errors that may occur", () => {
      delete user.email;
      expect(() => createUser(user)).not.toThrow();
    });
  });

  describe("Getting a user by their external ID", () => {
    it("Should handle when an ID is not provided", () => {
      expect(() => getUserByExternalId()).not.toThrow();
    });

    it("Should return nothing if the user cannot be found", async () => {
      const user = await getUserByExternalId("123");
      expect(user).toBeUndefined();
    });

    it("Should return the Firestore document ID as the ID for the user", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          {
            id: "123",
            data: () => ({
              ...user,
            }),
          },
        ],
      }));
      const userFromDb = await getUserByExternalId("123");

      expect(userFromDb.id).toBe("123");
    });
  });

  describe("Getting a user by their Firestore ID", () => {
    it("Should handle when an ID is not provided", () => {
      expect(() => getUserById()).not.toThrow();
    });
    it("Should return nothing if the user cannot be found", async () => {
      const user = await getUserById("123");
      expect(user).toBeUndefined();
    });
    it("Should return the Firestore document ID as the ID for the user", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        id: "123",
        data: () => ({
          ...user,
        }),
      }));
      const userFromDb = await getUserById("123");

      expect(userFromDb.id).toBe("123");
    });
  });

  describe("Getting a list of users", () => {
    it("Should return an empty array if no users are found", async () => {
      const listOfUsers = await listUsers();
      expect(listOfUsers.length).toBe(0);
      expect(Array.isArray(listOfUsers)).toBeTruthy();
    });

    it("Should use the Firestore document ID as the ID for each user", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        id: "123",
        docs: [
          {
            id: "123",
            data: () => ({
              ...user,
            }),
          },
        ],
      }));

      const usersFromDb = await listUsers();
      expect(usersFromDb[0].id).toBe("123");
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
      expect(() => createHistoryEvent(null, mockHistoryEvent)).not.toThrow();
    });
    it("Should handle when an event has not been given", () => {
      expect(() => createHistoryEvent("123", null)).not.toThrow();
    });
    it("Should put the new history event at the front of the list", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        data: () => baseQuestionnaire,
      }));

      const questionnaireHistory = await createHistoryEvent(
        "123",
        mockHistoryEvent
      );

      expect(questionnaireHistory[0] === mockHistoryEvent).toBeTruthy();
    });
  });

  describe("Saving a base questionnaire", () => {
    it("Should handle when an ID cannot be found within the given base questionnaire", async () => {
      await expect(saveMetadata({})).rejects.toThrow();
    });

    it("Should update the 'updatedAt' property", async () => {
      const updatedAt = new Date();
      const updatedBaseQuestionnaire = await saveMetadata({
        ...baseQuestionnaire,
        updatedAt,
        id: "123",
      });

      expect(updatedBaseQuestionnaire.updatedAt !== updatedAt).toBeTruthy();
    });
  });

  describe("Creating default comments", () => {
    it("Should handle when a questionnaireId has not been given", () => {
      expect(() => createComments()).not.toThrow();
    });
    it("Should return a default comments object", async () => {
      const commentsFromDb = await createComments("123");
      expect(commentsFromDb).toMatchObject({
        comments: {},
        questionnaireId: "123",
      });
    });
  });

  describe("Getting the comments for a questionnaire", () => {
    let mockComment;
    beforeEach(() => {
      mockComment = {
        id: uuidv4(),
        commentText: "Oh I do like to be beside the seaside",
        userId: "123",
        createdTime: {
          toDate: () => new Date(),
        },
        editedTime: {
          toDate: () => new Date(),
        },
        replies: [
          {
            createdTime: {
              toDate: () => new Date(),
            },
            editedTime: {
              toDate: () => new Date(),
            },
          },
        ],
      };
    });
    it("Should handle when a questionnareId has not been given", () => {
      expect(() => getCommentsForQuestionnaire()).not.toThrow();
    });
    it("Should transform Firestore Timestamps into JS Date objects", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        data: () => ({
          comments: {
            "123-456-789": [mockComment],
          },
        }),
      }));

      const listOfComments = await getCommentsForQuestionnaire("123");

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

  describe("Saving a comment", () => {
    let mockComment, mockCommentsObject;
    beforeEach(() => {
      mockComment = {
        id: uuidv4(),
        commentText: "Oh I do like to be beside the seaside",
        userId: "123",
        createdTime: {
          toDate: () => new Date(),
        },
        editedTime: {
          toDate: () => new Date(),
        },
        replies: [
          {
            createdTime: {
              toDate: () => new Date(),
            },
            editedTime: {
              toDate: () => new Date(),
            },
          },
        ],
      };
      mockCommentsObject = {
        comments: {
          "123-456-789": [mockComment],
        },
      };
    });
    it("Should handle a questionnaireId not being found within the given comments object", () => {
      expect(() => saveComments(mockCommentsObject)).not.toThrow();
    });
    it("Should return the questionnaire comments object", async () => {
      const commentsFromDb = await saveComments({
        ...mockCommentsObject,
        questionnaireId: "123",
      });

      expect(commentsFromDb).toMatchObject(mockCommentsObject.comments);
    });
  });

  describe("Updating a user", () => {
    it("Should handle not finding an ID within the given user object", () => {
      expect(() => updateUser(user)).not.toThrow();
    });
    it("Should return the updated user object", async () => {
      const changedUser = { ...user, name: "Harry James Potter", id: "123" };
      const userFromDb = await updateUser(changedUser);
      console.log(JSON.stringify(userFromDb));
      expect(userFromDb.updatedAt instanceof Date).toBeTruthy();
      expect(userFromDb).toMatchObject(changedUser);
    });
  });
});
