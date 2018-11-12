const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("updateSection", () => {
  const updateSection = `
    mutation UpdateSection($input: UpdateSectionInput!) {
      updateSection(input: $input) {
        id
        title
        alias
        introductionTitle
        introductionContent
        introductionEnabled
      }
    }
  `;

  let repositories, input;

  beforeEach(() => {
    input = {
      id: "1",
      title: "Updated section title",
      alias: "Updated section alias",
      description: "This is an updated section description",
      introductionTitle: "updated intro title",
      introductionContent: "updated intro content",
      introductionEnabled: true
    };
    repositories = {
      Section: mockRepository()
    };
  });

  it("should allow update of Section", async () => {
    input = {
      id: "1",
      title: "Updated section title",
      alias: "Updated section alias"
    };

    const result = await executeQuery(
      updateSection,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Section.update).toHaveBeenCalledWith(input);
  });
});
