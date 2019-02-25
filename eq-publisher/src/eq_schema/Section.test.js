const Block = require("./Block");
const Section = require("./Section");

describe("Section", () => {
  const createSectionJSON = options =>
    Object.assign(
      {
        id: "1",
        title: "Section 1",
        pages: [
          {
            id: "2",
            answers: [],
          },
        ],
      },
      options
    );
  const createCtx = (options = {}) => ({
    routingGotos: [],
    questionnaireJson: { navigation: true },
    ...options,
  });

  it("should build valid runner Section from Author section", () => {
    const section = new Section(createSectionJSON(), createCtx());

    expect(section).toMatchObject({
      id: "section1",
      title: "Section 1",
      groups: [
        {
          id: "group1",
          title: "Section 1",
          blocks: [expect.any(Block)],
        },
      ],
    });
  });

  it("should not output title when navigation is disabled", () => {
    const section = new Section(
      createSectionJSON(),
      createCtx({ questionnaireJson: { navigation: false } })
    );

    expect(section).toMatchObject({
      id: "section1",
      groups: [
        {
          id: "group1",
          title: "",
          blocks: [expect.any(Block)],
        },
      ],
    });
  });
});
