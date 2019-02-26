const { get, isNull } = require("lodash");

const { createQuestionnaireReturningPersisted } = require("./questionnaire");
const { createMetadata, updateMetadata } = require("./metadata");
const { createSection, deleteSection } = require("./section");
const { createQuestionPage, deleteQuestionPage } = require("./page");
const { createAnswer } = require("./answer");
const {
  createOption,
  createMutuallyExclusiveOption,
  deleteOption,
} = require("./option");
const { createSectionIntroduction } = require("./sectionIntroduction");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE,
} = require("../../../constants/logicalDestinations");
const {
  createQuestionConfirmation,
  updateQuestionConfirmation,
} = require("./questionConfirmation");

const { getQuestionnaire } = require("../../../utils/datastore");
const { RADIO } = require("../../../constants/answerTypes");

const {
  createRouting,
  updateRouting,
  createRoutingRule,
  updateRoutingRule,
  createBinaryExpression,
  updateBinaryExpression,
} = require("./routing");

const convertPathToDestination = (
  { section, page, logical },
  questionnaire
) => {
  if (logical === END_OF_QUESTIONNAIRE || logical === NEXT_PAGE) {
    return { logical };
  } else if (!isNull(page) && !isNull(section)) {
    return {
      pageId: get(questionnaire, `sections[${section}].pages[${page}].id`),
    };
  } else if (!isNull(section)) {
    return {
      pageId: get(questionnaire, `sections[${section}].id`),
    };
  } else {
    throw new Error("Not a valid destination in the input config");
  }
};

const buildRouting = async (questionnaire, config) => {
  const { sections } = config;
  if (!Array.isArray(sections)) {
    return;
  }
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const { pages } = sections[sectionIndex];
    if (!Array.isArray(pages)) {
      return;
    }
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      if (pages[pageIndex].routing) {
        const { routing } = pages[pageIndex];
        const questionnairePage = get(
          questionnaire,
          `sections[${sectionIndex}].pages[${pageIndex}]`
        );
        let createdRouting = await createRouting(
          questionnaire,
          questionnairePage
        );
        if (routing.else) {
          createdRouting = await updateRouting(questionnaire, {
            id: createdRouting.id,
            else: convertPathToDestination(routing.else, questionnaire),
          });
        }
        const rules = get(routing, "rules", []);
        if (!Array.isArray(rules)) {
          return;
        }
        for (let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
          let createdRule = createdRouting.rules[ruleIndex];
          const rule = rules[ruleIndex];
          if (createdRouting.rules[ruleIndex] && rule.destination) {
            createdRule = await updateRoutingRule(questionnaire, {
              id: createdRouting.rules[ruleIndex].id,
              destination: convertPathToDestination(
                rule.destination,
                questionnaire
              ),
            });
          } else if (!createdRouting.rules[ruleIndex]) {
            createdRule = await createRoutingRule(
              questionnaire,
              createdRouting
            );
            if (rule.destination) {
              createdRule = await updateRoutingRule(questionnaire, {
                id: createdRule.id,
                destination: convertPathToDestination(
                  rule.destination,
                  questionnaire
                ),
              });
            }
          }
          const {
            expressionGroup: { expressions: createdExpressions },
          } = createdRule;
          const expressions = get(rule, "expressionGroup.expressions", []);
          if (!Array.isArray(expressions)) {
            return;
          }
          for (
            let expressionIndex = 0;
            expressionIndex < expressions.length;
            expressionIndex++
          ) {
            const expression = expressions[expressionIndex];
            if (createdExpressions[expressionIndex] && expression.condition) {
              await updateBinaryExpression(questionnaire, {
                id: createdExpressions[expressionIndex].id,
                ...expression,
              });
            } else if (!createdExpressions[expressionIndex]) {
              const createdExpression = await createBinaryExpression(
                questionnaire,
                createdRule.expressionGroup
              );

              if (expression.condition) {
                await updateBinaryExpression(questionnaire, {
                  id: createdExpression.id,
                  ...expression,
                });
              }
            }
          }
        }
      }
    }
  }
};

//@todo - Split into smaller functions to avoid deeply nested chaining
const buildQuestionnaire = async questionnaireConfig => {
  const { sections, metadata, ...questionnaireProps } = questionnaireConfig;
  const questionnaire = await createQuestionnaireReturningPersisted({
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

  await buildRouting(questionnaire, questionnaireConfig);

  const getResult = await getQuestionnaire(questionnaire.id);
  return getResult;
};

module.exports = {
  buildQuestionnaire,
};
