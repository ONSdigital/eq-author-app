const onSectionUpdated = require("./onSectionUpdated");

describe("Update piping when repeating sections are used", () => {
  let ctx = {};
  let section, oldSection;

  beforeEach(() => {
    ctx.questionnaire = {
      collectionLists: {
        lists: [
          {
            id: "list_123",
            answers: [
              {
                id: "answer_123",
                label: "Name",
              },
            ],
          },
        ],
      },
    };
    section = {
      repeatingSection: true,
      repeatingSectionListId: "list_123",
      introductionTitle: `Hello <span data-id="answer_123">[Name]</span> employee`,
      introductionContent: `Hello <span data-id="answer_123">[Name]</span> employee`,
      folders: [
        {
          pages: [
            {
              id: 123,
              title: `Hello <span data-id="answer_123">[Name]</span> employee`,
            },
          ],
        },
      ],
    };
  });

  it("Deletes piped list answer text when repeating section turned off", () => {
    oldSection = { ...section };
    section.repeatingSection = false;
    onSectionUpdated(ctx, section, oldSection);

    expect(section.folders[0].pages[0].title).toBe(
      `Hello <span data-id="answer_123">[Deleted answer]</span> employee`
    );
    expect(section.introductionTitle).toBe(
      `Hello <span data-id="answer_123">[Deleted answer]</span> employee`
    );
    expect(section.introductionContent).toBe(
      `Hello <span data-id="answer_123">[Deleted answer]</span> employee`
    );
  });

  it("Deletes piped list answer text when list is changed", () => {
    oldSection = { ...section };
    section.repeatingSectionListId = null;
    onSectionUpdated(ctx, section, oldSection);

    expect(section.folders[0].pages[0].title).toBe(
      `Hello <span data-id="answer_123">[Deleted answer]</span> employee`
    );
    expect(section.introductionTitle).toBe(
      `Hello <span data-id="answer_123">[Deleted answer]</span> employee`
    );
    expect(section.introductionContent).toBe(
      `Hello <span data-id="answer_123">[Deleted answer]</span> employee`
    );
  });

  it("Updates piped list answer text when list is changed back to existing list", () => {
    section.folders[0].pages[0].title = `Hello <span data-id="answer_123">[Deleted answer]</span> employee`;
    section.introductionTitle = `Hello <span data-id="answer_123">[Deleted answer]</span> employee`;
    section.introductionContent = `Hello <span data-id="answer_123">[Deleted answer]</span> employee`;
    oldSection = { ...section };
    oldSection.repeatingSectionListId = null;

    onSectionUpdated(ctx, section, oldSection);

    expect(section.folders[0].pages[0].title).toBe(
      `Hello <span data-id="answer_123">[Name]</span> employee`
    );
    expect(section.introductionTitle).toBe(
      `Hello <span data-id="answer_123">[Name]</span> employee`
    );
    expect(section.introductionContent).toBe(
      `Hello <span data-id="answer_123">[Name]</span> employee`
    );
  });
});
