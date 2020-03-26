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
  Firestore.prototype.doc = id => {
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
  let questionnaire, baseQuestionnaire, user, ctx;

  beforeEach(() => {
    questionnaire = {
      title: "Working from home",
      theme: "default",
      legalBasis: "Voluntary",
      navigation: false,
      metadata: [],
      sections: [
        {
          id: uuidv4(),
          title: "",
          introductionEnabled: false,
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
          alias: "",
        },
      ],
      summary: false,
      version: 13,
      surveyVersion: 1,
      editors: [],
      isPublic: true,
      publishStatus: "Unpublished",
      createdAt: {
        toDate: () => new Date(),
      },
      updatedAt: {
        toDate: () => new Date(),
      },
    };

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
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(questionnaire.id).toBeFalsy();
      const questionnaireFromDb = await createQuestionnaire(questionnaire, ctx);
      expect(questionnaire.id).toBeTruthy();
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
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const userFromDb = await createUser(user);
      expect(userFromDb.id).toBeTruthy();
      expect(userFromDb.id).toMatch(uuidRegex);
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
    it("Should handel when an ID cannot be found within the given base questionnaire", () => {
      expect(() => {
        saveMetadata({});
      }).not.toThrow();
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
});
