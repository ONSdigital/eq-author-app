const db = require("../db");
const { get } = require("lodash");
const {
  getPreviousAnswersForValidation,
  getMetadataForValidation
} = require("./ValidationRepository");
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire");
const { DATE, NUMBER, TEXTAREA } = require("../constants/answerTypes");
const {
  DATE: METADATA_DATE,
  TEXT: METADATA_TEXT
} = require("../constants/metadataTypes");

describe("ValidationRepository", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());
  afterEach(async () => {
    await db.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  describe("Previous answers", () => {
    let questionnaire;
    beforeEach(async () => {
      questionnaire = await buildTestQuestionnaire({
        sections: [
          {
            title: "Section 1",
            pages: [
              {
                title: "Page 1.1",
                answers: [
                  {
                    label: "Answer 1.1.1",
                    type: DATE
                  },
                  {
                    label: "Answer 1.1.2",
                    type: NUMBER
                  }
                ]
              },
              {
                title: "Page 1.2",
                answers: [
                  {
                    label: "Answer 1.2.1",
                    type: DATE
                  }
                ]
              }
            ]
          },
          {
            title: "Section 2",
            pages: [
              {
                title: "Page 2.1",
                answers: [
                  {
                    label: "Answer 2.1.1",
                    type: DATE
                  },
                  {
                    label: "Answer 2.1.2",
                    type: NUMBER
                  },
                  {
                    label: "Answer 2.1.3",
                    type: NUMBER
                  },
                  {
                    label: "Answer 2.1.4",
                    type: DATE
                  }
                ]
              },
              {
                title: "Page 2.2",
                answers: [
                  {
                    label: "Answer 2.2.1",
                    type: DATE
                  },
                  {
                    label: "Answer 2.2.2",
                    type: TEXTAREA
                  }
                ]
              }
            ]
          }
        ]
      });
    });

    it("should get answers of same type on previous pages and sections", async () => {
      const previousAnswers = await getPreviousAnswersForValidation(
        get(
          questionnaire,
          "sections[1].pages[0].answers[3].validation.earliestDate.id"
        )
      );

      expect(previousAnswers).toEqual([
        expect.objectContaining({
          label: "Answer 1.1.1"
        }),
        expect.objectContaining({
          label: "Answer 1.2.1"
        })
      ]);
    });

    it("should get answers of same type on previous pages within the same section", async () => {
      const previousAnswers = await getPreviousAnswersForValidation(
        get(
          questionnaire,
          "sections[0].pages[1].answers[0].validation.earliestDate.id"
        )
      );

      expect(previousAnswers).toEqual([
        expect.objectContaining({
          label: "Answer 1.1.1"
        })
      ]);
    });
  });

  describe("Metadata", () => {
    let questionnaire;
    beforeEach(async () => {
      questionnaire = await buildTestQuestionnaire({
        metadata: [
          { key: "metadata_date", type: METADATA_DATE },
          { key: "metadata_text", type: METADATA_TEXT }
        ],
        sections: [
          {
            title: "Section 1",
            pages: [
              {
                title: "Page 1.1",
                answers: [
                  {
                    label: "Answer 1.1.1",
                    type: DATE
                  },
                  {
                    label: "Answer 1.1.2",
                    type: NUMBER
                  }
                ]
              }
            ]
          }
        ]
      });
    });

    it("should get metadata of date type answers", async () => {
      const metadata = await getMetadataForValidation(
        get(
          questionnaire,
          "sections[0].pages[0].answers[0].validation.earliestDate.id"
        )
      );

      expect(metadata).toEqual([
        expect.objectContaining({
          key: "metadata_date"
        })
      ]);
    });

    it("should return empty array for non-date type answers", async () => {
      const metadata = await getMetadataForValidation(
        get(
          questionnaire,
          "sections[0].pages[0].answers[1].validation.maxValue.id"
        )
      );

      expect(metadata).toEqual([]);
    });
  });
});
