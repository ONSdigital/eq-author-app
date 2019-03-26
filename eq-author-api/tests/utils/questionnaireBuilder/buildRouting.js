const { get, isNull } = require("lodash");

const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE,
} = require("../../../constants/logicalDestinations");

const {
  createRouting,
  updateRouting,
  createRoutingRule,
  updateRoutingRule,
  createBinaryExpression,
  updateBinaryExpression,
  updateRightSide,
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

module.exports = async (questionnaire, config) => {
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
            let createdExpression = createdExpressions[expressionIndex];
            if (!createdExpression) {
              createdExpression = await createBinaryExpression(
                questionnaire,
                createdRule.expressionGroup
              );
            }

            if (expression.condition) {
              await updateBinaryExpression(questionnaire, {
                id: createdExpression.id,
                ...expression,
              });
            }

            if (expression.right) {
              await updateRightSide(questionnaire, {
                expressionId: createdExpression.id,
                ...expression.right,
              });
            }
          }
        }
      }
    }
  }
};
