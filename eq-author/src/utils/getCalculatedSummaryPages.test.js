import getCalculatedSummaryPages from "./getCalculatedSummaryPages";

const questionnaire = {
  id: "id-1",
  title: "Copy of Test Grand Summary",
  introduction: {
    id: "intro",
  },
  sections: [
    {
      id: "1",
      title: "<p>Section 1</p>",
      folders: [
        {
          id: "1.1",
          alias: "Folder 1",
          pages: [
            {
              id: "1.1.1",
              pageType: "QuestionPage",
              title: "<p>New Q1</p>",
              answers: [
                {
                  id: "1.1.1.1",
                  label: "Num1",
                  qCode: "q1",
                  type: "Number",
                },
              ],
            },
            {
              id: "1.1.2",
              pageType: "QuestionPage",
              title: "<p>Copy of New Q1</p>",
              answers: [
                {
                  id: "1.1.2.1",
                  label: "Num1",
                  qCode: "q2",
                  type: "Number",
                },
              ],
            },
            {
              id: "1.1.3",
              title: "<p>Total Summary 1.1</p>",
              pageType: "CalculatedSummaryPage",
              answers: [
                {
                  id: "1.1.3.1",
                  label: "<p>Total Summary 1.1</p>",
                  type: "Number",
                },
              ],
              summaryAnswers: ["1.1.1.1", "1.1.2.1"],
              totalTitle: "<p>Total Summary 1.1</p>",
              type: "Number",
            },
            {
              id: "1.1.4",
              title: "<p>Total Summary 1.2</p>",
              pageType: "CalculatedSummaryPage",
              answers: [
                {
                  id: "1.1.4.1",
                  label: "<p>Total Summary 1.2</p>",
                  type: "Number",
                },
              ],
              summaryAnswers: ["1.1.1.1", "1.1.2.1"],
              totalTitle: "<p>Total Summary 1.2</p>",
              type: "Number",
            },
          ],
        },
        {
          id: "1.1",
          alias: "Folder 1",
          pages: [
            {
              id: "1.1.5",
              title: "<p>Total Summary 1.3</p>",
              pageType: "CalculatedSummaryPage",
              answers: [
                {
                  id: "1.1.5.1",
                  label: "<p>Total Summary 1.3</p>",
                  type: "Number",
                },
              ],
              summaryAnswers: ["1.1.1.1", "1.1.2.1"],
              totalTitle: "<p>Total Summary 1.2</p>",
              type: "Number",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "<p>Section 2</p>",
      folders: [
        {
          id: "2.1",
          alias: "Folder 2",
          pages: [
            {
              id: "2.1.1",
              pageType: "QuestionPage",
              title: "<p>New Q1</p>",
              answers: [
                {
                  id: "2.1.1.1",
                  label: "Num1",
                  qCode: "q3",
                  type: "Number",
                },
              ],
            },
            {
              id: "2.1.2",
              pageType: "QuestionPage",
              title: "<p>Copy of New Q1</p>",
              answers: [
                {
                  id: "2.1.2.1",
                  label: "Num1",
                  qCode: "q4",
                  type: "Number",
                },
              ],
            },
            {
              id: "2.1.3",
              title: "<p>Total Summary 2</p>",
              pageType: "CalculatedSummaryPage",
              answers: [
                {
                  id: "2.1.3.1",
                  label: "<p>Total Summary 2</p>",
                  type: "Number",
                },
              ],
              summaryAnswers: ["2.1.1.1", "2.1.2.1"],
              totalTitle: "<p>Total Summary 2</p>",
              type: "Number",
            },
          ],
        },
      ],
    },
    {
      id: "3",
      title: "<p>Section 3</p>",
      folders: [
        {
          id: "3.1",
          alias: "Folder 3",
          pages: [
            {
              id: "3.1.1",
              title: "<p>Grand Summary</p>",
              pageType: "CalculatedSummaryPage",
              answers: [
                {
                  id: "3.1.1.1",
                  label: "<p>Grand Summary</p>",
                  type: "Number",
                  validation: {},
                  properties: {},
                },
              ],
              summaryAnswers: [],
              totalTitle: "<p>Grand Summary</p>",
            },
          ],
        },
      ],
    },
  ],
};

describe("utils/getCalculatedSummaryPages", () => {
  it("should return empty array when no pages preceed the target page", () => {
    const previousSections = getCalculatedSummaryPages(
      questionnaire,
      questionnaire.sections[0].folders[0].pages[0].id,
      questionnaire.sections[0].id
    );
    expect(previousSections).toHaveLength(0);
  });

  it("should return empty when the target page is the first calculated summary page", () => {
    const previousSections = getCalculatedSummaryPages(
      questionnaire,
      questionnaire.sections[0].folders[0].pages[2].id,
      questionnaire.sections[0].id
    );
    expect(previousSections).toHaveLength(0);
  });

  it("should return the two calculated summary pages when the target is the calculated summary page in the second section", () => {
    const previousSections = getCalculatedSummaryPages(
      questionnaire,
      questionnaire.sections[1].folders[0].pages[2].id,
      questionnaire.sections[1].id
    );
    expect(previousSections).toHaveLength(1);
    expect(previousSections[0].folders[0].pages).toHaveLength(3);
  });

  it("Should return all the calculated summary answers which preceed the target page", () => {
    const previousSections = getCalculatedSummaryPages(
      questionnaire,
      questionnaire.sections[2].folders[0].pages[0].id,
      questionnaire.sections[2].id
    );
    expect(previousSections).toHaveLength(2);
    expect(previousSections[0].folders[0].pages).toHaveLength(3);
    expect(previousSections[1].folders[0].pages).toHaveLength(1);
  });
});
