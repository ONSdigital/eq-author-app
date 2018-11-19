const db = require("../db");
const { get } = require("lodash");
const {
  getPipingAnswersForQuestionPage,
  getPipingMetadataForQuestionPage
} = require("./QuestionPageRepository");
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire");
const {
  CHECKBOX,
  RADIO,
  TEXTFIELD,
  TEXTAREA,
  CURRENCY,
  NUMBER,
  DATE,
  DATE_RANGE
} = require("../constants/answerTypes");
const {
  DATE: METADATA_DATE,
  TEXT: METADATA_TEXT
} = require("../constants/metadataTypes");

describe("QuestionPageRepository", () => {
  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());
  afterEach(async () => {
    await db.transaction(async trx => {
      await trx.table("Questionnaires").delete();
    });
  });

  describe("Piping answers", () => {
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
                  },
                  {
                    label: "Answer 1.1.3",
                    type: CHECKBOX
                  },
                  {
                    label: "Answer 1.1.4",
                    type: RADIO
                  },
                  {
                    label: "Answer 1.1.5",
                    type: TEXTFIELD
                  },
                  {
                    label: "Answer 1.1.6",
                    type: CURRENCY
                  },
                  {
                    label: "Answer 1.1.7",
                    type: DATE_RANGE
                  }
                ]
              },
              {
                title: "Page 1.2",
                answers: [
                  {
                    label: "Answer 1.2.1",
                    type: DATE
                  },
                  {
                    label: "Answer 1.2.2",
                    type: NUMBER
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

    it("should get answers of specific types on previous pages and sections", async () => {
      const pipingAnswers = await getPipingAnswersForQuestionPage(
        get(questionnaire, "sections[1].pages[0].id")
      );

      expect(pipingAnswers).toEqual([
        expect.objectContaining({
          label: "Answer 1.1.7"
        }),
        expect.objectContaining({
          label: "Answer 1.1.6"
        }),
        expect.objectContaining({
          label: "Answer 1.1.5"
        }),
        expect.objectContaining({
          label: "Answer 1.1.2"
        }),
        expect.objectContaining({
          label: "Answer 1.2.2"
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
                answers: []
              }
            ]
          }
        ]
      });
    });

    it("should get all metadata for questionnaire", async () => {
      const metadata = await getPipingMetadataForQuestionPage(
        get(questionnaire, "sections[0].pages[0].id")
      );

      expect(metadata).toEqual([
        expect.objectContaining({
          key: "metadata_text"
        }),
        expect.objectContaining({
          key: "metadata_date"
        })
      ]);
    });
  });
});
