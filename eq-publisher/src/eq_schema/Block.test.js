const Block = require("./Block");
const { isLastPageInSection } = require("./Block");
const Question = require("./Question");
const ctx = {};

describe("Block", () => {
  const createBlockJSON = block =>
    Object.assign(
      {
        id: 1,
        pageType: "Question",
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
      id = 123,
      type = "TextField",
      text = "foo",
      pipeType = "answers",
    } = {}) =>
      `<span data-piped="${pipeType}" data-id="${id}" data-type="${type}">${text}</span>`;

    const createPipeInHtml = ({
      id = 123,
      type = "TextField",
      text = "foo",
      pipeType = "answers",
    } = {}) =>
      `<strong><span data-piped="${pipeType}" data-id="${id}" data-type="${type}">${text}</span></strong><ul><li>Some Value</li></ul>`;

    const createContext = (
      metadata = [{ id: "123", type: "Text", key: "my_metadata" }]
    ) => ({
      questionnaireJson: {
        metadata,
      },
    });

    it("should handle piped values in title", () => {
      const introBlock = Block.buildIntroBlock(
        createPipeInText(),
        "",
        0,
        createContext()
      );

      expect(introBlock.title).toEqual("{{ answers['answer123'] }}");
    });

    it("should handle piped values in title while stripping html", () => {
      const introBlock = Block.buildIntroBlock(
        createPipeInHtml(),
        "",
        0,
        createContext()
      );

      expect(introBlock.title).toEqual("{{ answers['answer123'] }}");
    });

    it("should handle piped values in description", () => {
      const introBlock = Block.buildIntroBlock(
        "",
        createPipeInHtml(),
        0,
        createContext()
      );

      expect(introBlock.description).toEqual(
        "<strong>{{ answers['answer123'] }}</strong><ul><li>Some Value</li></ul>"
      );
    });
  });
});
