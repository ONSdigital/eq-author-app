const executeQuery = require("../../utils/executeQuery");

describe("deleteSectionIntroduction", () => {
  const deleteSectionIntro = `
    mutation deleteSectionIntroduction($input: DeleteSectionIntroductionInput!) {
      deleteSectionIntroduction(input: $input) {
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

  it("should allow deletion of Section introductions", async () => {
    const input = {
      sectionId: SECTION_ID,
    };

    const result = await executeQuery(
      deleteSectionIntro,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.deleteSectionIntroduction.id).toBe(SECTION_ID);

    expect(repositories.Section.update).toHaveBeenCalledWith({
      id: SECTION_ID,
      introductionEnabled: false,
      introductionTitle: null,
      introductionContent: null,
    });
  });
});
