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

const { getPageById } = require("../../../schema/resolvers/utils");

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
      sectionId: get(questionnaire, `sections[${section}].id`),
    };
  } else {
    throw new Error("Not a valid destination in the input config");
  }
};

module.exports = (ctx, config) => {
  const { questionnaire } = ctx;
  const { sections } = config;
  if (!sections) {
    return;
  }
  sections.forEach(section => {
    const { folders } = section;
    if (!folders) {
      return;
    }
    folders.forEach(folder => {
      const { pages } = folder;
      if (!pages) {
        return;
      }
      pages.forEach(async page => {
        const { id: pageId, routing } = page;
        if (!routing) {
          return;
        }
        const questionnairePage = getPageById(ctx, pageId);
        let createdRouting = await createRouting(ctx, questionnairePage);
        if (routing.else) {
          createdRouting = await updateRouting(ctx, {
            id: createdRouting.id,
            else: convertPathToDestination(routing.else, questionnaire),
          });
        }
        const rules = get(routing, "rules", []);
        if (!rules) {
          return;
        }
        rules.forEach(async (rule, ruleIndex) => {
          let createdRule = createdRouting.rules[ruleIndex];
          if (createdRouting.rules[ruleIndex] && rule.destination) {
            createdRule = await updateRoutingRule(ctx, {
              id: createdRouting.rules[ruleIndex].id,
              destination: convertPathToDestination(
                rule.destination,
                questionnaire
              ),
            });
          } else if (!createdRouting.rules[ruleIndex]) {
            createdRule = await createRoutingRule(ctx, createdRouting);
            if (rule.destination) {
              createdRule = await updateRoutingRule(ctx, {
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
                ctx,
                createdRule.expressionGroup
              );
            }

            if (expression.condition) {
              await updateBinaryExpression(ctx, {
                id: createdExpression.id,
                ...expression,
              });
            }

            if (expression.right) {
              await updateRightSide(ctx, {
                expressionId: createdExpression.id,
                ...expression.right,
              });
            }
          }
        });
      });
    });
  });
};
