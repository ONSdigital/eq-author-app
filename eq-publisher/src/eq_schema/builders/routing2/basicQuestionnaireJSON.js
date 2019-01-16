const questionnaireJson = {
  id: "1",
  title: "Basic Questionnaire JSON",
  summary: false,
  sections: [
    {
      id: "1",
      title: "<p>Section 1</p>",
      pages: [
        {
          id: "1",
          title: "<p>Page 1</p>",
          pageType: "QuestionPage",
          routingRuleSet: null,
          confirmation: null,
          answers: [
            {
              id: "1",
              type: "Currency",
              label: "Answer 1"
            }
          ]
        },
        {
          id: "2",
          title: "<p>Page 2</p>",
          pageType: "QuestionPage",
          routingRuleSet: null,
          confirmation: null,
          answers: [
            {
              id: "2",
              type: "Number",
              label: "Answer 2"
            }
          ]
        }
      ]
    },
    {
      id: "2",
      title: "<p>Section 2</p>",
      pages: [
        {
          id: "3",
          title: "<p>Page 3</p>",
          pageType: "QuestionPage",
          routingRuleSet: null,
          confirmation: null,
          answers: [
            {
              id: "3",
              type: "Number",
              label: "Answer 3"
            }
          ]
        }
      ]
    }
  ]
};

module.exports = questionnaireJson;
