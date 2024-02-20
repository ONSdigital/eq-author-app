const removeExtraSpaces = require("./removeExtraSpaces");

describe("removeExtraSpaces", () => {
  it("should remove extra spaces from string values", () => {
    const sectionTitleWithExtraSpaces = " Section   1 ";

    const sectionTitleWithoutExtraSpaces = removeExtraSpaces(
      sectionTitleWithExtraSpaces
    );

    expect(sectionTitleWithoutExtraSpaces).toEqual("Section 1");
  });

  it("should remove extra spaces from arrays of strings", () => {
    const answerLabelsWithExtraSpaces = [
      "Answer  1 ",
      " Answer   2",
      " Answer  3 ",
    ];

    const answerLabelsWithoutExtraSpaces = removeExtraSpaces(
      answerLabelsWithExtraSpaces
    );

    expect(answerLabelsWithoutExtraSpaces).toEqual([
      "Answer 1",
      "Answer 2",
      "Answer 3",
    ]);
  });

  it("should remove extra spaces from all string values in object", () => {
    const sectionWithExtraSpaces = {
      id: "section-with-extra-spaces-1",
      title: " Section   with extra  spaces 1 ",
      folders: [
        {
          id: "folder-with-extra-spaces-1",
          alias: " Folder  with extra spaces  1",
          pages: [
            {
              id: "page-with-extra-spaces-1",
              title: "Page with  extra spaces  1 ",
              answers: [
                {
                  id: "answer-with-extra-spaces-1",
                  label: " Answer with extra  spaces 1",
                },
              ],
            },
          ],
        },
      ],
    };

    const sectionWithoutExtraSpaces = removeExtraSpaces(sectionWithExtraSpaces);

    expect(sectionWithoutExtraSpaces).toMatchObject({
      id: "section-with-extra-spaces-1",
      title: "Section with extra spaces 1",
      folders: [
        {
          id: "folder-with-extra-spaces-1",
          alias: "Folder with extra spaces 1",
          pages: [
            {
              id: "page-with-extra-spaces-1",
              title: "Page with extra spaces 1",
              answers: [
                {
                  id: "answer-with-extra-spaces-1",
                  label: "Answer with extra spaces 1",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("should remove extra spaces from arrays of strings in objects", () => {
    const page = {
      id: "page-1",
      title: " Page 1",
      answerLabels: ["Answer  1", "Answer   2  ", "Answer  3"], // Mock value to test array of strings in an object - `answerLabels` is not an attribute of `page` in Author
    };

    const pageWithoutExtraSpaces = removeExtraSpaces(page);

    expect(pageWithoutExtraSpaces).toMatchObject({
      id: "page-1",
      title: "Page 1",
      answerLabels: ["Answer 1", "Answer 2", "Answer 3"],
    });
  });
});
