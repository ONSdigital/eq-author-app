const Block = require("./Block");
const { isLastPageInSection } = require("./Block");
const Question = require("./Question");
const mockQuestionnaire = require("./basicQuestionnaireJSON");
const { NUMBER } = require("../constants/answerTypes");
const ctx = {};

describe("Block", () => {
  const createBlockJSON = block =>
    Object.assign(
      {
        id: 1,
        pageType: "QuestionPage",
        type: "General",
        answers: [],
      },
      block
    );

  it("should build valid runner Block from Author page", () => {
    const block = new Block(createBlockJSON(), ctx);

    expect(block).toMatchObject({
      id: "block1",
      questions: [expect.any(Question)],
    });
  });

  it("should not have a title", () => {
    const block = new Block(createBlockJSON(), ctx);

    expect(block.title).toBeUndefined();
  });

  it("should not build routing rules when there is a confirmation page", () => {
    const block = new Block(
      createBlockJSON({
        confirmation: {
          id: "2",
          title: "<p>Are you sure?</p>",
        },
        routing: { id: "2" },
      }),
      ctx
    );

    expect(block.routing_rules).toBeUndefined();
  });

  describe("conversion of page types", () => {
    it("should convert QuestionPage to Questionnaire", () => {
      const block = new Block(
        createBlockJSON({ pageType: "QuestionPage" }),
        ctx
      );

      expect(block.type).toEqual("Question");
    });

    it("should convert InterstitialPage to Interstitial", () => {
      const block = new Block(
        createBlockJSON({ pageType: "InterstitialPage" }),
        ctx
      );

      expect(block.type).toEqual("Interstitial");
    });
  });

  describe("isNotLastPageInSection", () => {
    const questionnaire = {
      sections: [
        {
          pages: [{ id: "1" }, { id: "2" }],
        },
        {
          pages: [{ id: "3" }, { id: "4" }],
        },
      ],
    };

    it("should return true if is a last page", () => {
      expect(isLastPageInSection({ id: "2" }, questionnaire)).toBe(true);
      expect(isLastPageInSection({ id: "4" }, questionnaire)).toBe(true);
    });

    it("should return false if not a last page in a section", () => {
      expect(isLastPageInSection({ id: "1" }, questionnaire)).toBe(false);
      expect(isLastPageInSection({ id: "3" }, questionnaire)).toBe(false);
    });
  });

  describe("piping", () => {
    const createPipeInText = ({
      id = "7151378b-579d-40bf-b4d4-a378c573706a",
      text = "foo",
      pipeType = "answers",
    } = {}) => `<span data-piped="${pipeType}" data-id="${id}">${text}</span>`;

    const createPipeInHtml = ({
      id = "7151378b-579d-40bf-b4d4-a378c573706a",
      text = "foo",
      pipeType = "answers",
    } = {}) =>
      `<strong><span data-piped="${pipeType}" data-id="${id}">${text}</span></strong><ul><li>Some Value</li></ul>`;

    const createContext = (
      metadata = [{ id: "123", type: "Text", key: "my_metadata" }]
    ) => ({
      questionnaireJson: {
        metadata,
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        id: `7151378b-579d-40bf-b4d4-a378c573706a`,
                        type: "Text",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    it("should handle piped values in title", () => {
      const introBlock = Block.buildIntroBlock(
        createPipeInText(),
        "",
        0,
        createContext()
      );

      expect(introBlock.title).toEqual(
        "{{ answers['answer7151378b-579d-40bf-b4d4-a378c573706a'] }}"
      );
    });

    it("should handle piped values in title while stripping html", () => {
      const introBlock = Block.buildIntroBlock(
        createPipeInHtml(),
        "",
        0,
        createContext()
      );

      expect(introBlock.title).toEqual(
        "{{ answers['answer7151378b-579d-40bf-b4d4-a378c573706a'] }}"
      );
    });

    it("should handle piped values in description", () => {
      const introBlock = Block.buildIntroBlock(
        "",
        createPipeInHtml(),
        0,
        createContext()
      );

      expect(introBlock.description).toEqual(
        "<strong>{{ answers['answer7151378b-579d-40bf-b4d4-a378c573706a'] }}</strong><ul><li>Some Value</li></ul>"
      );
    });

    it("should build a calculated summary page", () => {
      const calculatedPageGraphql = {
        id: "1",
        title:
          '<p>Hi is your total <span data-piped="variable"data-id="1">[Total]</span></p>',
        pageType: "CalculatedSummaryPage",
        totalTitle: "<p>Bye</p>",
        summaryAnswers: [
          {
            id: "1",
          },
          {
            id: "2",
          },
          {
            id: "3",
          },
        ],
      };
      const block = new Block(calculatedPageGraphql, ctx);

      expect(block).toMatchObject({
        calculation: {
          answers_to_calculate: ["answer1", "answer2", "answer3"],
          calculation_type: "sum",
          titles: [{ value: "Bye" }],
        },
        id: "block1",
        titles: [{ value: "Hi is your total %(total)s" }],
        type: "CalculatedSummary",
      });
    });
  });

  describe("skip conditions", () => {
    let mockQuestionnaireWithSkip, newCtx;
    beforeEach(() => {
      const buildSkipConditions = questionnaire => {
        const newQuestionnaire = JSON.parse(JSON.stringify(questionnaire));
        const pages = newQuestionnaire.sections[0].folders[0].pages;
        const answers = pages.map(({ answers }) => answers[0]);
        answers[0].type = NUMBER;

        pages[1].skipConditions = [
          {
            id: "3",
            expressions: [
              {
                id: "4",
                left: {
                  type: NUMBER,
                  id: "1",
                },
                condition: "GreaterThan",
                right: {
                  number: "3",
                },
              },
            ],
          },
        ];

        return newQuestionnaire;
      };

      mockQuestionnaireWithSkip = buildSkipConditions(mockQuestionnaire);
      newCtx = { ...ctx, questionnaireJson: mockQuestionnaireWithSkip };
    });
    it("should translate skip conditions correctly", () => {
      const block = new Block(
        mockQuestionnaireWithSkip.sections[0].folders[0].pages[1],
        null,
        newCtx
      );

      const runnerSkipJson = [
        {
          when: [
            {
              id: "answer1",
              condition: "greater than",
              value: "3",
            },
          ],
        },
      ];
      expect(block.skip_conditions).toEqual(runnerSkipJson);
    });
  });
});
