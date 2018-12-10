const knex = require("../db");
const { get } = require("lodash");
const {
  getPipingAnswersForQuestionPage,
  getPipingMetadataForQuestionPage,
  getRoutingQuestionsForQuestionPage
} = require("./QuestionPageRepository")(knex);
const buildTestQuestionnaire = require("../tests/utils/buildTestQuestionnaire")(
  knex
);
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

const { getName } = require("../utils/getName");

describe("QuestionPageRepository", () => {
  beforeAll(() => knex.migrate.latest());
  afterAll(() => knex.destroy());
  afterEach(async () => {
    await knex.transaction(async trx => {
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
          label: "Answer 1.1.1"
        }),
        expect.objectContaining({
          label: "Answer 1.1.2"
        }),
        expect.objectContaining({
          label: "Answer 1.1.5"
        }),
        expect.objectContaining({
          label: "Answer 1.1.6"
        }),
        expect.objectContaining({
          label: "Answer 1.1.7"
        }),
        expect.objectContaining({
          label: "Answer 1.2.1"
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
          { key: "metadata_date", alias: "metadata date", type: METADATA_DATE },
          { key: "metadata_text", alias: "metadata text", type: METADATA_TEXT }
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
          key: "metadata_date"
        }),
        expect.objectContaining({
          key: "metadata_text"
        })
      ]);

      expect(getName(metadata[0], "Metadata")).toEqual("metadata date");
      expect(getName(metadata[1], "Metadata")).toEqual("metadata text");
    });
  });

  describe("Routing", () => {
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
                    type: CURRENCY
                  }
                ]
              },
              {
                title: "Page 1.2",
                answers: [
                  {
                    label: "Answer 1.2.1",
                    type: RADIO
                  }
                ]
              },
              {
                title: "Page 1.3",
                answers: [
                  {
                    label: "Answer 1.3.1",
                    type: TEXTFIELD
                  }
                ]
              },
              {
                title: "Page 1.4",
                answers: [
                  {
                    label: "Answer 1.4.1",
                    type: DATE
                  }
                ]
              },
              {
                title: "Page 1.5",
                answers: [
                  {
                    label: "Answer 1.5.1",
                    type: DATE
                  },
                  {
                    label: "Answer 1.5.2",
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
                    type: RADIO
                  }
                ]
              },
              {
                title: "Page 2.2",
                answers: [
                  {
                    label: "Answer 2.2.1",
                    type: RADIO
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

    it("should get the current and previous question pages of specific types", async () => {
      const routingQuestions = await getRoutingQuestionsForQuestionPage(
        get(questionnaire, "sections[1].pages[0].id")
      );

      expect(routingQuestions).toEqual([
        expect.objectContaining({
          title: "Page 1.1"
        }),
        expect.objectContaining({
          title: "Page 1.2"
        }),
        expect.objectContaining({
          title: "Page 1.5"
        }),
        expect.objectContaining({
          title: "Page 2.1"
        })
      ]);
    });
  });
});
