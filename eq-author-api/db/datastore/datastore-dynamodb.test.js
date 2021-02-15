const { pick, omit } = require("lodash");

const originalKey = Symbol("originalItem");

describe("Datastore dynamo", () => {
  let dynamoose,
    QuestionnaireModel,
    QuestionnaireVersionsModel,
    justListFields,
    getModelExec;
  let saveQuestionnaire;

  const RealDate = Date;

  const mockDate = (isoDate) => {
    global.Date = class extends RealDate {
      constructor(...theArgs) {
        if (theArgs.length) {
          return new RealDate(...theArgs);
        }
        return new RealDate(isoDate);
      }

      static now() {
        return new RealDate(isoDate).getTime();
      }
    };
  };

  beforeEach(() => {
    dynamoose = {
      transaction: jest.fn().mockResolvedValue(),
    };
    QuestionnaireModel = {
      transaction: {
        update: jest.fn().mockReturnValue("modelUpdate"),
      },
    };

    getModelExec = jest.fn();
    QuestionnaireVersionsModel = class {
      constructor(data) {
        Object.assign(this, data);
      }
      originalItem() {
        return this[originalKey];
      }
      static queryOne() {
        return {
          descending: function () {
            return this;
          },
          consistent: function () {
            return this;
          },
          exec: getModelExec,
        };
      }
    };
    QuestionnaireVersionsModel.transaction = {
      create: jest.fn().mockReturnValue("versionCreate"),
    };

    justListFields = jest.fn();

    jest.doMock("../models/DynamoDB", () => ({
      dynamoose,
      QuestionnaireModel,
      QuestionnaireVersionsModel,
      justListFields,
    }));

    saveQuestionnaire = require("./index").saveQuestionnaire;
  });
  afterEach(() => {
    jest.resetModules();
    global.Date = RealDate;
  });

  describe("saveQuestionnaire", () => {
    it("should save the questionnaire in a transaction", async () => {
      const questionnaire = new QuestionnaireVersionsModel({
        prop1: "some value",
        metadata: [],
        sections: [],
      });
      await saveQuestionnaire(questionnaire);

      expect(dynamoose.transaction).toHaveBeenCalledWith([
        "versionCreate",
        "modelUpdate",
      ]);
    });

    it("should create a new version on save", async () => {
      const questionnaire = new QuestionnaireVersionsModel({
        prop1: "some value",
        metadata: [],
        sections: [],
      });

      const dateString = "2019-01-01T10:00:00Z";
      mockDate(dateString);

      await saveQuestionnaire(questionnaire);

      expect(
        QuestionnaireVersionsModel.transaction.create
      ).toHaveBeenCalledWith({
        prop1: "some value",
        metadata: [],
        sections: [],
        updatedAt: new RealDate(dateString),
      });
    });

    it("should update the list table with the latest version number", async () => {
      justListFields.mockImplementation((obj) =>
        pick(obj, ["id", "prop1", "updatedAt"])
      );

      const questionnaire = new QuestionnaireVersionsModel({
        id: "someId",
        prop1: "someValue",
        metadata: [],
        sections: [],
        [originalKey]: {
          updatedAt: new RealDate("2012-01-01T10:00:00Z"),
        },
      });

      const dateString = "2019-01-01T10:00:00Z";
      mockDate(dateString);

      await saveQuestionnaire(questionnaire);

      expect(QuestionnaireModel.transaction.update).toHaveBeenCalledWith(
        {
          id: "someId",
        },
        {
          id: "someId",
          prop1: "someValue",
          updatedAt: new RealDate(dateString),
        },
        {
          updateTimestamps: false,
          condition: "updatedAt = :updatedAt",
          conditionValues: {
            updatedAt: new RealDate("2012-01-01T10:00:00Z"),
          },
        }
      );
    });

    it("should do nothing if nothing has changed", async () => {
      const questionnaire = new QuestionnaireVersionsModel({
        id: "someId",
        prop1: "someValue",
        metadata: [],
        sections: [],
        updatedAt: new RealDate("2012-01-01T10:00:00Z"),
        [originalKey]: {
          updatedAt: new RealDate("2012-01-01T10:00:00Z"),
          id: "someId",
          prop1: "someValue",
          metadata: [],
          sections: [],
        },
      });

      await saveQuestionnaire(questionnaire);

      expect(dynamoose.transaction).not.toHaveBeenCalled();
    });

    describe("merging", () => {
      const dateString = "2019-01-01T12:00:00Z";
      beforeEach(() => {
        dynamoose.transaction.mockRejectedValueOnce({
          code: "TransactionCanceledException",
          message: "[None, ConditionalCheckFailed]",
        });
      });

      const getMergeResult = async (ourChange, theirChange) => {
        getModelExec.mockImplementation((callback) => {
          callback(
            null,
            new QuestionnaireVersionsModel({
              ...theirChange,
              [originalKey]: {
                ...theirChange,
              },
            })
          );
        });
        const questionnaire = new QuestionnaireVersionsModel(ourChange);

        mockDate(dateString);

        await saveQuestionnaire(questionnaire);

        return omit(
          QuestionnaireVersionsModel.transaction.create.mock.calls[1][0],
          [originalKey]
        );
      };

      it("should merge the change if the document has been changed since it was loaded", async () => {
        const mergeResult = await getMergeResult(
          {
            id: "someId",
            prop1: "prop1",
            metadata: [],
            sections: [],
            editors: [],
            updatedAt: new RealDate("2012-01-01T10:00:00Z"),
            [originalKey]: {
              updatedAt: new RealDate("2012-01-01T10:00:00Z"),
              id: "someId",
              metadata: [],
              sections: [],
              editors: [],
            },
          },
          {
            id: "someId",
            prop2: "prop2",
            metadata: [],
            sections: [],
            editors: [],
            updatedAt: new RealDate("2012-01-01T11:00:00Z"),
          }
        );

        expect(mergeResult).toEqual({
          id: "someId",
          prop1: "prop1",
          prop2: "prop2",
          metadata: [],
          sections: [],
          editors: [],
          updatedAt: new RealDate(dateString),
        });
      });
    });
  });
});
