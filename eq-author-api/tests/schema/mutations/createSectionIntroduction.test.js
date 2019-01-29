const executeQuery = require("../../utils/executeQuery");

describe("createSectionIntroduction", () => {
  const createSectionIntro = `
    mutation createSectionIntroduction($input: CreateSectionIntroductionInput!) {
      createSectionIntroduction(input: $input) {
        id
      }
    }
  `;

  let repositories;
  const SECTION_ID = "456";

  beforeEach(() => {
    repositories = {
      Section: {
        update: jest.fn().mockResolvedValueOnce({ id: "456" }),
      },
    };
  });

  it("should allow creation of Section introductions with prefilled values", async () => {
    const input = {
      sectionId: SECTION_ID,
      introductionTitle: "foo",
      introductionContent: "bar",
    };

    const result = await executeQuery(
      createSectionIntro,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.createSectionIntroduction.id).toBe(SECTION_ID);

    expect(repositories.Section.update).toHaveBeenCalledWith({
      id: SECTION_ID,
      introductionEnabled: true,
      introductionTitle: "foo",
      introductionContent: "bar",
    });
  });
});
