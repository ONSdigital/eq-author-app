const { createQuestionnaire } = require("./questionnaire");
const { createMetadata } = require("./metadata");
const { createSection, deleteSection } = require("./section");
const { createQuestionPage, deleteQuestionPage } = require("./page");
const { createAnswer } = require("./answer");
const { createOption } = require("./option");
const { createSectionIntroduction } = require("./sectionIntroduction");
const { createQuestionConfirmation } = require("./questionConfirmation");

const { getQuestionnaire } = require("../../../utils/datastoreFileSystem");

//@todo - Split into smaller functions to avoid deeply nested chaining
const buildQuestionnaire = async questionnaireConfig => {
  const { sections, metadata, ...questionnaireProps } = questionnaireConfig;
  const questionnaire = await createQuestionnaire({
    title: "Questionnaire",
    surveyId: "1",
    theme: "default",
    legalBasis: "Voluntary",
    navigation: false,
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

      await deleteQuestionPage(questionnaire, createdSection.pages[0].id);

      if (section.hasOwnProperty("introduction")) {
        await createSectionIntroduction(questionnaire, {
          sectionId: createdSection.id,
          ...section.introduction,
        });
      }
      if (Array.isArray(section.pages)) {
        for (let page of section.pages) {
          const createdPage = await createQuestionPage(questionnaire, {
            title: "QuestionPage title",
            sectionId: createdSection.id,
            ...page,
          });
          if (page.confirmation) {
            await createQuestionConfirmation(questionnaire, {
              pageId: createdPage.id,
              ...page.confirmation,
            });
          }

          if (Array.isArray(page.answers)) {
            for (let answer of page.answers) {
              const createdAnswer = await createAnswer(questionnaire, {
                questionPageId: createdPage.id,
                ...answer,
              });

              if (Array.isArray(answer.options)) {
                for (let option of answer.options) {
                  await createOption(questionnaire, {
                    answerId: createdAnswer.id,
                    ...option,
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
      await createMetadata(questionnaire, {
        questionnaireId: questionnaire.id,
        ...meta,
      });
    }
  }

  return getQuestionnaire(questionnaire.id);
};

module.exports = {
  buildQuestionnaire,
};
