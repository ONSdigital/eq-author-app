const convertEmTagsToStrongTags = require("./convertEmTagsToStrongTags");

describe("convertEmTagsToStrongTags", () => {
  it("should replace em tags with strong tags in a string", () => {
    const emText = "<em>Question 1</em>";

    expect(convertEmTagsToStrongTags(emText)).toEqual(
      "<strong>Question 1</strong>"
    );
  });

  it("should not replace strong tags", () => {
    const strongText = "<strong>Question 1</strong>";

    expect(convertEmTagsToStrongTags(strongText)).toEqual(strongText);
  });

  it("should replace em tags with strong tags in an array of strings", () => {
    const emArray = ["<em>Question 1</em>", "<em>Question 2</em>"];

    expect(convertEmTagsToStrongTags(emArray)).toEqual([
      "<strong>Question 1</strong>",
      "<strong>Question 2</strong>",
    ]);
  });

  it("should replace em tags with strong tags in an object", () => {
    const page = {
      title: "<em>Test title</em>",
      description: "<em>Test description</em>",
      answers: [
        {
          label: "<em>Answer 1</em>",
        },
        {
          label: "<em>Answer 2</em>",
        },
      ],
    };

    expect(convertEmTagsToStrongTags(page)).toEqual({
      title: "<strong>Test title</strong>",
      description: "<strong>Test description</strong>",
      answers: [
        {
          label: "<strong>Answer 1</strong>",
        },
        {
          label: "<strong>Answer 2</strong>",
        },
      ],
    });
  });

  it("should not wrap text in two strong tags when text is wrapped in strong and em tags", () => {
    const emTagsWrappedInStrong = "<strong><em>Question 1</em></strong>";
    const strongTagsWrappedInEm = "<em><strong>Question 2</strong></em>";

    expect(convertEmTagsToStrongTags(emTagsWrappedInStrong)).toEqual(
      "<strong>Question 1</strong>"
    );
    expect(convertEmTagsToStrongTags(strongTagsWrappedInEm)).toEqual(
      "<strong>Question 2</strong>"
    );
  });

  it("should return undefined if inputData is undefined", () => {
    expect(convertEmTagsToStrongTags(undefined)).toBeUndefined(); // convertEmTagsToStrongTags returns inputData, which is undefined
  });

  it("should return null if inputData is null", () => {
    expect(convertEmTagsToStrongTags(null)).toBeNull(); // convertEmTagsToStrongTags returns inputData, which is null
  });

  it("should return inputData if inputData is not string, array, or object", () => {
    expect(convertEmTagsToStrongTags(true)).toEqual(true);
  });
});
