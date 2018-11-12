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
        answers: []
      },
      block
    );

  it("should build valid runner Block from Author page", () => {
    const block = new Block(createBlockJSON(), ctx);

    expect(block).toMatchObject({
      id: "block1",
      questions: [expect.any(Question)]
    });
  });

  it("should not have a title", () => {
    const block = new Block(createBlockJSON(), ctx);

    expect(block.title).toBeUndefined();
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
          pages: [{ id: "1" }, { id: "2" }]
        },
        {
          pages: [{ id: "3" }, { id: "4" }]
        }
      ]
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
});
