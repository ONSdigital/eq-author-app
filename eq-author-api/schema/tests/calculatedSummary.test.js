const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  updateCalculatedSummaryPage,
} = require("../../tests/utils/questionnaireBuilder/page/calculatedSummary");

const {
  queryPage,
  deletePage,
  movePage,
} = require("../../tests/utils/questionnaireBuilder/page");

const {
  deleteAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");

const {
  deleteSection,
  moveSection,
} = require("../../tests/utils/questionnaireBuilder/section");

const {
  querySection,
} = require("../../tests/utils/questionnaireBuilder/section");

const { NUMBER, CURRENCY } = require("../../constants/answerTypes");

describe("calculated Summary", () => {
  it("should create a calculated summary", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
        {
          pages: [
            {
              pageType: "calculatedSummary",
            },
          ],
        },
      ],
    });

    const page = questionnaire.sections[0].pages[0];

    const calculatedSummaryPage = await queryPage(questionnaire, page.id);

    expect(calculatedSummaryPage).toMatchObject({
      id: expect.any(String),
      title: "",
      pageType: "CalculatedSummaryPage",
    });
  });

  it("should be able to update the answers in the calculated summary", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });

    const page = questionnaire.sections[0].pages[1];

    await updateCalculatedSummaryPage(questionnaire, {
      id: questionnaire.sections[0].pages[1].id,
      summaryAnswers: [questionnaire.sections[0].pages[0].answers[0].id],
    });

    const result = await queryPage(questionnaire, page.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      summaryAnswers: [
        { id: questionnaire.sections[0].pages[0].answers[0].id },
      ],
    });
  });

  it("should be able to delete the answers in the calculated summary", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });

    const page = questionnaire.sections[0].pages[1];

    await updateCalculatedSummaryPage(questionnaire, {
      id: questionnaire.sections[0].pages[1].id,
      summaryAnswers: [
        questionnaire.sections[0].pages[0].answers[0].id,
        questionnaire.sections[0].pages[0].answers[1].id,
      ],
    });

    await updateCalculatedSummaryPage(questionnaire, {
      id: questionnaire.sections[0].pages[1].id,
      summaryAnswers: [questionnaire.sections[0].pages[0].answers[0].id],
    });

    const result = await queryPage(questionnaire, page.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      summaryAnswers: [
        { id: questionnaire.sections[0].pages[0].answers[0].id },
      ],
    });
  });

  it("should delete a calculated summary", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [{ pages: [{ pageType: "calculatedSummary" }] }],
    });

    const section = questionnaire.sections[0];
    const page = section.pages[0];

    await deletePage(questionnaire, page.id);

    const result = await querySection(questionnaire, section.id);

    expect(result.pages).toHaveLength(0);
  });

  it("should return a list of available summary answers when one has been selected", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[0].pages[1];
    const lastPageAnswer = questionnaire.sections[0].pages[2].answers[0].id;

    await updateCalculatedSummaryPage(questionnaire, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    const result = await queryPage(questionnaire, calSumPage.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      availableSummaryAnswers: [
        { id: answersPage.answers[1].id },
        { id: answersPage.answers[2].id },
      ],
    });

    expect(result.availableSummaryAnswers).not.toContain({
      id: lastPageAnswer,
    });
  });

  it("should return more than one type of summary answers no answers have been selected", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[0].pages[1];
    const lastPageAnswer = questionnaire.sections[0].pages[2].answers[0].id;

    const result = await queryPage(questionnaire, calSumPage.id);

    expect(result).toMatchObject({
      id: expect.any(String),
      availableSummaryAnswers: [
        { id: answersPage.answers[0].id },
        { id: answersPage.answers[1].id },
        { id: answersPage.answers[2].id },
        { id: answersPage.answers[3].id },
      ],
    });

    expect(result.availableSummaryAnswers).not.toContain({
      id: lastPageAnswer,
    });
  });

  it("should error if an answer is added thats is not a numeric type", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[0].pages[1];
    await expect(
      updateCalculatedSummaryPage(questionnaire, {
        id: calSumPage.id,
        summaryAnswers: [answersPage.answers[0].id],
      })
    ).rejects.toThrowError(
      "Radio answers are not suitable for a calculated summary page"
    );
  });

  it("should error if an answer is added that is a different type to the one that is already selected", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[0].pages[1];

    await updateCalculatedSummaryPage(questionnaire, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await expect(
      updateCalculatedSummaryPage(questionnaire, {
        id: calSumPage.id,
        summaryAnswers: [answersPage.answers[1].id],
      })
    ).rejects.toThrowError(
      "Answer types must be consistent on a calculated summary"
    );
  });

  it("should delete answer from list when answer deleted", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[0].pages[1];

    await updateCalculatedSummaryPage(questionnaire, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deleteAnswer(questionnaire, answersPage.answers[0].id);

    const result = await queryPage(questionnaire, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should not resolve answer on list when page deleted", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[0].pages[1];

    await updateCalculatedSummaryPage(questionnaire, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deletePage(questionnaire, answersPage.id);

    const result = await queryPage(questionnaire, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when section deleted", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
        {
          pages: [
            {
              pageType: "calculatedSummary",
            },
          ],
        },
      ],
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[1].pages[0];
    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(questionnaire, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await deleteSection(questionnaire, section.id);

    const result = await queryPage(questionnaire, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when page moved to after calsum page", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[0].pages[1];
    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(questionnaire, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await movePage(questionnaire, {
      id: answersPage.id,
      position: 1,
      sectionId: section.id,
    });

    const result = await queryPage(questionnaire, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when section with answer moved to after calsum page's section", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
        {
          pages: [
            {
              pageType: "calculatedSummary",
            },
          ],
        },
      ],
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[1].pages[0];
    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(questionnaire, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await moveSection(questionnaire, {
      id: section.id,
      position: 1,
      questionnaireId: questionnaire.id,
    });

    const result = await queryPage(questionnaire, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });

  it("should delete answer from list when calsum page moved to before question page", async () => {
    const questionnaire = await buildQuestionnaire({
      sections: [
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
    });
    const answersPage = questionnaire.sections[0].pages[0];
    const calSumPage = questionnaire.sections[0].pages[1];
    const section = questionnaire.sections[0];

    await updateCalculatedSummaryPage(questionnaire, {
      id: calSumPage.id,
      summaryAnswers: [answersPage.answers[0].id],
    });

    await movePage(questionnaire, {
      id: calSumPage.id,
      position: 0,
      sectionId: section.id,
    });

    const result = await queryPage(questionnaire, calSumPage.id);

    expect(result.summaryAnswers).toHaveLength(0);
  });
});
