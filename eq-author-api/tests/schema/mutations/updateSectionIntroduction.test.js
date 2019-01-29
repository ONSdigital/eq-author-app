const executeQuery = require("../../utils/executeQuery");

describe("updateSectionIntroduction", () => {
  const updateSectionIntro = `
    mutation updateSectionIntroduction($input: UpdateSectionIntroductionInput!) {
      updateSectionIntroduction(input: $input) {
        id
        introductionContent
        introductionTitle

      }
    }
  `;

  let repositories;
  const SECTION_ID = "456";

  beforeEach(() => {
    repositories = {
      Section: {
        update: jest.fn().mockResolvedValueOnce({
          id: "456",
          introductionEnabled: true,
          introductionContent: "foo",
          introductionTitle: "bar",
        }),
      },
    };
  });

  it("should allow update of Section introductions", async () => {
    const input = {
      sectionId: SECTION_ID,
      introductionContent: "foo",
      introductionTitle: "bar",
    };

    const result = await executeQuery(
      updateSectionIntro,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.updateSectionIntroduction).toMatchObject({
      id: SECTION_ID,
      introductionContent: "foo",
      introductionTitle: "bar",
    });

    expect(repositories.Section.update).toHaveBeenCalledWith({
      id: SECTION_ID,
      introductionContent: "foo",
      introductionTitle: "bar",
    });
  });
});
