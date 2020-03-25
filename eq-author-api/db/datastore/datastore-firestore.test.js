const { Firestore } = require("@google-cloud/firestore");
const {
  createQuestionnaire,
  getQuestionnaire,
  getQuestionnaireMetaById,
  saveQuestionnaire,
} = require("./datastore-firestore");
const { v4: uuidv4 } = require("uuid");

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
  let questionnaire, baseQuestionnaire, ctx;
  beforeEach(() => {
    questionnaire = {
      title: "Working from home",
      theme: "default",
      legalBasis: "Voluntary",
      navigation: false,
      createdAt: new Date(),
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
      expect(getQuestionnaire()).rejects.toBeTruthy();
    });

    it("Should return null when it cannot find the questionnaire", async () => {
      const questionnaire = await getQuestionnaire("123");
      expect(questionnaire).toBeNull();
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
      expect(getQuestionnaireMetaById()).rejects.toBeTruthy();
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
    it("Should handel when an ID cannot be found within the given questionnaire", () => {
      expect(saveQuestionnaire(questionnaire)).rejects.toBeTruthy();
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
});
