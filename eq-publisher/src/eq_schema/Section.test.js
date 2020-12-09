const Block = require("./Block");
const Section = require("./Section");

describe("Section", () => {
  const createSectionJSON = options =>
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
          id: "groupf1",
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
          id: "groupf1",
          title: "",
          blocks: [expect.any(Block)],
        },
      ],
    });
  });

  describe("mergeDisabledFolders", () => {
    let sectionJSON;
    beforeEach(() => {
      sectionJSON = createSectionJSON();
    });

    it("should merge consecutive disabled folders together", () => {
      sectionJSON.folders.push(sectionJSON.folders[0]);
      const section = new Section(sectionJSON, createCtx());

      expect(section.groups).toHaveLength(1);
    });

    it("shouldn't merge enabled folders with previous disabled folder", () => {
      sectionJSON.folders.push({
        ...sectionJSON.folders[0],
        enabled: true,
      });
      const section = new Section(sectionJSON, createCtx());

      expect(section.groups).toHaveLength(2);
    });

    it("shouldn't merge disabled folders with previous enabled folder", () => {
      sectionJSON.folders.push(sectionJSON.folders[0]);
      sectionJSON.folders[0].enabled = true;
      const section = new Section(sectionJSON, createCtx());

      expect(section.groups).toHaveLength(2);
    });
  });
});
