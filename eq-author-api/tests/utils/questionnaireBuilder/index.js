const { SOCIAL } = require("../../../constants/questionnaireTypes");
const { RADIO } = require("../../../constants/answerTypes");

const { getQuestionnaire } = require("../../../utils/datastore");

const { createQuestionnaireReturningPersisted } = require("./questionnaire");
const { createMetadata, updateMetadata } = require("./metadata");
const { createSection, deleteSection } = require("./section");
const { deletePage } = require("./page");
const { createQuestionPage } = require("./page/questionPage");
const { createAnswer } = require("./answer");
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

//@todo - Split into smaller functions to avoid deeply nested chaining
const buildQuestionnaire = async questionnaireConfig => {
  const {
    sections,
    metadata,
    introduction,
    ...questionnaireProps
  } = questionnaireConfig;
  const questionnaire = await createQuestionnaireReturningPersisted({
    title: "Questionnaire",
    surveyId: "1",
    theme: "default",
    navigation: false,
    type: SOCIAL,
    ...questionnaireProps,
  });
  await deleteSection(questionnaire, questionnaire.sections[0].id);

  if (Array.isArray(sections)) {
    for (let section of sections) {
      const createdSection = await createSection(questionnaire, {
        title: "Section title",
        questionnaireId: questionnaire.id,
        ...section,
      });

      await deletePage(questionnaire, createdSection.pages[0].id);

      if (Array.isArray(section.pages)) {
        for (let page of section.pages) {
          if (page.pageType === "calculatedSummary") {
            await createCalculatedSummaryPage(questionnaire, {
              sectionId: createdSection.id,
            });
          } else {
            const createdPage = await createQuestionPage(questionnaire, {
              title: "QuestionPage title",
              sectionId: createdSection.id,
              ...page,
            });
            if (page.confirmation) {
              const createdQuestionConfirmation = await createQuestionConfirmation(
                questionnaire,
                {
                  pageId: createdPage.id,
                  ...page.confirmation,
                }
              );
              if (Object.keys(page.confirmation).length > 0) {
                await updateQuestionConfirmation(questionnaire, {
                  ...page.confirmation,
                  id: createdQuestionConfirmation.id,
                });
              }
            }
            if (Array.isArray(page.answers)) {
              for (let answer of page.answers) {
                const createdAnswer = await createAnswer(questionnaire, {
                  questionPageId: createdPage.id,
                  ...answer,
                });

                if (Array.isArray(answer.options)) {
                  const count = answer.type === RADIO ? 2 : 1;
                  for (let i = 0; i < count; ++i) {
                    await deleteOption(questionnaire, {
                      id: createdAnswer.options[i].id,
                    });
                  }

                  for (let option of answer.options) {
                    await createOption(questionnaire, {
                      answerId: createdAnswer.id,
                      ...option,
                      hasAdditionalAnswer: Boolean(option.additionalAnswer),
                    });
                  }
                }

                if (answer.mutuallyExclusiveOption) {
                  await createMutuallyExclusiveOption(questionnaire, {
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
      const createdMetadata = await createMetadata(questionnaire, {
        questionnaireId: questionnaire.id,
      });
      if (Object.keys(meta).length > 0) {
        await updateMetadata(questionnaire, {
          ...meta,
          id: createdMetadata.id,
        });
      }
    }
  }

  if (introduction) {
    const { collapsibles, ...introductionProps } = introduction;
    if (Object.keys(introductionProps).length > 0) {
      await updateQuestionnaireIntroduction(questionnaire, {
        id: questionnaire.introduction.id,
        ...introductionProps,
      });
    }
    if (Array.isArray(collapsibles)) {
      for (let i = 0; i < collapsibles.length; ++i) {
        await createCollapsible(questionnaire, {
          introductionId: questionnaire.introduction.id,
          ...collapsibles[i],
        });
      }
    }
  }

  await buildRouting(questionnaire, questionnaireConfig);

  const getResult = await getQuestionnaire(questionnaire.id);
  return getResult;
};

module.exports = {
  buildQuestionnaire,
};
