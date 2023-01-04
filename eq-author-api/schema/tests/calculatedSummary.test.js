const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  updateCalculatedSummaryPage,
} = require("../../tests/utils/contextBuilder/page/calculatedSummary");

const {
  queryPage,
  deletePage,
} = require("../../tests/utils/contextBuilder/page");

const { deleteAnswer } = require("../../tests/utils/contextBuilder/answer");

const uuidRejex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const { deleteSection } = require("../../tests/utils/contextBuilder/section");

const { querySection } = require("../../tests/utils/contextBuilder/section");

const { NUMBER, CURRENCY, UNIT } = require("../../constants/answerTypes");

describe("calculated Summary", () => {
  it("should create a calculated summary", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;
    const page = questionnaire.sections[0].folders[0].pages[0];
    const calculatedSummaryPage = await queryPage(ctx, page.id);

    expect(calculatedSummaryPage).toMatchObject({
      id: expect.any(String),
      title: "",
      pageType: "CalculatedSummaryPage",
    });
  });

  it("should be able to update the answers in the calculated summary", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: NUMBER,
                    },
                  ],
                },
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;

    const page = questionnaire.sections[0].folders[0].pages[0];
    const calcSum = questionnaire.sections[0].folders[0].pages[1];
    await updateCalculatedSummaryPage(ctx, {
      id: calcSum.id,
      summaryAnswers: [page.answers[0].id],
    });

    const result = await queryPage(ctx, calcSum.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      summaryAnswers: [{ id: page.answers[0].id }],
    });
  });

  it("should delete a calculated summary", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [{ pageType: "calculatedSummary" }, {}],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;

    const section = questionnaire.sections[0];
    const page = section.folders[0].pages[0];

    await deletePage(ctx, page.id);

    const result = await querySection(ctx, section.id);

    expect(result.folders[0].pages).toHaveLength(1);
  });

  it("should error if an answer is added thats is not a numeric type", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: "Radio",
                    },
                  ],
                },
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[0].pages[1];
    await expect(
      updateCalculatedSummaryPage(ctx, {
        id: calSumPage.id,
        summaryAnswers: [answersPage.answers[0].id],
      })
    ).rejects.toThrowError(
      "Radio answers are not suitable for a calculated summary page"
    );
  });

  it("should error if received answers are of inconsistent type", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: NUMBER,
                    },
                    {
                      type: CURRENCY,
                    },
                  ],
                },
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[0].pages[1];

    await expect(
      updateCalculatedSummaryPage(ctx, {
        id: calSumPage.id,
        summaryAnswers: [answersPage.answers[0].id, answersPage.answers[1].id],
      })
    ).rejects.toThrowError(
      "Answer types must be consistent on a calculated summary"
    );
  });

  it("should delete answer from list when answer deleted", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: NUMBER,
                    },
                  ],
                },
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[0].pages[1];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deleteAnswer(ctx, answersPage.answers[0].id);

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should not resolve answer on list when page deleted", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: NUMBER,
                    },
                  ],
                },
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[0].pages[1];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deletePage(ctx, answersPage.id);

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when section deleted", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: NUMBER,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          folders: [
            {
              pages: [
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[1].folders[0].pages[0];
    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deleteSection(ctx, section.id);

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should provide validation info", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: NUMBER,
                    },
                  ],
                },
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;

    const calSumPage = questionnaire.sections[0].folders[0].pages[1];
    const result = await queryPage(ctx, calSumPage.id);
    expect(result.validationErrorInfo.totalCount).toEqual(4);

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      title: "calc sum title",
      pageDescription: "calc sum page title",
      totalTitle: "Test",
    });

    const validResult = await queryPage(ctx, calSumPage.id);

    expect(validResult.validationErrorInfo.totalCount).toEqual(0);
  });

  it("should validate error if unit types are inconsistent", async () => {
    const ctx = await buildContext({
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: UNIT,
                      properties: {
                        unit: "meters",
                      },
                    },
                    {
                      type: UNIT,
                      properties: {
                        unit: "miles",
                      },
                    },
                  ],
                },
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    const { questionnaire } = ctx;
    const answers = questionnaire.sections[0].folders[0].pages[0].answers;
    const calSumPage = questionnaire.sections[0].folders[0].pages[1];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      title: "Goo",
      pageDescription: "calc sum page title",
      totalTitle: "Test",
      summaryAnswers: [answers[0].id, answers[1].id],
    });
    const validResult = await queryPage(ctx, calSumPage.id);

    expect(validResult.validationErrorInfo).toMatchObject({
      errors: [
        {
          errorCode: "ERR_CALCULATED_UNIT_INCONSISTENCY",
          field: "summaryAnswers",
          id: uuidRejex,
          type: "page",
        },
      ],
      totalCount: 1,
    });
  });

  describe("Summary answers", () => {
    it("Returns no answers if there are none", async () => {
      const ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: NUMBER,
                      },
                      {
                        type: NUMBER,
                      },
                    ],
                  },
                  {
                    pageType: "calculatedSummary",
                  },
                ],
              },
            ],
          },
        ],
      });

      const { questionnaire } = ctx;
      const calSumPage = questionnaire.sections[0].folders[0].pages[1];
      const { summaryAnswers } = await queryPage(ctx, calSumPage.id);

      expect(summaryAnswers).toHaveLength(0);
    });

    it("Returns  answers if there are some", async () => {
      const ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: NUMBER,
                      },
                      {
                        type: NUMBER,
                      },
                    ],
                  },
                  {
                    pageType: "calculatedSummary",
                  },
                ],
              },
            ],
          },
        ],
      });

      const { questionnaire } = ctx;
      const calSumPage = questionnaire.sections[0].folders[0].pages[1];
      const answers = questionnaire.sections[0].folders[0].pages[0].answers;

      await updateCalculatedSummaryPage(ctx, {
        id: calSumPage.id,
        title: "Goo",
        summaryAnswers: [answers[0].id, answers[1].id],
      });

      const { summaryAnswers } = await queryPage(ctx, calSumPage.id);

      expect(summaryAnswers).toHaveLength(2);
    });

    it("Strips out any answers that don't exist", async () => {
      const ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: NUMBER,
                      },
                      {
                        type: NUMBER,
                      },
                    ],
                  },
                  {
                    pageType: "calculatedSummary",
                  },
                ],
              },
            ],
          },
        ],
      });

      const { questionnaire } = ctx;
      const calSumPage = questionnaire.sections[0].folders[0].pages[1];
      const answers = questionnaire.sections[0].folders[0].pages[0].answers;

      await updateCalculatedSummaryPage(ctx, {
        id: calSumPage.id,
        title: "Goo",
        summaryAnswers: [answers[0].id, answers[1].id],
      });

      calSumPage.summaryAnswers.push("5ba9c62e-d726-468b-bc52-53beeb97876a");

      expect(calSumPage.summaryAnswers).toHaveLength(3);

      const { summaryAnswers } = await queryPage(ctx, calSumPage.id);

      expect(summaryAnswers).toHaveLength(2);
    });
  });

  describe("comments", () => {
    it("should retrieve comments from context", async () => {
      const ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    pageType: "calculatedSummary",
                  },
                ],
              },
            ],
          },
        ],
      });

      const calculatedSummaryPage =
        ctx.questionnaire.sections[0].folders[0].pages[0];

      ctx.comments[calculatedSummaryPage.id] = [
        {
          id: "comment-1",
          commentText: "Test comment 1",
        },
        {
          id: "comment-2",
          commentText: "Test comment 2",
        },
      ];

      const updatedCalculatedSummaryPage = await updateCalculatedSummaryPage(
        ctx,
        {
          id: calculatedSummaryPage.id,
        }
      );

      expect(updatedCalculatedSummaryPage.comments).toEqual(
        expect.arrayContaining(ctx.comments[calculatedSummaryPage.id])
      );
    });
  });
});
