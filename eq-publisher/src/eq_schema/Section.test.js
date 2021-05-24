const Block = require("./Block");
const Section = require("./Section");
const mergeDisabledFolders = Section.mergeDisabledFolders;

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

  describe("mergeDisabledFolders", () => {
    const generateFolder = (input = {}) => ({
      id: `folder-${Math.random()}`,
      pages: [],
      ...input,
    });

    it("should merge consecutive disabled folders together", () => {
      const folders = [true, false, false, false].map((enabled) =>
        generateFolder({ enabled })
      );
      expect(mergeDisabledFolders(folders)).toHaveLength(2);
    });

    it("shouldn't merge enabled folders with previous disabled folder", () => {
      const folders = [true, false, true, true].map((enabled) =>
        generateFolder({ enabled })
      );
      expect(mergeDisabledFolders(folders)).toHaveLength(4);
    });

    it("shouldn't merge disabled folders with previous enabled folder", () => {
      const folders = [true, true, false].map((enabled) =>
        generateFolder({ enabled })
      );
      expect(mergeDisabledFolders(folders)).toHaveLength(3);
    });
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
