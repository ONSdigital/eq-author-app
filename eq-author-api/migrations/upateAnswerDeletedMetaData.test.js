const upateAnswerDeletedMetaData = require("./upateAnswerDeletedMetaData");
const { NUMBER, DATE, CHECKBOX, RADIO } = require("../constants/answerTypes");

describe("Migration: set advanced property", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      metadata: [
        {
          dateValue: null,
          displayName: "Trad As",
          id: "19bc6e16-5bc2-4be2-b8fc-a5c863839aa2",
          key: "trad_as",
          languageValue: null,
          regionValue: null,
          textValue: "ESSENTIAL ENTERPRISE LTD.",
          type: "Text_Optional",
          __typename: "Metadata",
        },
        {
          dateValue: null,
          displayName: "Ru Ref",
          id: "8f043f68-d384-42b0-8dd0-95bff1a8f777",
          key: "ru_ref",
          languageValue: null,
          regionValue: null,
          textValue: "12346789012A",
          type: "Text",
          __typename: "Metadata",
        },
      ],
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  confirmation: null,
                  displayName: "[Untitled answer][Trad As]",
                  id: "95a14180-a031-4c0e-b11c-b43b343c4214",
                  pageType: "QuestionPage",
                  position: 0,
                  title:
                    '<p><span data-piped="answers" data-id="7ddb4656-2560-4801-b245-74acc561093e" data-type="Number">[cgnfgn]</span><span data-piped="metadata" data-id="19bc6e16-5bc2-4be2-b8fc-a5c863839aa2" data-type="Text_Optional">[Trad As]</span><span data-piped="metadata" data-id="8f043f68-d384-42b0-8dd0-95bff1a8f7f1" data-type="Text">[Ru Ref]</span> zzz</p>',
                  validationErrorInfo: {
                    errors: [],
                    id: "7fc8ef94-4008-4c20-894e-4e336e3121fa",
                    totalCount: 0,
                    __typename: "ValidationErrorInfo",
                  },
                  __typename: "QuestionPage",

                  answers: [
                    {
                      type: NUMBER,
                      advancedProperties: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should update page title to `Deleted metadata` if that piped metadata is missing", () => {
    const result = upateAnswerDeletedMetaData(questionnaire);
    expect(
      result.sections[0].folders[0].pages[0].answers[0].advancedProperties
    ).toBe(true);
  });

  // it("should set advanced property when mutually exclusive option rule exists", () => {
  //   questionnaire.sections[0].folders[0].pages[0].answers[0].options = [
  //     { id: "123" },
  //   ];
  //   const result = upateAnswerWithAdvancedProperty(questionnaire);
  //   expect(
  //     result.sections[0].folders[0].pages[0].answers[0].advancedProperties
  //   ).toBe(true);
  // });

  // it("should set advanced property when fallback exists", () => {
  //   questionnaire.sections[0].folders[0].pages[0].answers[0] = {
  //     type: DATE,
  //     properties: {
  //       fallback: {
  //         enabled: true,
  //       },
  //     },
  //   };
  //   const result = upateAnswerWithAdvancedProperty(questionnaire);
  //   expect(
  //     result.sections[0].folders[0].pages[0].answers[0].advancedProperties
  //   ).toBe(true);
  // });

  // it("should not set advanced property when option exists for radio", () => {
  //   questionnaire.sections[0].folders[0].pages[0].answers[0] = {
  //     type: RADIO,
  //     advancedProperties: false,
  //     options: [{ id: "123" }],
  //   };

  //   const result = upateAnswerWithAdvancedProperty(questionnaire);
  //   expect(
  //     result.sections[0].folders[0].pages[0].answers[0].advancedProperties
  //   ).toBe(false);
  // });

  // it("should not set advanced property when option exists for checkbox", () => {
  //   questionnaire.sections[0].folders[0].pages[0].answers[0] = {
  //     type: CHECKBOX,
  //     advancedProperties: false,
  //     options: [{ id: "123" }],
  //   };

  //   const result = upateAnswerWithAdvancedProperty(questionnaire);
  //   expect(
  //     result.sections[0].folders[0].pages[0].answers[0].advancedProperties
  //   ).toBe(false);
  // });
});
