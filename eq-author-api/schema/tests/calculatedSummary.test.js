const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  updateCalculatedSummaryPage,
} = require("../../tests/utils/contextBuilder/page/calculatedSummary");

const {
  queryPage,
  deletePage,
  movePage,
} = require("../../tests/utils/contextBuilder/page");

const { deleteAnswer } = require("../../tests/utils/contextBuilder/answer");

const uuidRejex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

const {
  deleteSection,
  moveSection,
} = require("../../tests/utils/contextBuilder/section");

const { querySection } = require("../../tests/utils/contextBuilder/section");

const { NUMBER, CURRENCY, UNIT } = require("../../constants/answerTypes");

describe("calculated Summary", () => {
  let ctx, questionnaire;

  it("should create a calculated summary", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;
    const page = questionnaire.sections[0].folders[1].pages[0];
    const calculatedSummaryPage = await queryPage(ctx, page.id);

    expect(calculatedSummaryPage).toMatchObject({
      id: expect.any(String),
      title: "",
      pageType: "CalculatedSummaryPage",
    });
  });

  it("should be able to update the answers in the calculated summary", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const page = questionnaire.sections[0].folders[1].pages[0];
    await updateCalculatedSummaryPage(ctx, {
      id: questionnaire.sections[0].folders[1].pages[0].id,
      summaryAnswers: [
        questionnaire.sections[0].folders[0].pages[0].answers[0].id,
      ],
    });

    const result = await queryPage(ctx, page.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      summaryAnswers: [
        { id: questionnaire.sections[0].folders[0].pages[0].answers[0].id },
      ],
    });
  });

  it("should be able to delete the answers in the calculated summary", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const page = questionnaire.sections[0].folders[1].pages[0];
    await updateCalculatedSummaryPage(ctx, {
      id: questionnaire.sections[0].folders[1].pages[0].id,
      summaryAnswers: [
        questionnaire.sections[0].folders[0].pages[0].answers[0].id,
        questionnaire.sections[0].folders[0].pages[0].answers[1].id,
      ],
    });

    await updateCalculatedSummaryPage(ctx, {
      id: questionnaire.sections[0].folders[1].pages[0].id,
      summaryAnswers: [
        questionnaire.sections[0].folders[0].pages[0].answers[0].id,
      ],
    });

    const result = await queryPage(ctx, page.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      summaryAnswers: [
        { id: questionnaire.sections[0].folders[0].pages[0].answers[0].id },
      ],
    });
  });

  it("should delete a calculated summary", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const section = questionnaire.sections[0];
    const page = section.folders[1].pages[0];

    await deletePage(ctx, page.id);

    const result = await querySection(ctx, section.id);

    expect(result.folders[0].pages).toHaveLength(1);
  });

  it("should return a full list of all available summary answers", async () => {
    ctx = await buildContext({
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
                    {
                      type: NUMBER,
                    },
                    {
                      type: CURRENCY,
                    },
                    {
                      type: UNIT,
                    },
                  ],
                },
                {
                  pageType: "calculatedSummary",
                },
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
      ],
    });
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    const result = await queryPage(ctx, calSumPage.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      availableSummaryAnswers: [
        { id: answersPage.answers[0].id },
        { id: answersPage.answers[1].id },
        { id: answersPage.answers[2].id },
        { id: answersPage.answers[3].id },
        { id: answersPage.answers[4].id },
        { id: questionnaire.sections[0].folders[0].pages[1].answers[0].id },
      ],
    });
  });

  it("should return more than one type of summary answers no answers have been selected", async () => {
    ctx = await buildContext({
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
      ],
    });
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];

    const result = await queryPage(ctx, calSumPage.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      availableSummaryAnswers: [
        { id: answersPage.answers[0].id },
        { id: answersPage.answers[1].id },
        { id: answersPage.answers[2].id },
        { id: answersPage.answers[3].id },
        { id: questionnaire.sections[0].folders[0].pages[1].answers[0].id },
      ],
    });
  });

  it("should error if an answer is added thats is not a numeric type", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];
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
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];

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
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deleteAnswer(ctx, answersPage.answers[0].id);

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should not resolve answer on list when page deleted", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deletePage(ctx, answersPage.id);

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when section deleted", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[1].folders[1].pages[0];

    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deleteSection(ctx, section.id);

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when page moved to after calsum page", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];
    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await movePage(ctx, {
      id: answersPage.id,
      position: 1,
      sectionId: section.id,
    });

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when section with answer moved to after calsum page's section", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[1].folders[1].pages[0];
    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await moveSection(ctx, {
      id: section.id,
      position: 1,
      questionnaireId: questionnaire.id,
    });

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when calsum page moved to before question page", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const answersPage = questionnaire.sections[0].folders[0].pages[0];
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];
    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await movePage(ctx, {
      id: calSumPage.id,
      position: 0,
      sectionId: section.id,
    });

    const result = await queryPage(ctx, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should provide validation info", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;

    const calSumPage = questionnaire.sections[0].folders[1].pages[0];
    const result = await queryPage(ctx, calSumPage.id);
    expect(result.validationErrorInfo.totalCount).toEqual(2);

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      title: "calc sum title",
    });

    const validResult = await queryPage(ctx, calSumPage.id);

    expect(validResult.validationErrorInfo.totalCount).toEqual(0);
  });

  it("should validate error if unit types are inconsistent", async () => {
    ctx = await buildContext({
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
    questionnaire = ctx.questionnaire;
    const answers = questionnaire.sections[0].folders[0].pages[0].answers;
    const calSumPage = questionnaire.sections[0].folders[1].pages[0];

    await updateCalculatedSummaryPage(ctx, {
      id: calSumPage.id,
      title: "Goo",
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
});
