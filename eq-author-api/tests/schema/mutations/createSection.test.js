const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("createSection", () => {
  const createSection = `
    mutation CreateSection($input: CreateSectionInput!) {
      createSection(input: $input) {
        id
        title
        alias
      }
    }
  `;

  let repositories;
  const QUESTIONNAIRE_ID = "123";
  const SECTION_ID = "456";

  beforeEach(() => {
    repositories = {
      Section: mockRepository({
        insert: { id: SECTION_ID, title: "Test section" }
      }),
      Page: mockRepository({})
    };
  });

  it("should allow creation of Section", async () => {
    const input = {
      alias: "Section alias",
      title: "Test section",
      questionnaireId: QUESTIONNAIRE_ID
    };

    const result = await executeQuery(
      createSection,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.createSection.id).toBe(SECTION_ID);

    expect(repositories.Section.insert).toHaveBeenCalledWith(
      expect.objectContaining(input)
    );

    expect(repositories.Page.insert).toHaveBeenCalledWith(
      expect.objectContaining({ sectionId: SECTION_ID })
    );
  });
});
