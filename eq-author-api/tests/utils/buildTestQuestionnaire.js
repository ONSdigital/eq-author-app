const cheerio = require("cheerio");
const { omit } = require("lodash");

const {
  getValidationEntity,
} = require("../../repositories/strategies/validationStrategy");
const { validationRuleMap } = require("../../utils/defaultAnswerValidations");

module.exports = knex => {
  const QuestionnaireRepository = require("../../repositories/QuestionnaireRepository")(
    knex
  );
  const SectionRepository = require("../../repositories/SectionRepository")(
    knex
  );
  const PageRepository = require("../../repositories/PageRepository")(knex);
  const AnswerRepository = require("../../repositories/AnswerRepository")(knex);
  const OptionRepository = require("../../repositories/OptionRepository")(knex);
  const ValidationRepository = require("../../repositories/ValidationRepository")(
    knex
  );
  const MetadataRepository = require("../../repositories/MetadataRepository")(
    knex
  );
  const RoutingRepository = require("../../repositories/RoutingRepository")(
    knex
  );
  const QuestionConfirmationRepository = require("../../repositories/QuestionConfirmationRepository")(
    knex
  );
  const Routing2Repository = require("../../repositories/Routing2Repository")(
    knex
  );
  const DestinationRepository = require("../../repositories/DestinationRepository")(
    knex
  );
  const RoutingRule2Repository = require("../../repositories/RoutingRule2Repository")(
    knex
  );
  const ExpressionGroup2Repository = require("../../repositories/ExpressionGroup2Repository")(
    knex
  );
  const BinaryExpression2Repository = require("../../repositories/BinaryExpression2Repository")(
    knex
  );
  const LeftSide2Repository = require("../../repositories/LeftSide2Repository")(
    knex
  );
  const RightSide2Repository = require("../../repositories/RightSide2Repository")(
    knex
  );
  const SelectedOptionsRepository = require("../../repositories/SelectedOptions2Repository")(
    knex
  );

  const replacePiping = (field, references) => {
    if (!field || field.indexOf("<span") === -1) {
      return field;
    }

    const $ = cheerio.load(field);

    $("span").map((i, el) => {
      const $el = $(el);
      const pipeType = $el.data("piped");
      const id = $el.data("id");

      const newId = references[pipeType][id];

      // Can't use data as it doesn't work
      // https://github.com/cheeriojs/cheerio/issues/1240
      $el.attr("data-id", newId);

      return $.html($el);
    });

    return $("body").html();
  };

  const buildValidations = async (
    validationConfigs = {},
    answer,
    references
  ) => {
    const validationEntityType = getValidationEntity(answer.type);
    const validationTypes = validationRuleMap[validationEntityType] || [];

    let validations = {};
    for (let i = 0; i < validationTypes.length; ++i) {
      const validationType = validationTypes[i];
      const existingValidation = await ValidationRepository.findByAnswerIdAndValidationType(
        answer,
        validationType
      );

      let validation = existingValidation;
      const validationConfig = validationConfigs[validationType];
      if (validationConfig) {
        const {
          enabled,
          previousAnswer,
          metadata,
          ...restOfConfig
        } = validationConfig;
        if (enabled) {
          await ValidationRepository.toggleValidationRule({
            id: validation.id,
            enabled,
          });
        }
        const update = {
          id: validation.id,
          [`${validationType}Input`]: {
            ...restOfConfig,
            previousAnswer: references.answers[(previousAnswer || {}).id],
            metadata: references.metadata[(metadata || {}).id],
          },
        };
        validation = await ValidationRepository.updateValidationRule(update);
      }

      validations[validationType] = validation;
    }

    return validations;
  };

  const createOrUpdateOption = async (
    optionConfig,
    existingOption,
    answer,
    references
  ) => {
    const { id, ...config } = optionConfig;

    const optionDetails = {
      ...config,
      answerId: answer.id,
    };

    let option;
    if (existingOption) {
      option = await OptionRepository.update({
        ...existingOption,
        ...optionDetails,
      });
    } else {
      if (optionDetails.additionalAnswer) {
        const additionalAnswer = await AnswerRepository.createAnswer({
          ...optionDetails.additionalAnswer,
        });
        await AnswerRepository.update({
          id: additionalAnswer.id,
          parentAnswerId: answer.id,
        });
        await OptionRepository.insert({
          additionalAnswerId: additionalAnswer.id,
          ...omit(optionDetails, "additionalAnswer"),
        });
      }
      option = await OptionRepository.insert(optionDetails);
    }
    if (id) {
      references.options[id] = option.id;
    }

    return option;
  };

  const buildOptions = async (optionConfigs = [], answer, references) => {
    let options = [];

    const existingOptions = await OptionRepository.findAll({
      answerId: answer.id,
      mutuallyExclusive: false,
    });

    for (let i = 0; i < optionConfigs.length; ++i) {
      const option = await createOrUpdateOption(
        optionConfigs[i],
        existingOptions[i],
        answer,
        references
      );
      options.push(option);
      references.options[optionConfigs[i].id] = option.id;
    }

    return options;
  };

  const buildAnswers = async (answerConfigs = [], page, references) => {
    let answers = [];
    for (let i = 0; i < answerConfigs.length; ++i) {
      const {
        options,
        mutuallyExclusiveOption,
        validation,
        id,
        childAnswers,
        ...answerConfig
      } = answerConfigs[i];

      let secondaryLabel;
      if (childAnswers) {
        secondaryLabel = childAnswers[1].label;
      }

      let answer = await AnswerRepository.createAnswer({
        type: "TextField",
        ...answerConfig,
        secondaryLabel,
        questionPageId: page.id,
      });

      if (answerConfig.isDeleted) {
        answer = await AnswerRepository.remove(answer.id);
      }

      if (id) {
        references.answers[id] = answer.id;
      }

      answer.options = await buildOptions(options, answer, references);
      if (mutuallyExclusiveOption) {
        answer.mutuallyExclusiveOption = await createOrUpdateOption(
          { ...mutuallyExclusiveOption, mutuallyExclusive: true },
          null,
          answer,
          references
        );
      }

      answer.validation = await buildValidations(
        validation,
        answer,
        references
      );

      answers.push(answer);
    }

    return answers;
  };

  const buildSelectedOptions = (
    selectedOptionsConfig = [],
    right,
    references
  ) => {
    const selectedOptionsInsert = selectedOptionsConfig.map(optionConfigId =>
      SelectedOptionsRepository.insert({
        optionId: references.options[optionConfigId],
        sideId: right.id,
      })
    );
    return Promise.all(selectedOptionsInsert);
  };

  const buildExpression2 = async (
    expressionConfig,
    expressionGroup,
    references
  ) => {
    const expression = await BinaryExpression2Repository.insert({
      groupId: expressionGroup.id,
      condition: expressionConfig.condition,
    });

    if (expressionConfig.left) {
      expression.left = await LeftSide2Repository.insert({
        ...expressionConfig.left,
        expressionId: expression.id,
        answerId: references.answers[expressionConfig.left.answerId],
      });
    }

    if (expressionConfig.right && expressionConfig.right.type) {
      expression.right = await RightSide2Repository.insert({
        expressionId: expression.id,
        type: expressionConfig.right.type,
      });

      if (expressionConfig.right.type === "SelectedOptions") {
        expression.right.selectedOptions = await buildSelectedOptions(
          expressionConfig.right.selectedOptions,
          expression.right,
          references
        );
      }
    }
    return expression;
  };

  const buildExpressionGroup2 = async ({ expressions }, rule, references) => {
    const group = await ExpressionGroup2Repository.insert({ ruleId: rule.id });
    if (expressions) {
      const exp = [];
      for (let i = 0; i < expressions.length; ++i) {
        const expression = await buildExpression2(
          expressions[i],
          group,
          references
        );
        exp.push(expression);
      }
      group.expressions = exp;
    }
    return group;
  };

  const buildRule2 = async (ruleConfig, routing, references) => {
    const destination = await DestinationRepository.insert();
    const rule = await RoutingRule2Repository.insert({
      routingId: routing.id,
      destinationId: destination.id,
    });

    if (ruleConfig.expressionGroup) {
      rule.expressionGroup = await buildExpressionGroup2(
        ruleConfig.expressionGroup,
        rule,
        references
      );
    }

    return rule;
  };

  const buildRouting2 = async ({ rules = [] }, page, references) => {
    const destination = await DestinationRepository.insert();
    const routing = await Routing2Repository.insert({
      pageId: page.id,
      destinationId: destination.id,
    });

    routing.rules = [];
    for (let i = 0; i < rules.length; ++i) {
      const rule = await buildRule2(rules[i], routing, references);
      routing.rules.push(rule);
    }

    return routing;
  };

  const buildQuestionConfirmation = async (confirmationConfig, page) => {
    const confirmation = await QuestionConfirmationRepository.create({
      pageId: page.id,
    });
    const update = {
      id: confirmation.id,
      ...confirmationConfig,
    };
    return QuestionConfirmationRepository.update(update);
  };

  const buildPages = async (pageConfigs, section, references) => {
    let pages = [];
    for (let i = 0; i < pageConfigs.length; ++i) {
      const { answers, id, confirmation, routing, ...pageConfig } = pageConfigs[
        i
      ];
      let page = await PageRepository.insert({
        pageType: "QuestionPage",
        ...pageConfig,
        title: replacePiping(pageConfig.title || "Untitled Page", references),
        description: replacePiping(pageConfig.description, references),
        guidance: replacePiping(pageConfig.guidance, references),
        sectionId: section.id,
      });

      if (pageConfig.isDeleted) {
        page = await PageRepository.remove(page.id);
      }
      if (pageConfig.routingRuleSet) {
        references.pagesWithRouting.push({ page, pageConfig });
      }
      if (id) {
        references.pages[id] = page.id;
      }
      if (confirmation) {
        page.confirmation = await buildQuestionConfirmation(confirmation, page);
      }

      page.answers = await buildAnswers(answers, page, references);

      if (routing) {
        page.routing = await buildRouting2(routing, page, references);
      }

      pages.push(page);
    }

    return pages;
  };

  const buildSections = async (sectionConfigs, questionnaire, references) => {
    let sections = [];

    for (let i = 0; i < sectionConfigs.length; ++i) {
      const { pages, id, ...sectionConfig } = sectionConfigs[i];
      const section = await SectionRepository.insert({
        title: "Test section",
        ...sectionConfig,
        questionnaireId: questionnaire.id,
      });

      if (id) {
        references.sections[id] = section.id;
      }

      section.pages = await buildPages(pages, section, references);

      sections.push(section);
    }

    return sections;
  };

  const buildMetadata = async (
    metadataConfigs = [],
    questionnaire,
    references
  ) => {
    let metadatas = [];

    for (let i = 0; i < metadataConfigs.length; ++i) {
      const { id, ...metadataConfig } = metadataConfigs[i];
      let metadata = await MetadataRepository.insert({
        questionnaireId: questionnaire.id,
      });
      metadata = await MetadataRepository.update({
        ...metadataConfig,
        id: metadata.id,
      });

      if (id) {
        references.metadata[id] = metadata.id;
      }

      metadatas.push(metadata);
    }

    return metadatas;
  };

  const buildConditionValues = async (
    routingValueConfig,
    conditionId,
    references
  ) => {
    const { value, numberValue } = routingValueConfig;
    if (value) {
      const newValues = await Promise.all(
        value.map(v => {
          return RoutingRepository.toggleConditionOption({
            conditionId,
            optionId: references.options[v],
            checked: true,
          });
        })
      );
      return { value: newValues };
    }

    if (numberValue) {
      const existingValues = await RoutingRepository.findAllRoutingConditionValues(
        {
          conditionId,
        }
      );
      const existingValue = existingValues[0];
      let valueToUpdate = existingValue;
      if (!existingValue) {
        valueToUpdate = await RoutingRepository.createConditionValue({
          conditionId,
        });
      }
      const newConditionValue = await RoutingRepository.updateConditionValue({
        ...valueToUpdate,
        customNumber: numberValue,
      });

      return { numberValue: newConditionValue };
    }
  };

  const buildConditions = async (
    conditionConfigs,
    ruleId,
    pageId,
    references
  ) => {
    let conditions = [];

    for (let i = 0; i < conditionConfigs.length; ++i) {
      const { answer, routingValue, ...rest } = conditionConfigs[i];

      const condition = await RoutingRepository.createRoutingCondition({
        answerId: references.answers[answer.id],
        questionPageId: pageId,
        routingRuleId: ruleId,
        comparator: rest.comparator || "Equal",
      });

      condition.routingValue = await buildConditionValues(
        routingValue,
        condition.id,
        references
      );

      conditions.push(condition);
    }

    return conditions;
  };

  const transformDestinationConfig = (
    { logicalDestination, absoluteDestination },
    references
  ) => {
    if (logicalDestination) {
      return {
        logicalDestination: {
          destinationType: logicalDestination,
        },
      };
    }

    const { __typename, id } = absoluteDestination;

    const typenameToRef = {
      Section: "sections",
      QuestionPage: "pages",
    };

    return {
      absoluteDestination: {
        destinationType: __typename,
        destinationId: references[typenameToRef[__typename]][id],
      },
    };
  };

  const buildRules = async (ruleConfigs, ruleSetId, pageId, references) => {
    let rules = [];
    const existingRules = await RoutingRepository.findAllRoutingRules({
      routingRuleSetId: ruleSetId,
    });

    for (let i = 0; i < ruleConfigs.length; ++i) {
      const { goto, conditions } = ruleConfigs[i];
      let existingRule = existingRules[i];
      if (!existingRule) {
        existingRule = await RoutingRepository.createRoutingRule({
          routingRuleSetId: ruleSetId,
        });
      }

      const rule = await RoutingRepository.updateRoutingRule({
        id: existingRule.id,
        goto: {
          id: existingRule.routingDestinationId,
          ...transformDestinationConfig(goto, references),
        },
      });

      rule.goto = await RoutingRepository.getRoutingDestination(
        rule.routingDestinationId
      );

      const existingConditions = await RoutingRepository.findAllRoutingConditions(
        {
          routingRuleId: rule.id,
        }
      );

      await Promise.all(
        existingConditions.map(existingCondition =>
          RoutingRepository.removeRoutingCondition(existingCondition)
        )
      );

      rule.conditions = await buildConditions(
        conditions,
        rule.id,
        pageId,
        references
      );

      rules.push(rule);
    }

    return rules;
  };

  const buildRuleSet = async (ruleSetConfig, pageId, references) => {
    const ruleSet = await RoutingRepository.createRoutingRuleSet({
      questionPageId: pageId,
    });

    const { else: elseConfig, routingRules } = ruleSetConfig;

    await RoutingRepository.updateRoutingRuleSet({
      id: ruleSet.id,
      else: {
        id: ruleSet.routingDestinationId,
        ...transformDestinationConfig(elseConfig, references),
      },
    });

    ruleSet.else = await RoutingRepository.getRoutingDestination(
      ruleSet.routingDestinationId
    );

    ruleSet.rules = await buildRules(
      routingRules,
      ruleSet.id,
      pageId,
      references
    );

    return ruleSet;
  };

  const buildQuestionnaire = async questionnaireConfig => {
    const { sections, metadata, ...questionnaireProps } = questionnaireConfig;

    const questionnaire = await QuestionnaireRepository.insert({
      title: "Questionnaire",
      surveyId: "1",
      theme: "default",
      legalBasis: "Voluntary",
      navigation: false,
      createdBy: "test-suite",
      ...questionnaireProps,
    });

    const references = {
      options: {},
      answers: {},
      pages: {},
      sections: {},
      metadata: {},
      pagesWithRouting: [],
    };

    questionnaire.metadata = await buildMetadata(
      metadata,
      questionnaire,
      references
    );
    questionnaire.sections = await buildSections(
      sections,
      questionnaire,
      references
    );

    const buildRoutingActions = references.pagesWithRouting.map(
      async ({ page, pageConfig }) => {
        page.ruleSet = await buildRuleSet(
          pageConfig.routingRuleSet,
          page.id,
          references
        );
      }
    );

    await Promise.all(buildRoutingActions);

    return questionnaire;
  };

  return buildQuestionnaire;
};
