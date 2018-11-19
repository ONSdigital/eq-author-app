export default {
  data: {
    duplicateSection: {
      __typename: "Section",
      id: "2",
      title: "Copy of Section 1",
      alias: "",
      position: 2,
      displayName: "Copy of Section 1",
      pages: [
        {
          __typename: "QuestionPage",
          id: "2",
          title: "",
          description: "",
          position: 1,
          displayName: "",
          pageType: "QuestionPage",
          answers: [],
          confirmation: null
        }
      ],
      questionnaire: {
        __typename: "Questionnaire",
        id: "1",
        questionnaireInfo: {
          __typename: "QuestionnaireInfo",
          totalSectionCount: 2
        },
        sections: [
          {
            id: "1",
            __typename: "Section"
          },
          {
            id: "2",
            __typename: "Section"
          }
        ]
      }
    }
  }
};
