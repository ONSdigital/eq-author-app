export default {
  data: {
    questionnaire: {
      id: "1",
      title: "Test",
      description: "",
      surveyId: "",
      theme: "default",
      legalBasis: "StatisticsOfTradeAct",
      navigation: false,
      summary: false,
      __typename: "Questionnaire",
      sections: [
        {
          id: "1",
          title: "Section 1",
          position: 0,
          alias: "",
          displayName: "Section 1",
          pages: [
            {
              id: "1",
              title: "",
              alias: "",
              displayName: "",
              position: 0,
              __typename: "QuestionPage"
            }
          ],
          questionnaire: {
            id: "1",
            questionnaireInfo: {
              totalSectionCount: 1,
              __typename: "QuestionnaireInfo"
            },
            __typename: "Questionnaire"
          },
          __typename: "Section"
        }
      ]
    }
  }
};
