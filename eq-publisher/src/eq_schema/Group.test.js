/* eslint-disable camelcase */
const Group = require("./Group");
const Block = require("./Block");
const ctx = {};

describe("Group", () => {
  const createGroupJSON = options =>
    Object.assign(
      {
        id: "1",
        title: "Section 1",
        introduction: {
          introductionTitle: "Intro Title",
          introductionContent: "Intro Content",
          introductionEnabled: false
        },
        pages: [
          {
            id: "2",
            answers: []
          }
        ]
      },
      options
    );

  it("should build valid runner Group from Author section", () => {
    let groupJSON = createGroupJSON();
    const group = new Group(
      groupJSON.id,
      groupJSON.title,
      groupJSON.pages,
      groupJSON.introduction,
      ctx
    );

    expect(group).toMatchObject({
      id: "group1",
      title: "Section 1",
      blocks: [expect.any(Block)]
    });
  });

  it("should handle HTML values", () => {
    let groupJSON = createGroupJSON({ title: "<p>Section <em>1</em></p>" });
    const group = new Group(
      groupJSON.id,
      groupJSON.title,
      groupJSON.pages,
      groupJSON.introduction,
      ctx
    );

    expect(group).toMatchObject({
      title: "Section <em>1</em>"
    });
  });

  it("returns a schema with an introduction when there is one", () => {
    const groupJSON = createGroupJSON();

    const runnerJSON = new Group(
      groupJSON.id,
      groupJSON.title,
      groupJSON.pages,
      {
        ...groupJSON.introduction,
        introductionEnabled: true
      },
      ctx
    );

    expect(runnerJSON).toMatchObject({
      id: "group1",
      title: "Section 1",
      blocks: [
        {
          description: "Intro Content",
          id: "group1-introduction",
          title: "Intro Title",
          type: "Interstitial"
        },
        expect.any(Block)
      ]
    });
  });

  it("returns a schema with an empty introduction when null title and content", () => {
    const groupJSON = createGroupJSON();

    const runnerJSON = new Group(
      groupJSON.id,
      groupJSON.title,
      groupJSON.pages,
      {
        introductionTitle: null,
        introductionContent: null,
        introductionEnabled: true
      },
      ctx
    );

    expect(runnerJSON).toMatchObject({
      id: "group1",
      title: "Section 1",
      blocks: [
        {
          id: "group1-introduction",
          title: "",
          description: "",
          type: "Interstitial"
        },
        expect.any(Block)
      ]
    });
  });

  it("returns a schema without an introduction when it is disabled", () => {
    const groupJSON = createGroupJSON();

    const runnerJSON = new Group(
      groupJSON.id,
      groupJSON.title,
      groupJSON.pages,
      groupJSON.introduction,
      ctx
    );

    expect(runnerJSON.blocks).toHaveLength(1);
  });

  describe("skip conditions", () => {
    const createGroupsJSON = () => [
      {
        id: 1,
        title: "Group 1",
        pages: [],
        introduction: {
          introductionTitle: "Intro Title",
          introductionContent: "Intro Content",
          introductionEnabled: false
        }
      },
      {
        id: 2,
        title: "Group 2",
        pages: [],
        introduction: {
          introductionTitle: "Intro Title",
          introductionContent: "Intro Content",
          introductionEnabled: false
        }
      },
      {
        id: 3,
        title: "Group 3",
        pages: [],
        introduction: {
          introductionTitle: "Intro Title",
          introductionContent: "Intro Content",
          introductionEnabled: false
        }
      }
    ];

    it("should add skip conditions to the required groups", () => {
      const groupsJson = createGroupsJSON();

      const ctx = {
        routingGotos: [
          {
            group: "confirmation-group",
            when: {
              id: "answer1",
              condition: "equals",
              value: "Goto End"
            },
            groupId: "group1"
          }
        ]
      };

      const runnerJson = groupsJson.map(
        group =>
          new Group(group.id, group.title, group.pages, group.introduction, ctx)
      );

      const expectedrunnerJson = [
        { id: "group1", title: "Group 1", blocks: [] },
        {
          id: "group2",
          title: "Group 2",
          blocks: [],
          skip_conditions: [
            { when: { id: "answer1", condition: "equals", value: "Goto End" } }
          ]
        },
        {
          id: "group3",
          title: "Group 3",
          blocks: [],
          skip_conditions: [
            { when: { id: "answer1", condition: "equals", value: "Goto End" } }
          ]
        }
      ];

      expect(runnerJson[0]).not.toHaveProperty("skip_conditions");

      expect(runnerJson).toMatchObject(expectedrunnerJson);
    });

    it("can handle multiple skip conditions for each group", () => {
      const groupsJson = createGroupsJSON();

      const ctx = {
        routingGotos: [
          {
            group: "confirmation-group",
            when: {
              id: "answer1",
              condition: "equals",
              value: "Goto End"
            },
            groupId: "group1"
          },
          {
            group: "group3",
            when: {
              id: "answer1",
              condition: "equals",
              value: "Goto group3"
            },
            groupId: "group1"
          }
        ]
      };

      const runnerJson = groupsJson.map(
        group =>
          new Group(group.id, group.title, group.pages, group.introduction, ctx)
      );

      const expectedrunnerJson = [
        { id: "group1", title: "Group 1", blocks: [] },
        {
          id: "group2",
          title: "Group 2",
          blocks: [],
          skip_conditions: [
            { when: { id: "answer1", condition: "equals", value: "Goto End" } },
            {
              when: { id: "answer1", condition: "equals", value: "Goto group3" }
            }
          ]
        },
        {
          id: "group3",
          title: "Group 3",
          blocks: [],
          skip_conditions: [
            { when: { id: "answer1", condition: "equals", value: "Goto End" } }
          ]
        }
      ];

      expect(runnerJson).toMatchObject(expectedrunnerJson);
    });
  });

  describe("confirmation pages", () => {
    const ctxGenerator = routingRuleSet => ({
      routingGotos: [],
      questionnaireJson: {
        sections: [
          {
            id: "4",
            title: "<p>Section 1</p>",
            pages: [
              {
                id: "1",
                title: "<p>Test question</p>",
                description: "",
                guidance: null,
                pageType: "QuestionPage",
                routingRuleSet: routingRuleSet,
                confirmation: {
                  id: "2",
                  title: "<p>Are you sure?</p>",
                  page: {
                    id: "1"
                  },
                  positive: {
                    label: "Oh yes.",
                    description: "Positive"
                  },
                  negative: {
                    label: "Wait I can get more?",
                    description: "Negative"
                  }
                },
                answers: [
                  {
                    id: "6",
                    type: "Currency",
                    label: "How much money do you want?",
                    description: "",
                    guidance: "",
                    properties: {
                      decimals: 0,
                      required: false
                    },
                    qCode: ""
                  }
                ]
              }
            ]
          }
        ]
      }
    });

    it("should build a confirmation page", () => {
      const ctx = ctxGenerator(null);
      const resultantJson = new Group(
        ctx.questionnaireJson.sections[0].id,
        ctx.questionnaireJson.sections[0].title,
        ctx.questionnaireJson.sections[0].pages,
        { introductionEnabled: false },
        ctx
      );

      const expectedRunnerBlock = {
        id: "blockconfirmation-page-for-1",
        type: "ConfirmationQuestion",
        questions: [
          {
            id: "questionconfirmation-page-for-1",
            title: "Are you sure?",
            description: "",
            type: "General",
            answers: [
              {
                id: "answerconfirmation-answer-for-1",
                mandatory: true,
                type: "Radio",
                options: [
                  {
                    label: "Oh yes.",
                    value: "Oh yes.",
                    description: "Positive"
                  },
                  {
                    label: "Wait I can get more?",
                    value: "Wait I can get more?",
                    description: "Negative"
                  }
                ]
              }
            ]
          }
        ],
        routing_rules: [
          {
            goto: {
              block: "block1",
              when: [
                {
                  id: "answerconfirmation-answer-for-1",
                  condition: "not equals",
                  value: "Oh yes."
                },
                {
                  id: "answerconfirmation-answer-for-1",
                  condition: "set"
                }
              ]
            }
          },
          {
            goto: {
              group: "confirmation-group"
            }
          }
        ]
      };

      expect(resultantJson.blocks[1]).toMatchObject(expectedRunnerBlock);
    });

    it("copies routing rules from the previous question", () => {
      const routingRuleSet = {
        id: "2",
        else: {
          __typename: "LogicalDestination",
          logicalDestination: "NextPage"
        },
        routingRules: [
          {
            id: "2",
            operation: "And",
            goto: {
              __typename: "AbsoluteDestination",
              absoluteDestination: {
                id: "2",
                __typename: "Section"
              }
            },
            conditions: [
              {
                id: "2",
                comparator: "GreaterOrEqual",
                answer: {
                  id: "1",
                  type: "Currency"
                },
                routingValue: {
                  numberValue: 100
                }
              }
            ]
          },
          {
            id: "3",
            operation: "And",
            goto: {
              __typename: "AbsoluteDestination",
              absoluteDestination: {
                id: "3",
                __typename: "Section"
              }
            },
            conditions: [
              {
                id: "3",
                comparator: "LessThan",
                answer: {
                  id: "1",
                  type: "Currency"
                },
                routingValue: {
                  numberValue: 100
                }
              }
            ]
          }
        ]
      };

      const ctx = ctxGenerator(routingRuleSet);

      const resultantJson = new Group(
        ctx.questionnaireJson.sections[0].id,
        ctx.questionnaireJson.sections[0].title,
        ctx.questionnaireJson.sections[0].pages,
        { introductionEnabled: false },
        ctx
      );

      const expectedRunnerRouting = [
        {
          goto: {
            block: "block1",
            when: [
              {
                id: "answerconfirmation-answer-for-1",
                condition: "not equals",
                value: "Oh yes."
              },
              {
                id: "answerconfirmation-answer-for-1",
                condition: "set"
              }
            ]
          }
        },
        {
          goto: {
            group: "group2",
            when: [
              {
                id: "answer1",
                condition: "greater than or equal to",
                value: 100
              }
            ]
          }
        },
        {
          goto: {
            group: "group3",
            when: [
              {
                id: "answer1",
                condition: "less than",
                value: 100
              }
            ]
          }
        },
        {
          goto: {
            group: "confirmation-group"
          }
        }
      ];

      expect(resultantJson.blocks[0].routing_rules).toBeUndefined();

      expect(resultantJson.blocks[1].routing_rules).toEqual(
        expectedRunnerRouting
      );
    });

    it("pipes in checkbox values from the previous questions", () => {
      const ctx = ctxGenerator(null);

      ctx.questionnaireJson.sections[0].pages[0].answers[0] = {
        id: "6",
        type: "Checkbox",
        label: "Test",
        description: "",
        guidance: "",
        options: [
          {
            id: "Foo",
            label: "Foo"
          },
          {
            id: "Bar",
            label: "Bar"
          },
          {
            id: "Baz",
            label: "Baz"
          }
        ],
        properties: {
          required: false
        }
      };

      const resultantJson = new Group(
        ctx.questionnaireJson.sections[0].id,
        ctx.questionnaireJson.sections[0].title,
        ctx.questionnaireJson.sections[0].pages,
        { introductionEnabled: false },
        ctx
      );

      expect(resultantJson.blocks[1].questions[0].description).toEqual(
        `{{ answers['answer${
          ctx.questionnaireJson.sections[0].pages[0].answers[0].id
        }']|format_unordered_list }}`
      );
    });
  });
});
