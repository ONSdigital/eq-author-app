const questionnaireJson = {
  id: "1",
  title: "Basic Questionnaire JSON",
  summary: false,
  sections: [
    {
      id: "1",
      title: "<p>Section 1</p>",
      folders: [
        {
          id: "folder-1",
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
                  label: "Answer 1",
                  properties: {
                    required: false,
                  },
                },
              ],
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
                  label: "Answer 2",
                  properties: {
                    required: false,
                  },
                },
              ],
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
          id: "folder-2",
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
                  label: "Answer 3",
                  properties: {
                    required: false,
                  },
                },
              ],
            },
            {
              id: "4",
              title: "<p>Page 4</p>",
              pageType: "QuestionPage",
              routingRuleSet: null,
              confirmation: {
                id: "1",
                title: "<p>Page 4 confirmation</p>",
                pageType: "ConfirmationQuestion",
                skipConditions: [
                  {
                    id: "6",
                    expressions: [
                      {
                        id: "11",
                        left: {
                          type: "Number",
                          id: "3",
                        },
                        condition: "GreaterThan",
                        right: {
                          number: "3",
                        },
                      },
                    ],
                  },
                ],
                pageSkipConditions: [
                  {
                    id: "10",
                    expressions: [
                      {
                        id: "12",
                        left: {
                          type: "Number",
                          id: "3",
                        },
                        condition: "GreaterThan",
                        right: {
                          number: "4",
                        },
                      },
                    ],
                  },
                ],
                answers: [
                  {
                    id: "8",
                    type: "Number",
                    label: "Answer 5",
                    properties: {
                      required: false,
                    },
                  },
                ],
              },
              answers: [
                {
                  id: "4",
                  type: "Number",
                  label: "Answer 4",
                  properties: {
                    required: false,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

module.exports = questionnaireJson;
