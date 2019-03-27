const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");
const { RADIO, NUMBER } = require("../../constants/answerTypes");
const executeQuery = require("../../tests/utils/executeQuery");
const {
  createRoutingMutation,
  updateRoutingMutation,
  createRoutingRuleMutation,
  updateRoutingRuleMutation,
  deleteRoutingRuleMutation,
  updateExpressionGroupMutation,
  createBinaryExpressionMutation,
  updateBinaryExpressionMutation,
  deleteBinaryExpressionMutation,
  updateRightSideMutation,
  updateLeftSideMutation,
} = require("../../tests/utils/questionnaireBuilder/routing");

const { queryPage } = require("../../tests/utils/questionnaireBuilder/page");

describe("routing", () => {
  describe("A Routing", () => {
    // Passes intermittently
    it("should create a full routing tree when creating a routing", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const page = questionnaire.sections[0].pages[0];

      await executeQuery(
        createRoutingMutation,
        {
          input: { pageId: page.id },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, page.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0].left.id
      ).toBeTruthy();
    });

    // Passes intermittently
    it("should be able to update the else destination on a routing", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
                routing: {},
              },
              {
                title: "page-2",
                parentSection: "title-2",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const secondPage = questionnaire.sections[0].pages[1];

      await executeQuery(
        updateRoutingMutation,
        {
          input: {
            id: firstPage.routing.id,
            else: {
              pageId: secondPage.id,
            },
          },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, firstPage.id);

      expect(result.routing.else).toMatchObject({
        logical: null,
        section: null,
        page: expect.objectContaining({ id: secondPage.id }),
      });
    });
  });

  describe("Routing Rules", () => {
    // Passes intermittently
    it("should create a routing rule", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
                routing: { rules: [] },
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const page = questionnaire.sections[0].pages[0];

      await executeQuery(
        createRoutingRuleMutation,
        {
          input: { routingId: page.routing.id },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, page.id);
      expect(result.routing.rules[1]).toBeTruthy();
    });
    // Passes intermittently
    it("should be able to update the destination on a routing rule", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
                routing: { rules: [{}] },
              },
              {
                title: "page-2",
                parentSection: "title-2",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const rule = firstPage.routing.rules[0];
      const secondPage = questionnaire.sections[0].pages[1];

      await executeQuery(
        updateRoutingRuleMutation,
        {
          input: {
            id: rule.id,
            destination: {
              pageId: secondPage.id,
            },
          },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, firstPage.id);

      expect(result.routing.rules[0].destination).toMatchObject({
        logical: null,
        section: null,
        page: expect.objectContaining({ id: secondPage.id }),
      });
    });

    // Passes intermittently
    it("should be able to delete the last routing rule and also delete the routing", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
                routing: { rules: [{}] },
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const rule = firstPage.routing.rules[0];

      await executeQuery(
        deleteRoutingRuleMutation,
        {
          input: {
            id: rule.id,
          },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, firstPage.id);

      expect(result.routing).toBeNull();
    });
  });

  describe("expression group", () => {
    it("can update an expression groups operator", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
                routing: { rules: [{ expressionGroup: {} }] },
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const expressionGroup = firstPage.routing.rules[0].expressionGroup;

      await executeQuery(
        updateExpressionGroupMutation,
        {
          input: {
            id: expressionGroup.id,
            operator: "Or",
          },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, firstPage.id);
      expect(result.routing.rules[0].expressionGroup.operator).toEqual("Or");
    });
  });

  describe("expressions", () => {
    it("can create a expression", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
                routing: { rules: [{ expressionGroup: {} }] },
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const expressionGroup = firstPage.routing.rules[0].expressionGroup;

      await executeQuery(
        createBinaryExpressionMutation,
        {
          input: {
            expressionGroupId: expressionGroup.id,
          },
        },
        { questionnaire }
      );
      const result = await queryPage(questionnaire, firstPage.id);
      expect(result.routing.rules[0].expressionGroup.expressions).toHaveLength(
        2
      );
    });

    it("can update a expression", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: NUMBER,
                  },
                ],
                routing: {
                  rules: [{ expressionGroup: { expressions: [{}] } }],
                  else: { section: 0, page: 1 },
                },
              },
              {
                title: "page-2",
                parentSection: "title-2",
                answers: [
                  {
                    type: NUMBER,
                  },
                ],
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const expression =
        firstPage.routing.rules[0].expressionGroup.expressions[0];

      await executeQuery(
        updateBinaryExpressionMutation,
        {
          input: {
            id: expression.id,
            condition: "NotEqual",
          },
        },
        { questionnaire }
      );
      const result = await queryPage(questionnaire, firstPage.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0].condition
      ).toEqual("NotEqual");
    });

    it("can delete an expression", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: NUMBER,
                  },
                ],
                routing: {
                  rules: [{ expressionGroup: { expressions: [{}] } }],
                },
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const expression =
        firstPage.routing.rules[0].expressionGroup.expressions[0];

      await executeQuery(
        deleteBinaryExpressionMutation,
        {
          input: {
            id: expression.id,
          },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, firstPage.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0]
      ).toBeUndefined();
    });
  });

  describe("left sides", () => {
    it("should be able to update the left to a new answer", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: RADIO,
                  },
                ],
              },
              {
                title: "page-2",
                parentSection: "title-2",
                answers: [
                  {
                    type: NUMBER,
                  },
                ],
                routing: {
                  rules: [{ expressionGroup: { expressions: [{}] } }],
                },
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstAnswer = questionnaire.sections[0].pages[0].answers[0];
      const secondPage = questionnaire.sections[0].pages[1];
      const expression =
        secondPage.routing.rules[0].expressionGroup.expressions[0];

      await executeQuery(
        updateLeftSideMutation,
        {
          input: {
            expressionId: expression.id,
            answerId: firstAnswer.id,
          },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, secondPage.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0].left.id
      ).toEqual(firstAnswer.id);
    });
  });
  describe("right sides", () => {
    it("should be able to update the right to a new number value", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    type: NUMBER,
                  },
                ],
                routing: {
                  rules: [{ expressionGroup: { expressions: [{}] } }],
                },
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const expression =
        firstPage.routing.rules[0].expressionGroup.expressions[0];

      await executeQuery(
        updateRightSideMutation,
        {
          input: {
            expressionId: expression.id,
            customValue: {
              number: 5,
            },
          },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, firstPage.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0].right.number
      ).toEqual(5);
    });

    it("should be able to update the selected options array", async () => {
      let config = {
        metadata: [{}],
        sections: [
          {
            title: "title-1",
            alias: "alias-1",
            position: 0,
            pages: [
              {
                title: "page-1",
                parentSection: "title-1",
                answers: [
                  {
                    options: [{}, {}, {}],
                    type: RADIO,
                  },
                ],
                routing: {
                  rules: [{ expressionGroup: { expressions: [{}] } }],
                },
              },
            ],
          },
        ],
      };
      const questionnaire = await buildQuestionnaire(config);
      const firstPage = questionnaire.sections[0].pages[0];
      const expression =
        firstPage.routing.rules[0].expressionGroup.expressions[0];

      const options = firstPage.answers[0].options;
      await executeQuery(
        updateRightSideMutation,
        {
          input: {
            expressionId: expression.id,
            selectedOptions: [options[0].id, options[2].id],
          },
        },
        { questionnaire }
      );

      const result = await queryPage(questionnaire, firstPage.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0].right.options
      ).toMatchObject([{ id: options[0].id }, { id: options[2].id }]);
    });
  });
});
