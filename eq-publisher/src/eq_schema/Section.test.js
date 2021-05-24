const Block = require("./Block");
const Section = require("./Section");

describe("Section", () => {
  const createSectionJSON = (options) =>
    Object.assign(
      {
        id: "1",
        title: "Section 1",
        folders: [
          {
            id: "f1",
            enabled: false,
            pages: [
              {
                id: "2",
                answers: [],
              },
            ],
          },
          {
            id: "f2",
            enabled: true,
            skipConditions: [
              {
                id: "d0ddc0d3-9788-4663-a724-53e45fde49c7",
                operator: "And",
                expressions: [
                  {
                    id: "dd762315-8b00-40e9-a1ae-c382538de6ef",
                    condition: "Equal",
                    left: {
                      type: "Number",
                      id: "super-answer-reference",
                    },
                    right: {
                      number: 42,
                    },
                  },
                ],
              },
            ],
            pages: [
              {
                id: "page-1",
                answers: [],
              },
              {
                id: "page-2",
                answers: [],
              },
            ],
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
          blocks: expect.arrayContaining([expect.any(Block)]),
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
          blocks: expect.arrayContaining([expect.any(Block)]),
        },
      ],
    });
  });

  it("should add skip conditions from folder to consistuent questions", () => {
    const section = new Section(
      createSectionJSON(),
      createCtx({ questionnaireJson: { navigation: false } })
    );

    const skipConditionsOutput = [
      {
        when: [
          {
            id: "answersuper-answer-reference",
            condition: "equals",
            value: 42,
          },
        ],
      },
    ];

    expect(section.groups[0].blocks[0].skip_conditions).toBeUndefined();
    expect(section.groups[0].blocks[1].skip_conditions).toMatchObject(
      skipConditionsOutput
    );
    expect(section.groups[0].blocks[2].skip_conditions).toMatchObject(
      skipConditionsOutput
    );
  });

  describe("Section introduction", () => {
    it("should add introduction content to first group if present", () => {
      const sectionJSON = createSectionJSON();
      const title = "Hello, world!";
      const description = "<h1>Hello, world!</h1>";
      sectionJSON.introductionTitle = title;
      sectionJSON.introductionContent = description;

      const section = new Section(sectionJSON, createCtx());
      const introBlock = section.groups[0].blocks[0];

      expect(introBlock.title).toBe(title);
      expect(introBlock.type).toBe("Interstitial");
      expect(introBlock.description).toBe(description);
    });

    it("shouldn't add introduction block when there's no title / content", () => {
      const sectionJSON = createSectionJSON();
      const section = new Section(sectionJSON, createCtx());
      expect(section.groups[0].blocks[0].type).not.toBe("Interstitial");
    });
  });
});
