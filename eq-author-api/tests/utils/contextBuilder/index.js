const { SOCIAL } = require("../../../constants/questionnaireTypes");
const { RADIO } = require("../../../constants/answerTypes");

const { PUBLISHED, UNPUBLISHED } = require("../../../constants/publishStatus");
const { createUser } = require("../../../utils/datastore");
const {
  createQuestionnaire,
  publishQuestionnaire,
  reviewQuestionnaire,
} = require("./questionnaire");
const { createMetadata, updateMetadata } = require("./metadata");
const { createSection, deleteSection } = require("./section");
const { deletePage } = require("./page");
const { createQuestionPage } = require("./page/questionPage");
const { createAnswer, updateAnswer } = require("./answer");
const {
  createOption,
  createMutuallyExclusiveOption,
  deleteOption,
} = require("./option");
const { createCalculatedSummaryPage } = require("./page/calculatedSummary");
const {
  createQuestionConfirmation,
  updateQuestionConfirmation,
} = require("./questionConfirmation");
const {
  updateQuestionnaireIntroduction,
} = require("./questionnaireIntroduction");
const { createCollapsible } = require("./collapsible");

const buildRouting = require("./buildRouting");

const defaultUser = require("../mockUserPayload");

//@todo - Split into smaller functions to avoid deeply nested chaining
const buildContext = async (questionnaireConfig, userConfig = {}) => {
  const user = {
    ...defaultUser(),
    ...userConfig,
  };
  await createUser(user);

  const ctx = { questionnaire: null, user };

  if (!questionnaireConfig) {
    return ctx;
  }

  const {
    sections,
    metadata,
    introduction,
    ...questionnaireProps
  } = questionnaireConfig;

  await createQuestionnaire(ctx, {
    title: "Questionnaire",
    surveyId: "1",
    theme: "default",
    navigation: false,
    type: SOCIAL,
    ...questionnaireProps,
  });

  const { questionnaire } = ctx;

  await deleteSection(ctx, questionnaire.sections[0].id);

  if (Array.isArray(sections)) {
    for (let section of sections) {
      const createdSection = await createSection(ctx, {
        title: "Section title",
        questionnaireId: questionnaire.id,
        ...section,
      });

      await deletePage(ctx, createdSection.pages[0].id);

      if (Array.isArray(section.pages)) {
        for (let page of section.pages) {
          if (page.pageType === "calculatedSummary") {
            await createCalculatedSummaryPage(ctx, {
              sectionId: createdSection.id,
            });
          } else {
            const createdPage = await createQuestionPage(ctx, {
              title: "QuestionPage title",
              sectionId: createdSection.id,
              ...page,
            });
            if (page.confirmation) {
              const createdQuestionConfirmation = await createQuestionConfirmation(
                ctx,
                {
                  pageId: createdPage.id,
                  ...page.confirmation,
                }
              );
              if (Object.keys(page.confirmation).length > 0) {
                await updateQuestionConfirmation(ctx, {
                  ...page.confirmation,
                  id: createdQuestionConfirmation.id,
                });
              }
            }
            if (Array.isArray(page.answers)) {
              for (let answer of page.answers) {
                const createdAnswer = await createAnswer(ctx, {
                  questionPageId: createdPage.id,
                  ...answer,
                });
                if (answer.properties) {
                  await updateAnswer(ctx, {
                    id: createdAnswer.id,
                    properties: answer.properties,
                  });
                }
                if (Array.isArray(answer.options)) {
                  const count = answer.type === RADIO ? 2 : 1;
                  for (let i = 0; i < count; ++i) {
                    await deleteOption(ctx, {
                      id: createdAnswer.options[i].id,
                    });
                  }

                  for (let option of answer.options) {
                    await createOption(ctx, {
                      answerId: createdAnswer.id,
                      ...option,
                      hasAdditionalAnswer: Boolean(option.additionalAnswer),
                    });
                  }
                }

                if (answer.mutuallyExclusiveOption) {
                  await createMutuallyExclusiveOption(ctx, {
                    ...answer.mutuallyExclusiveOption,
                    answerId: createdAnswer.id,
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  if (Array.isArray(metadata)) {
    for (let meta of metadata) {
      const createdMetadata = await createMetadata(ctx, {
        questionnaireId: questionnaire.id,
      });
      if (Object.keys(meta).length > 0) {
        await updateMetadata(ctx, {
          ...meta,
          id: createdMetadata.id,
        });
      }
    }
  }

  if (introduction) {
    const { collapsibles, ...introductionProps } = introduction;
    if (Object.keys(introductionProps).length > 0) {
      await updateQuestionnaireIntroduction(ctx, {
        id: questionnaire.introduction.id,
        ...introductionProps,
      });
    }
    if (Array.isArray(collapsibles)) {
      for (let i = 0; i < collapsibles.length; ++i) {
        await createCollapsible(ctx, {
          introductionId: questionnaire.introduction.id,
          ...collapsibles[i],
        });
      }
    }
  }

  await buildRouting(ctx, questionnaireConfig);

  if (questionnaireProps.publishStatus === UNPUBLISHED) {
    return ctx;
  }
  if (questionnaireProps.publishStatus) {
    await publishQuestionnaire(
      {
        questionnaireId: questionnaire.id,
        surveyId: "123",
        variants: [{ theme: "ONS", formType: "456" }],
      },
      ctx
    );
    if (questionnaireProps.publishStatus === PUBLISHED) {
      await reviewQuestionnaire(
        {
          questionnaireId: questionnaire.id,
          reviewAction: "Approved",
        },
        ctx
      );
    }
  }

  return ctx;
};

module.exports = {
  buildContext,
};
