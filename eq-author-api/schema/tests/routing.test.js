const { buildContext } = require("../../tests/utils/contextBuilder");
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
} = require("../../tests/utils/contextBuilder/routing");

const {
  queryQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  queryPage,
  deletePage,
  movePage,
} = require("../../tests/utils/contextBuilder/page");

const {
  deleteSection,
  moveSection,
} = require("../../tests/utils/contextBuilder/section");

describe("routing", () => {
  let config;

  beforeEach(async () => {
    config = {
      metadata: [{}],
      sections: [
        {
          title: "title-1",
          alias: "alias-1",
          position: 0,
          folders: [
            {
              pages: [
                {
                  title: "page-1",
                  parentSection: "title-1",
                  answers: [
                    {
                      type: NUMBER,
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
        },
      ],
    };
  });

  describe("A Routing", () => {
    it("should create a default routing when creating a routing", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].folders[0].pages[1];

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
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
      const secondPage = questionnaire.sections[0].folders[0].pages[1];

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
    it("should create a routing rule", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].folders[0].pages[0];
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

    it("should be able to update the destination on a routing rule", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
      const rule = firstPage.routing.rules[0];
      const secondPage = questionnaire.sections[0].folders[0].pages[1];
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

    it("should be able to delete the last routing rule and also delete the routing", async () => {
      config.sections[0].folders[0].pages[0].routing = { rules: [{}] };
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
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
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: {} }],
      };

      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
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

    it("has validation errors", async () => {
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: {} }],
      };
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
      const result = await queryPage(ctx, firstPage.id);
      expect(
        result.routing.rules[0].expressionGroup.validationErrorInfo.errors
      ).toHaveLength(2);
    });

    it("does not have validation errors if there are none", async () => {
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: {} }],
      };
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
      const firstAnswer =
        questionnaire.sections[0].folders[0].pages[0].answers[0];
      const expression =
        firstPage.routing.rules[0].expressionGroup.expressions[0];

      firstPage.routing.rules[0].destination.logical = "NextPage";

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

      ctx.questionnaire.sections[0].folders[0].pages[0].routing.rules[0].expressionGroup.expressions[0].condition =
        "Equal";

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
        result.routing.rules[0].expressionGroup.validationErrorInfo.totalCount
      ).toBe(0);
    });
  });

  describe("expressions", () => {
    it("can create a expression", async () => {
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: {} }],
      };
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
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
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: { expressions: [{}] } }],
        else: { section: 0, folder: 0, page: 1 },
      };

      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
      const firstAnswer =
        questionnaire.sections[0].folders[0].pages[0].answers[0];
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
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: { expressions: [{}] } }],
      };

      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
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
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: {} }],
      };

      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
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
      config.sections[0].folders[0].pages[1].routing = {
        rules: [{ expressionGroup: { expressions: [{}] } }],
      };

      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstAnswer =
        questionnaire.sections[0].folders[0].pages[0].answers[0];
      const secondPage = questionnaire.sections[0].folders[0].pages[1];
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
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: { expressions: [{}] } }],
      };

      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstPage = questionnaire.sections[0].folders[0].pages[0];
      const firstAnswer =
        questionnaire.sections[0].folders[0].pages[0].answers[0];
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
      config.sections[0].folders[0].pages[0].routing = {
        rules: [{ expressionGroup: { expressions: [{}] } }],
      };
      config.sections[0].folders[0].pages[0].answers = [
        {
          type: RADIO,
          options: [{}, {}, {}],
        },
      ];
      config.sections[0].folders[0].pages[1] = {
        pageType: "calculatedSummary",
      };

      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const firstQuestionPage = questionnaire.sections[0].folders[0].pages[0];
      const firstAnswer =
        questionnaire.sections[0].folders[0].pages[0].answers[0];
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
        folders: [
          {
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
                      destination: { section: 1, folder: 0, page: null },
                      expressionGroup: { expressions: [{}] },
                    },
                    {
                      destination: { section: 2, folder: 0, page: null },
                      expressionGroup: { expressions: [{}] },
                    },
                  ],
                  else: { section: 3, folder: 0, page: null },
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
        ],
      },
      {
        id: "section2",
        folders: [
          {
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
        ],
      },
      {
        id: "section3",
        folders: [
          {
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
        ],
      },
      {
        id: "section4",
        folders: [
          {
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
        ],
      },
    ];

    it("should remove references to questionnaire if deleted section is a rule destination", async () => {
      const ctx = await buildContext({ sections });

      const { questionnaire } = ctx;
      let firstPage = questionnaire.sections[0].folders[0].pages[0];
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
      firstPage = ctx.questionnaire.sections[0].folders[0].pages[0];

      expect(firstPage.routing.rules).toHaveLength(2);
      expect(firstPage.routing.rules[1].destination.sectionId).toBeNull();
      firstPage = ctx.questionnaire.sections[0].folders[0].pages[0];

      await deleteSection(ctx, secondSection.id);
      expect(firstPage.routing.rules[0].destination.sectionId).toBeNull();
    });

    it("should change else destination if deleted section is the else destination", async () => {
      const ctx = await buildContext({ sections });

      const { questionnaire } = ctx;
      let firstPage = questionnaire.sections[0].folders[0].pages[0];
      const fourthSection = questionnaire.sections[3];

      await deleteSection(ctx, fourthSection.id);
      firstPage = ctx.questionnaire.sections[0].folders[0].pages[0];

      expect(firstPage.routing.else.sectionId).toBeNull();
    });
  });

  describe("on Page Deleted", () => {
    const sections = [
      {
        id: "section1",
        folders: [
          {
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
                      destination: { section: 0, folder: 0, page: 1 },
                      expressionGroup: { expressions: [{}] },
                    },
                    {
                      destination: { section: 0, folder: 0, page: 2 },
                      expressionGroup: { expressions: [{}] },
                    },
                  ],
                  else: { section: 0, folder: 0, page: 3 },
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
        ],
      },
    ];

    it("should remove references to questionnaire if deleted page is a rule destination", async () => {
      const ctx = await buildContext({ sections });

      const { questionnaire } = ctx;
      let firstPage = questionnaire.sections[0].folders[0].pages[0];
      const secondPage = questionnaire.sections[0].folders[0].pages[1];
      const thirdPage = questionnaire.sections[0].folders[0].pages[2];
      // Check both rules exist
      expect(firstPage.routing.rules[0].destination.pageId).toEqual(
        secondPage.id
      );
      expect(firstPage.routing.rules[1].destination.pageId).toEqual(
        thirdPage.id
      );

      await deletePage(ctx, thirdPage.id);
      firstPage = ctx.questionnaire.sections[0].folders[0].pages[0];

      expect(firstPage.routing.rules).toHaveLength(2);
      expect(firstPage.routing.rules[1].destination.pageId).toBeNull();
      firstPage = ctx.questionnaire.sections[0].folders[0].pages[0];

      await deletePage(ctx, secondPage.id);
      expect(firstPage.routing.rules[0].destination.pageId).toBeNull();
    });

    it("should change else destination if deleted page is the else destination", async () => {
      const ctx = await buildContext({ sections });

      const { questionnaire } = ctx;
      let firstPage = questionnaire.sections[0].folders[0].pages[0];
      const fourthPage = questionnaire.sections[0].folders[0].pages[3];

      await deletePage(ctx, fourthPage.id);
      firstPage = ctx.questionnaire.sections[0].folders[0].pages[0];

      expect(firstPage.routing.else.pageId).toBeNull();
    });
  });

  describe("on Section deleted or moved exposing new last question with routing", () => {
    let ctx, questionnaire;
    beforeEach(async () => {
      ctx = await buildContext({
        sections: [
          {
            id: "section1",
            folders: [
              {
                pages: [
                  {
                    title: "page1",
                    answers: [
                      {
                        type: RADIO,
                      },
                    ],
                  },
                  {
                    title: "page2",
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
          },
          {
            id: "section2",
            folders: [
              {
                pages: [
                  {
                    title: "page3",
                    answers: [
                      {
                        type: RADIO,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
    });

    it("should remove routing on new last question when section deleted", async () => {
      const firstSection = questionnaire.sections[0];
      const secondSection = questionnaire.sections[1];
      const routingPage = firstSection.folders[0].pages[1];

      expect(routingPage.routing.rules).toHaveLength(1);

      await deleteSection(ctx, secondSection.id);
      expect(questionnaire.sections).toHaveLength(1);

      expect(routingPage.routing).toBeUndefined();
    });

    it("should remove routing on new last question when section moved", async () => {
      const firstSection = questionnaire.sections[0];
      const firstSectionId = firstSection.id;
      const secondSection = questionnaire.sections[1];
      const secondSectionId = secondSection.id;
      const routingPage = firstSection.folders[0].pages[1];

      expect(routingPage.routing.rules).toHaveLength(1);

      await moveSection(ctx, {
        id: firstSectionId,
        questionnaireId: questionnaire.id,
        position: 1,
      });
      const { sections } = await queryQuestionnaire(ctx);
      expect(sections.map(s => s.id)).toEqual([
        secondSectionId,
        firstSectionId,
      ]);

      expect(routingPage.routing).toBeUndefined();
    });
  });

  describe("on Page deleted or moved exposing new last question with routing", () => {
    let ctx, questionnaire;
    beforeEach(async () => {
      ctx = await buildContext({
        sections: [
          {
            id: "section1",
            folders: [
              {
                pages: [
                  {
                    title: "page1",
                    answers: [
                      {
                        type: RADIO,
                      },
                    ],
                  },
                  {
                    title: "page2",
                    answers: [
                      {
                        type: RADIO,
                      },
                    ],
                    routing: { rules: [{}] },
                  },
                  {
                    title: "page3",
                    answers: [
                      {
                        type: RADIO,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
    });

    it("should remove routing on new last question when page deleted", async () => {
      const section = questionnaire.sections[0];
      const routingPage = section.folders[0].pages[1];
      const pageToDelete = section.folders[0].pages[2];

      // Check rule exists
      expect(routingPage.routing.rules).toHaveLength(1);

      // Delete third page
      await deletePage(ctx, pageToDelete.id);
      expect(section.folders[0].pages).toHaveLength(2);

      expect(routingPage.routing).toBeUndefined();
    });

    it("should remove routing on new last question when page moved", async () => {
      const section = questionnaire.sections[0];
      const firstPageId = section.folders[0].pages[0].id;
      const routingPage = section.folders[0].pages[1];
      const routingPageId = routingPage.id;
      const pageToMoveId = section.folders[0].pages[2].id;

      expect(routingPage.routing.rules).toHaveLength(1);

      // Move third page above second
      await movePage(ctx, {
        id: pageToMoveId,
        sectionId: section.id,
        folderId: section.folders[0].id,
        position: 1,
      });

      const reorderedPageIds = section.folders[0].pages.map(({ id }) => id);
      expect(reorderedPageIds).toEqual([
        firstPageId,
        pageToMoveId,
        routingPageId,
      ]);

      expect(routingPage.routing).toBeUndefined();
    });
  });
});
