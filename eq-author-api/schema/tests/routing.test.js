const { buildContext } = require("../../tests/utils/contextBuilder");
const { RADIO, NUMBER } = require("../../constants/answerTypes");
const { NEXT_PAGE } = require("../../constants/logicalDestinations");

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
} = require("../../tests/utils/contextBuilder/routing");

const {
  queryPage,
  deletePage,
} = require("../../tests/utils/contextBuilder/page");

const { deleteSection } = require("../../tests/utils/contextBuilder/section");

describe("routing", () => {
  describe("A Routing", () => {
    it("should create a default routing when creating a routing", async () => {
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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].pages[0];

      await executeQuery(
        createRoutingMutation,
        {
          input: { pageId: page.id },
        },
        ctx
      );

      const result = await queryPage(ctx, page.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0].left.reason
      ).toBe("DefaultRouting");
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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
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
        ctx
      );

      const result = await queryPage(ctx, firstPage.id);

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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].pages[0];

      await executeQuery(
        createRoutingRuleMutation,
        {
          input: { routingId: page.routing.id },
        },
        ctx
      );

      const result = await queryPage(ctx, page.id);
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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
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
        ctx
      );

      const result = await queryPage(ctx, firstPage.id);

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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].pages[0];
      const rule = firstPage.routing.rules[0];

      await executeQuery(
        deleteRoutingRuleMutation,
        {
          input: {
            id: rule.id,
          },
        },
        ctx
      );

      const result = await queryPage(ctx, firstPage.id);

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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
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
        ctx
      );

      const result = await queryPage(ctx, firstPage.id);
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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].pages[0];
      const expressionGroup = firstPage.routing.rules[0].expressionGroup;

      await executeQuery(
        createBinaryExpressionMutation,
        {
          input: {
            expressionGroupId: expressionGroup.id,
          },
        },
        ctx
      );
      const result = await queryPage(ctx, firstPage.id);
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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].pages[0];
      const firstAnswer = questionnaire.sections[0].pages[0].answers[0];
      const expression =
        firstPage.routing.rules[0].expressionGroup.expressions[0];

      await executeQuery(
        updateLeftSideMutation,
        {
          input: {
            expressionId: expression.id,
            answerId: firstAnswer.id,
          },
        },
        ctx
      );

      await executeQuery(
        updateBinaryExpressionMutation,
        {
          input: {
            id: expression.id,
            condition: "NotEqual",
          },
        },
        ctx
      );
      const result = await queryPage(ctx, firstPage.id);
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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
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
        ctx
      );

      const result = await queryPage(ctx, firstPage.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0]
      ).toBeUndefined();
    });

    it("has validation errors", async () => {
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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].pages[0];
      const expressionGroup = firstPage.routing.rules[0].expressionGroup;

      await executeQuery(
        createBinaryExpressionMutation,
        {
          input: {
            expressionGroupId: expressionGroup.id,
          },
        },
        ctx
      );
      const result = await queryPage(ctx, firstPage.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0]
          .validationErrorInfo.errors
      ).toHaveLength(1);
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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
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
        ctx
      );

      const result = await queryPage(ctx, secondPage.id);
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
                  routing: {
                    rules: [{ expressionGroup: { expressions: [{}] } }],
                  },
                },
              },
            ],
          },
        ],
      };
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].pages[0];
      const firstAnswer = questionnaire.sections[0].pages[0].answers[0];
      const expression =
        firstPage.routing.rules[0].expressionGroup.expressions[0];

      await executeQuery(
        updateLeftSideMutation,
        {
          input: {
            expressionId: expression.id,
            answerId: firstAnswer.id,
          },
        },
        ctx
      );
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
        ctx
      );

      const result = await queryPage(ctx, firstPage.id);
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
              { pageType: "calculatedSummary" },
            ],
          },
        ],
      };
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstQuestionPage = questionnaire.sections[0].pages[0];
      const firstAnswer = questionnaire.sections[0].pages[0].answers[0];
      const expression =
        firstQuestionPage.routing.rules[0].expressionGroup.expressions[0];

      const options = firstQuestionPage.answers[0].options;
      await executeQuery(
        updateLeftSideMutation,
        {
          input: {
            expressionId: expression.id,
            answerId: firstAnswer.id,
          },
        },
        ctx
      );
      await executeQuery(
        updateRightSideMutation,
        {
          input: {
            expressionId: expression.id,
            selectedOptions: [options[0].id, options[2].id],
          },
        },
        ctx
      );

      const result = await queryPage(ctx, firstQuestionPage.id);
      expect(
        result.routing.rules[0].expressionGroup.expressions[0].right.options
      ).toMatchObject([{ id: options[0].id }, { id: options[2].id }]);
    });
  });

  describe("on Section Deleted", () => {
    const sections = [
      {
        id: "section1",
        pages: [
          {
            title: "page1",
            answers: [
              {
                type: RADIO,
              },
            ],
            routing: {
              rules: [
                {
                  destination: { section: 1, page: null },
                  expressionGroup: { expressions: [{}] },
                },
                {
                  destination: { section: 2, page: null },
                  expressionGroup: { expressions: [{}] },
                },
              ],
              else: { section: 3, page: null },
            },
          },
          {
            title: "page2",
            answers: [
              {
                type: RADIO,
              },
            ],
          },
        ],
      },
      {
        id: "section2",
        pages: [
          {
            title: "page2a",
            answers: [
              {
                type: RADIO,
              },
            ],
          },
        ],
      },
      {
        id: "section3",
        pages: [
          {
            title: "page3a",
            answers: [
              {
                type: RADIO,
              },
            ],
          },
        ],
      },
      {
        id: "section4",
        pages: [
          {
            title: "page4a",
            answers: [
              {
                type: RADIO,
              },
            ],
          },
        ],
      },
    ];

    it("should remove references to questionnaire if deleted section is a rule destination", async () => {
      const ctx = await buildContext({ sections });

      const { questionnaire } = ctx;
      let firstPage = questionnaire.sections[0].pages[0];
      const secondSection = questionnaire.sections[1];
      const thirdSection = questionnaire.sections[2];

      // Check both rules exist
      expect(firstPage.routing.rules[0].destination.sectionId).toEqual(
        secondSection.id
      );
      expect(firstPage.routing.rules[1].destination.sectionId).toEqual(
        thirdSection.id
      );

      await deleteSection(ctx, thirdSection.id);
      firstPage = ctx.questionnaire.sections[0].pages[0];

      expect(firstPage.routing.rules).toHaveLength(2);
      expect(firstPage.routing.rules[1].destination.sectionId).toBeNull();
      firstPage = ctx.questionnaire.sections[0].pages[0];

      await deleteSection(ctx, secondSection.id);
      expect(firstPage.routing.rules[0].destination.sectionId).toBeNull();
    });

    it("should change else destination if deleted section is the else destination", async () => {
      const ctx = await buildContext({ sections });

      const { questionnaire } = ctx;
      let firstPage = questionnaire.sections[0].pages[0];
      const fourthSection = questionnaire.sections[3];

      await deleteSection(ctx, fourthSection.id);
      firstPage = ctx.questionnaire.sections[0].pages[0];

      // Only rule to exist after deletion of third page
      expect(firstPage.routing.else.sectionId).toBeNull();
    });
  });

  describe("on Page Deleted", () => {
    const sections = [
      {
        id: "section1",
        pages: [
          {
            title: "page1",
            answers: [
              {
                type: RADIO,
              },
            ],
            routing: {
              rules: [
                {
                  destination: { section: 0, page: 1 },
                  expressionGroup: { expressions: [{}] },
                },
                {
                  destination: { section: 0, page: 2 },
                  expressionGroup: { expressions: [{}] },
                },
              ],
              else: { section: 0, page: 3 },
            },
          },
          {
            title: "page2",
            answers: [
              {
                type: RADIO,
              },
            ],
          },
          {
            title: "page3",
            answers: [
              {
                type: RADIO,
              },
            ],
          },
          {
            title: "page4",
            answers: [
              {
                type: RADIO,
              },
            ],
          },
        ],
      },
    ];

    it("should remove references to questionnaire if deleted page is a rule destination", async () => {
      const ctx = await buildContext({ sections });

      const { questionnaire } = ctx;
      let firstPage = questionnaire.sections[0].pages[0];
      const secondPage = questionnaire.sections[0].pages[1];
      const thirdPage = questionnaire.sections[0].pages[2];

      // Check both rules exist
      expect(firstPage.routing.rules[0].destination.pageId).toEqual(
        secondPage.id
      );
      expect(firstPage.routing.rules[1].destination.pageId).toEqual(
        thirdPage.id
      );

      await deletePage(ctx, thirdPage.id);
      firstPage = ctx.questionnaire.sections[0].pages[0];

      expect(firstPage.routing.rules).toHaveLength(2);
      expect(firstPage.routing.rules[1].destination.pageId).toBeNull();
      firstPage = ctx.questionnaire.sections[0].pages[0];

      await deletePage(ctx, secondPage.id);
      expect(firstPage.routing.rules[0].destination.pageId).toBeNull();
    });

    it("should change else destination if deleted page is the else destination", async () => {
      const ctx = await buildContext({ sections });

      const { questionnaire } = ctx;
      let firstPage = questionnaire.sections[0].pages[0];
      const fourthPage = questionnaire.sections[0].pages[3];

      await deletePage(ctx, fourthPage.id);
      firstPage = ctx.questionnaire.sections[0].pages[0];

      // Only rule to exist after deletion of third page
      expect(firstPage.routing.else.pageId).toBeNull();
    });
  });
});
