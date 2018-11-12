import filterQuestionnaire from "components/ContentPickerModal/filterQuestionnaire";

import {
  CURRENCY,
  DATE_RANGE,
  NUMBER,
  TEXTAREA,
  TEXTFIELD
} from "constants/answer-types";

describe("filterQuestionnaire", () => {
  let questionnaire, answerTypes;

  answerTypes = [TEXTAREA, TEXTFIELD, NUMBER, CURRENCY, DATE_RANGE];

  questionnaire = {
    id: "1",
    metadata: [
      {
        id: "1",
        alias: "Some metadata"
      },
      {
        id: "1",
        alias: "Another metadata"
      }
    ],
    sections: [
      {
        id: "1",
        pages: [
          {
            id: "1",
            answers: [
              {
                id: "1",
                label: "Answer 1",
                type: TEXTFIELD
              },
              {
                id: "2",
                label: "Answer 2",
                type: NUMBER
              }
            ]
          },
          {
            id: "2",
            answers: [
              {
                id: "3",
                label: "Answer 3",
                type: CURRENCY
              }
            ]
          }
        ]
      },
      {
        id: "2",
        pages: [
          {
            id: "3",
            answers: [
              {
                id: "4",
                label: "Answer 4",
                type: TEXTFIELD
              },
              {
                id: "5",
                label: "Answer 5",
                type: NUMBER
              }
            ]
          },
          {
            id: "4",
            answers: [
              {
                id: "6",
                label: "Answer 6",
                type: TEXTFIELD
              }
            ]
          }
        ]
      }
    ]
  };

  it("should only allow selection of answers before the current page", () => {
    const section = questionnaire.sections[0];
    const page = section.pages[1];

    const content = filterQuestionnaire({
      answerTypes,
      questionnaire: questionnaire,
      sectionId: section.id,
      pageId: page.id
    });

    expect(content).toMatchSnapshot();
  });

  it("shouldn't show current section if on first page of section", () => {
    const section = questionnaire.sections[1];
    const page = section.pages[0];

    const content = filterQuestionnaire({
      answerTypes,
      questionnaire: questionnaire,
      sectionId: section.id,
      pageId: page.id
    });

    expect(content).toMatchSnapshot();
  });

  it("should filter answers types correctly", () => {
    const section = questionnaire.sections[1];
    const page = section.pages[0];
    const answerTypes = [NUMBER];

    const content = filterQuestionnaire({
      answerTypes,
      questionnaire: questionnaire,
      sectionId: section.id,
      pageId: page.id
    });

    expect(content).toMatchSnapshot();
  });

  it("should return child answers for CompositeAnswers", () => {
    questionnaire.sections[0].pages[0].answers[0] = {
      id: "1",
      __typename: "CompositeAnswer",
      type: DATE_RANGE,
      childAnswers: [
        {
          id: "20",
          type: TEXTFIELD,
          displayName: "Earliest"
        },
        {
          id: "21",
          type: TEXTFIELD,
          displayName: "Latest"
        }
      ]
    };
    const section = questionnaire.sections[1];
    const page = section.pages[0];

    const content = filterQuestionnaire({
      answerTypes,
      questionnaire: questionnaire,
      sectionId: section.id,
      pageId: page.id
    });

    expect(content).toMatchSnapshot();
  });

  it("should not return any answers when no answer types specified", () => {
    const answerTypes = [];
    const section = questionnaire.sections[1];
    const page = section.pages[0];

    const content = filterQuestionnaire({
      answerTypes,
      questionnaire: questionnaire,
      sectionId: section.id,
      pageId: page.id
    });

    expect(content).toMatchSnapshot();
  });

  it("should return empty array when no questionnaire", () => {
    const answerTypes = [];
    const section = questionnaire.sections[1];
    const page = section.pages[0];

    const content = filterQuestionnaire({
      answerTypes,
      questionnaire: null,
      sectionId: section.id,
      pageId: page.id
    });

    expect(content).toMatchSnapshot();
  });
});
