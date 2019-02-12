const { createQuestionnaire } = require("./questionnaire");
const { createMetadata } = require("./metadata");
const { createSection } = require("./section");
const { createQuestionPage } = require("./page");
const { createAnswer } = require("./answer");
const { createSectionIntroduction } = require("./sectionIntroduction");
const { createQuestionConfirmation } = require("./questionConfirmation");

const loadQuestionnaire = require("../../../utils/loadQuestionnaire");

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

  if (Array.isArray(sections)) {
    const createSectionArray = sections.map(section => {
      return createSection(questionnaire, {
        title: "Section title",
        questionnaireId: questionnaire.id,
        ...section,
      }).then(createdSection => {
        const promises = [];

        if (section.hasOwnProperty("introduction")) {
          promises.push(
            createSectionIntroduction(questionnaire, {
              sectionId: createdSection.id,
              ...section.introduction,
            })
          );
        }
        if (Array.isArray(section.pages)) {
          promises.push(
            section.pages.map(page => {
              return createQuestionPage(questionnaire, {
                sectionId: createdSection.id,
                ...page,
              }).then(createdPage => {
                const promises = [];
                if (page.confirmation) {
                  promises.push(
                    createQuestionConfirmation(questionnaire, {
                      pageId: createdPage.id,
                    })
                  );
                }
                if (Array.isArray(page.answers)) {
                  promises.push(
                    page.answers.map(answer => {
                      return createAnswer(questionnaire, {
                        questionPageId: createdPage.id,
                        ...answer,
                      });
                    })
                  );
                }
                return Promise.all(promises);
              });
            })
          );
          return Promise.all(promises);
        }
      });
    });
    await Promise.all(createSectionArray);
  }

  if (Array.isArray(metadata)) {
    const createMetadataArray = metadata.map(async meta => {
      return createMetadata(questionnaire, {
        questionnaireId: questionnaire.id,
        ...meta,
      });
    });

    await Promise.all(createMetadataArray);
  }

  return JSON.parse(loadQuestionnaire(questionnaire.id));
};

module.exports = {
  buildQuestionnaire,
};
