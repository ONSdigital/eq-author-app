const { Firestore } = require("@google-cloud/firestore");
const {
  createQuestionnaire,
  getQuestionnaire,
  getQuestionnaireMetaById,
  saveQuestionnaire,
  listQuestionnaires,
  listFilteredQuestionnaires,
  getTotalFilteredQuestionnaires,
  getTotalPages,
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
const { logger } = require("../../utils/logger");

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
  Firestore.prototype.catch = jest.fn(() => new Firestore());
  Firestore.prototype.update = jest.fn(() => new Firestore());
  Firestore.prototype.orderBy = jest.fn(() => new Firestore());
  Firestore.prototype.where = jest.fn(() => new Firestore());
  Firestore.prototype.limit = jest.fn(() => new Firestore());
  Firestore.prototype.endBefore = jest.fn(() => new Firestore());
  Firestore.prototype.limitToLast = jest.fn(() => new Firestore());
  Firestore.prototype.startAfter = jest.fn(() => new Firestore());
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
    ctx,
    loggerInfoSpy,
    loggerErrorSpy;

  beforeAll(connectDB);

  beforeEach(() => {
    loggerInfoSpy = jest.spyOn(logger, "info").mockImplementation(() => {});
    loggerErrorSpy = jest.spyOn(logger, "error").mockImplementation(() => {});

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
      theme: "business",
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

    loggerInfoSpy.mockRestore();
    loggerErrorSpy.mockRestore();
  });

  describe("Creating a questionnaire", () => {
    it("should give the questionnaire an ID if one is not given", async () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(questionnaire.id).toBeFalsy();
      const questionnaireFromDb = await createQuestionnaire(questionnaire, ctx);
      expect(questionnaireFromDb.id).toMatch(uuidRegex);
    });

    it("should leave the questionnaire ID as is if one is given", async () => {
      expect(questionnaire.id).toBeFalsy();
      questionnaire.id = "123";
      expect(questionnaire.id).toBeTruthy();
      const questionnaireFromDb = await createQuestionnaire(questionnaire, ctx);
      expect(questionnaireFromDb.id).toMatch("123");
    });
  });

  describe("Getting the latest questionnaire version", () => {
    it("should should handle when an ID is not provided", () => {
      expect(() => getQuestionnaire()).not.toThrow();
    });

    it("should return null when it cannot find the questionnaire", async () => {
      const questionnaireFromDb = await getQuestionnaire("123");
      expect(questionnaireFromDb).toBeNull();
      expect(getQuestionnaire("123")).resolves.toBeNull();
    });

    it("should transform Firestore Timestamps into JS Date objects", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [{ data: () => questionnaire }],
      }));
      const questionnaireFromDb = await getQuestionnaire("123");

      expect(questionnaireFromDb.createdAt instanceof Date).toBeTruthy();
      expect(questionnaireFromDb.updatedAt instanceof Date).toBeTruthy();
    });

    it("should reconstruct sections from subcollection if present", async () => {
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
    it("should handle when an ID is not provided", () => {
      expect(() => getQuestionnaireMetaById()).not.toThrow();
    });

    it("should return null when it cannot find the questionnaire", async () => {
      const baseQuestionnaireFromDb = await getQuestionnaireMetaById("123");
      expect(baseQuestionnaireFromDb).toBeNull();
      expect(getQuestionnaire("123")).resolves.toBeNull();
    });

    it("should transform Firestore Timestamps into JS Data objects", async () => {
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
    it("should handle when an ID cannot be found within the given questionnaire", () => {
      expect(() => saveQuestionnaire(questionnaire)).not.toThrow();
    });

    it("should update the 'updatedAt' property", async () => {
      const updatedAt = new Date();
      const savedQuestionnaire = await saveQuestionnaire({
        id: "123",
        updatedAt,
        ...questionnaire,
      });
      expect(updatedAt !== savedQuestionnaire.updatedAt).toBeTruthy();
    });

    it("should not update the 'createdAt' property", async () => {
      const createdAt = questionnaire.createdAt;
      const savedQuestionnaire = await saveQuestionnaire({
        id: "123",
        title: "Updated questionnaire title",
        ...questionnaire,
      });
      expect(createdAt === savedQuestionnaire.createdAt).toBeTruthy();
    });
  });

  describe("Getting a list of questionnaires", () => {
    it("should return an empty array if no questionnaires are found", async () => {
      const listOfQuestionnaires = await listQuestionnaires();
      expect(listOfQuestionnaires.length).toBe(0);
      expect(Array.isArray(listOfQuestionnaires)).toBeTruthy();
    });

    it("should transform Firestore Timestamps into JS Date objects", async () => {
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

  describe("Getting a filtered list of questionnaires", () => {
    const firestoreTimestamp = {
      toDate: () => new Date(),
    };

    const makeQuestionnaireDoc = (overrides = {}) => ({
      data: () => ({
        title: "Untitled questionnaire",
        shortTitle: "UNTITLED",
        createdAt: firestoreTimestamp,
        updatedAt: firestoreTimestamp,
        ...overrides,
      }),
    });

    it("should return an empty array when the no-search paginated query is empty", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: true,
        docs: [],
      }));

      const questionnaires = await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "",
      });

      expect(Array.isArray(questionnaires)).toBeTruthy();
      expect(questionnaires).toEqual([]);
    });

    it("should return mapped questionnaire documents for default first page when no search is applied", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [makeQuestionnaireDoc()],
      }));

      const questionnaires = await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "",
      });

      expect(questionnaires.length).toBe(1);
      expect(questionnaires[0].title).toBe("Untitled questionnaire");
    });

    it("should default null resultsPerPage to 10 when no search is applied", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [makeQuestionnaireDoc()],
      }));

      await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "",
        resultsPerPage: null,
      });

      expect(Firestore.prototype.limit).toHaveBeenCalledWith(10);
    });

    it("should default non-positive resultsPerPage to 10 when no search is applied", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [makeQuestionnaireDoc()],
      }));

      await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "",
        resultsPerPage: 0,
      });

      expect(Firestore.prototype.limit).toHaveBeenCalledWith(10);
    });

    it("should paginate to the previous page when firstQuestionnaireIdOnPage is provided", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [makeQuestionnaireDoc()],
      }));

      await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "",
        firstQuestionnaireIdOnPage: "first-id",
      });

      expect(Firestore.prototype.endBefore).toHaveBeenCalled();
      expect(Firestore.prototype.limitToLast).toHaveBeenCalled();
    });

    it("should paginate to the next page when lastQuestionnaireIdOnPage is provided", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [makeQuestionnaireDoc()],
      }));

      await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "",
        lastQuestionnaireIdOnPage: "last-id",
      });

      expect(Firestore.prototype.startAfter).toHaveBeenCalled();
      expect(Firestore.prototype.limit).toHaveBeenCalled();
    });

    it("should return undefined when both pagination cursors are provided", async () => {
      const input = {
        searchByTitleOrShortCode: "",
        firstQuestionnaireIdOnPage: "first-id",
        lastQuestionnaireIdOnPage: "last-id",
      };

      const questionnaires = await listFilteredQuestionnaires({
        ...input,
      });

      expect(questionnaires).toBeUndefined();
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        {
          error: expect.any(String),
          input,
        },
        "Unable to retrieve questionnaires (from listFilteredQuestionnaires)"
      );
    });

    it("should return the first resultsPerPage matches when searching", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({
            title: "Employee Check-In",
            shortTitle: "HR-1",
          }),
          makeQuestionnaireDoc({
            title: "Weather survey",
            shortTitle: "WX",
          }),
          makeQuestionnaireDoc({
            title: "Quarterly report",
            shortTitle: "EMP-02",
          }),
        ],
      }));

      const questionnaires = await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "emp",
        resultsPerPage: 1,
      });

      expect(questionnaires.length).toBe(1);
      expect(questionnaires[0].title).toBe("Employee Check-In");
    });

    it("should default null resultsPerPage to 10 when searching", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({
            title: "Employee Check-In",
            shortTitle: "HR-1",
          }),
          makeQuestionnaireDoc({
            title: "Quarterly report",
            shortTitle: "EMP-02",
          }),
          makeQuestionnaireDoc({
            title: "Weather survey",
            shortTitle: "WX",
          }),
        ],
      }));

      const questionnaires = await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "emp",
        resultsPerPage: null,
      });

      expect(questionnaires.length).toBe(2);
      expect(questionnaires[0].title).toBe("Employee Check-In");
      expect(questionnaires[1].title).toBe("Quarterly report");
    });

    it("should default non-positive resultsPerPage to 10 when searching", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({
            title: "Employee Check-In",
            shortTitle: "HR-1",
          }),
          makeQuestionnaireDoc({
            title: "Quarterly report",
            shortTitle: "EMP-02",
          }),
          makeQuestionnaireDoc({
            title: "Weather survey",
            shortTitle: "WX",
          }),
        ],
      }));

      const questionnaires = await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "emp",
        resultsPerPage: -5,
      });

      expect(questionnaires.length).toBe(2);
      expect(questionnaires[0].title).toBe("Employee Check-In");
      expect(questionnaires[1].title).toBe("Quarterly report");
    });

    it("should return matches for short title when searching", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({
            title: "Employee Check-In",
            shortTitle: "HR-1",
          }),
          makeQuestionnaireDoc({
            title: "Weather survey",
            shortTitle: "WX",
          }),
          makeQuestionnaireDoc({
            title: "Quarterly report",
            shortTitle: "QR-01",
          }),
          makeQuestionnaireDoc({
            title: "Quarterly report v2",
            shortTitle: "QR-02",
          }),
        ],
      }));

      const questionnaires = await listFilteredQuestionnaires({
        searchByTitleOrShortCode: "QR",
        resultsPerPage: 10,
      });

      expect(questionnaires.length).toBe(2);
      expect(questionnaires[0].title).toBe("Quarterly report");
      expect(questionnaires[1].title).toBe("Quarterly report v2");
    });

    it("should normalise search term, titles and short titles when searching", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({
            title: "  employee check-in  ",
            shortTitle: "HR-1",
          }),
          makeQuestionnaireDoc({
            title: "EmployEE Check-In v2  ",
            shortTitle: "HR-2",
          }),
          makeQuestionnaireDoc({
            title: "Weather survey",
            shortTitle: "WX",
          }),
          makeQuestionnaireDoc({
            title: "Quarterly report",
            shortTitle: "EMP-02",
          }),
        ],
      }));

      const questionnaires = await listFilteredQuestionnaires({
        searchByTitleOrShortCode: " EMP   ",
      });

      expect(questionnaires.length).toBe(3);
      expect(questionnaires[0].title).toBe("  employee check-in  ");
      expect(questionnaires[1].title).toBe("EmployEE Check-In v2  ");
      expect(questionnaires[2].title).toBe("Quarterly report");
    });

    it("should return an empty array when searching and no results match", async () => {
      const input = {
        searchByTitleOrShortCode: "gamma",
      };

      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({ title: "Alpha", shortTitle: "A1" }),
          makeQuestionnaireDoc({ title: "Beta", shortTitle: "B1" }),
        ],
      }));

      const questionnaires = await listFilteredQuestionnaires(input);

      expect(questionnaires).toEqual([]);
      expect(loggerInfoSpy).toHaveBeenCalledWith(
        "No questionnaires found (from listFilteredQuestionnaires)"
      );
    });

    it("should return undefined when a Firestore error is thrown", async () => {
      const input = {
        searchByTitleOrShortCode: "",
      };

      Firestore.prototype.get.mockRejectedValue(new Error("firestore failed"));

      const questionnaires = await listFilteredQuestionnaires(input);

      expect(questionnaires).toBeUndefined();
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        {
          error: expect.any(String),
          input,
        },
        "Unable to retrieve questionnaires (from listFilteredQuestionnaires)"
      );
    });
  });

  describe("Getting filtered totals", () => {
    const firestoreTimestamp = {
      toDate: () => new Date(),
    };

    const makeQuestionnaireDoc = (overrides = {}) => ({
      data: () => ({
        title: "Untitled questionnaire",
        shortTitle: "UNTITLED",
        createdAt: firestoreTimestamp,
        updatedAt: firestoreTimestamp,
        ...overrides,
      }),
    });

    it("should return the number of filtered questionnaires", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({ title: "Employee survey" }),
          makeQuestionnaireDoc({ title: "Employee pulse" }),
          makeQuestionnaireDoc({ title: "Weather survey" }),
        ],
      }));

      const totalFiltered = await getTotalFilteredQuestionnaires({
        searchByTitleOrShortCode: "employee",
      });

      expect(totalFiltered).toBe(2);
    });

    it("should return all questionnaires when no search term is provided", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({ title: "Employee survey" }),
          makeQuestionnaireDoc({ title: "Weather survey" }),
          makeQuestionnaireDoc({ title: "Business survey" }),
        ],
      }));

      const totalFiltered = await getTotalFilteredQuestionnaires({
        searchByTitleOrShortCode: "",
      });

      expect(totalFiltered).toBe(3);
    });

    it("should return undefined when counting filtered questionnaires fails", async () => {
      const input = {
        searchByTitleOrShortCode: "employee",
      };

      Firestore.prototype.get.mockRejectedValue(new Error("firestore failed"));

      const totalFiltered = await getTotalFilteredQuestionnaires(input);

      expect(totalFiltered).toBeUndefined();
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        {
          error: expect.any(String),
          input,
        },
        "Unable to retrieve questionnaires (from getTotalFilteredQuestionnaires)"
      );
    });

    it("should return undefined for total pages when counting filtered questionnaires fails", async () => {
      const input = {
        searchByTitleOrShortCode: "employee",
      };

      Firestore.prototype.get.mockRejectedValue(new Error("firestore failed"));

      const totalPages = await getTotalPages(input);

      expect(totalPages).toBeUndefined();
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        {
          error: expect.any(String),
          input,
        },
        "Unable to retrieve questionnaires (from getTotalFilteredQuestionnaires)"
      );
    });

    it("should deduplicate concurrent fetches when counting filtered questionnaires", async () => {
      let resolveSnapshot;

      Firestore.prototype.get.mockReset();

      Firestore.prototype.get.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveSnapshot = resolve;
          })
      );

      const firstCountPromise = getTotalFilteredQuestionnaires({
        searchByTitleOrShortCode: "employee",
      });
      const secondCountPromise = getTotalFilteredQuestionnaires({
        searchByTitleOrShortCode: "employee",
      });

      await Promise.resolve();
      const callsBeforeResolving = Firestore.prototype.get.mock.calls.length;

      resolveSnapshot({
        empty: false,
        docs: [
          makeQuestionnaireDoc({ title: "Employee survey" }),
          makeQuestionnaireDoc({ title: "Employee pulse" }),
          makeQuestionnaireDoc({ title: "Weather survey" }),
        ],
      });

      const [firstCount, secondCount] = await Promise.all([
        firstCountPromise,
        secondCountPromise,
      ]);

      expect(firstCount).toBe(2);
      expect(secondCount).toBe(2);
      expect(callsBeforeResolving).toBe(1);
    });

    it("should retry fetching questionnaires after an in-flight fetch fails", async () => {
      Firestore.prototype.get.mockReset();

      Firestore.prototype.get
        .mockRejectedValueOnce(new Error("firestore failed"))
        .mockResolvedValueOnce({
          empty: false,
          docs: [makeQuestionnaireDoc({ title: "Employee survey" })],
        });

      const firstTotalFiltered = await getTotalFilteredQuestionnaires({
        searchByTitleOrShortCode: "employee",
      });
      const secondTotalFiltered = await getTotalFilteredQuestionnaires({
        searchByTitleOrShortCode: "employee",
      });

      expect(firstTotalFiltered).toBeUndefined();
      expect(secondTotalFiltered).toBe(1);
      expect(Firestore.prototype.get).toHaveBeenCalledTimes(2);
    });

    it("should return the total number of pages rounded up", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({ title: "Employee survey" }),
          makeQuestionnaireDoc({ title: "Employee pulse" }),
          makeQuestionnaireDoc({ title: "Employee feedback" }),
        ],
      }));

      const totalPages = await getTotalPages({
        searchByTitleOrShortCode: "employee",
        resultsPerPage: 2,
      });

      expect(totalPages).toBe(2);
    });

    it("should default pagination to 10 results per page when called with null input", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({ title: "Employee survey" }),
          makeQuestionnaireDoc({ title: "Employee pulse" }),
          makeQuestionnaireDoc({ title: "Employee feedback" }),
        ],
      }));

      const totalPages = await getTotalPages(null);

      expect(totalPages).toBe(1);
    });

    it("should default pagination to 10 results per page when called with non-positive input", async () => {
      Firestore.prototype.get.mockImplementation(() => ({
        empty: false,
        docs: [
          makeQuestionnaireDoc({ title: "Employee survey" }),
          makeQuestionnaireDoc({ title: "Employee pulse" }),
          makeQuestionnaireDoc({ title: "Employee feedback" }),
        ],
      }));

      const totalPages = await getTotalPages({
        searchByTitleOrShortCode: "employee",
        resultsPerPage: 0,
      });

      expect(totalPages).toBe(1);
    });
  });

  describe("Deleting a questionnaire", () => {
    it("should handle when an ID has not been given", () => {
      expect(() => deleteQuestionnaire()).not.toThrow();
    });
  });

  describe("Creating a user", () => {
    it("should give the user an ID if one is not given", async () => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const userFromDb = await createUser(user);
      expect(userFromDb.id).toBeTruthy();
      expect(userFromDb.id).toMatch(uuidRegex);
      expect(userFromDb.updatedAt instanceof Date).toBeTruthy();
    });

    it("should use the email as the users name if one is not given", async () => {
      delete user.name;
      const userFromDb = await createUser(user);
      expect(userFromDb.name).toBeTruthy();
      expect(userFromDb.name).toMatch(userFromDb.email);
    });

    it("should handle any errors that may occur", () => {
      delete user.email;
      expect(() => createUser(user)).not.toThrow();
    });
  });

  describe("Getting a user by their external ID", () => {
    it("should handle when an ID is not provided", () => {
      expect(() => getUserByExternalId()).not.toThrow();
    });

    it("should return nothing if the user cannot be found", async () => {
      const user = await getUserByExternalId("123");
      expect(user).toBeUndefined();
    });

    it("should return the Firestore document ID as the ID for the user", async () => {
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
    it("should handle when an ID is not provided", () => {
      expect(() => getUserById()).not.toThrow();
    });
    it("should return nothing if the user cannot be found", async () => {
      const user = await getUserById("123");
      expect(user).toBeUndefined();
    });
    it("should return the Firestore document ID as the ID for the user", async () => {
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
    it("should return an empty array if no users are found", async () => {
      const listOfUsers = await listUsers();
      expect(listOfUsers.length).toBe(0);
      expect(Array.isArray(listOfUsers)).toBeTruthy();
    });

    it("should use the Firestore document ID as the ID for each user", async () => {
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
    it("should handle when a qid has not been given", () => {
      expect(() => createHistoryEvent(null, mockHistoryEvent)).not.toThrow();
    });
    it("should handle when an event has not been given", () => {
      expect(() => createHistoryEvent("123", null)).not.toThrow();
    });
    it("should put the new history event at the front of the list", async () => {
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
    it("should handle when an ID cannot be found within the given base questionnaire", async () => {
      await expect(saveMetadata({})).rejects.toThrow();
    });

    it("should update the 'updatedAt' property", async () => {
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
    it("should handle when a questionnaireId has not been given", () => {
      expect(() => createComments()).not.toThrow();
    });
    it("should return a default comments object", async () => {
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
    it("should handle when a questionnareId has not been given", () => {
      expect(() => getCommentsForQuestionnaire()).not.toThrow();
    });
    it("should transform Firestore Timestamps into JS Date objects", async () => {
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
    it("should handle a questionnaireId not being found within the given comments object", () => {
      expect(() => saveComments(mockCommentsObject)).not.toThrow();
    });
    it("should return the questionnaire comments object", async () => {
      const commentsFromDb = await saveComments({
        ...mockCommentsObject,
        questionnaireId: "123",
      });

      expect(commentsFromDb).toMatchObject(mockCommentsObject.comments);
    });
  });

  describe("Updating a user", () => {
    it("should handle not finding an ID within the given user object", () => {
      expect(() => updateUser(user)).not.toThrow();
    });
    it("should return the updated user object", async () => {
      const changedUser = { ...user, name: "Harry James Potter", id: "123" };
      const userFromDb = await updateUser(changedUser);
      expect(userFromDb.updatedAt instanceof Date).toBeTruthy();
      expect(userFromDb).toMatchObject(changedUser);
    });
  });
});
