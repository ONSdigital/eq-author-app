export default (options = {}) => ({
  data: {
    section: Object.assign(
      {
        id: "1",
        title: "Section 1",
        alias: "",
        displayName: "Section 1",
        position: 1,
        introductionEnabled: false,
        introductionTitle: "",
        introductionContent: "",
        questionnaire: {
          id: "1",
          questionnaireInfo: {
            totalSectionCount: 1,
            __typename: "QuestionnaireInfo"
          },
          __typename: "Questionnaire"
        },
        __typename: "Section"
      },
      options
    )
  }
});
