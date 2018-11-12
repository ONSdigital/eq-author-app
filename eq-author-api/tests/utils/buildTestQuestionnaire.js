const cheerio = require("cheerio");

const QuestionnaireRepository = require("../../repositories/QuestionnaireRepository");
const SectionRepository = require("../../repositories/SectionRepository");
const PageRepository = require("../../repositories/PageRepository");
const AnswerRepository = require("../../repositories/AnswerRepository");
const OptionRepository = require("../../repositories/OptionRepository");
const ValidationRepository = require("../../repositories/ValidationRepository");
const MetadataRepository = require("../../repositories/MetadataRepository");
const RoutingRepository = require("../../repositories/RoutingRepository");

const {
  getValidationEntity
} = require("../../repositories/strategies/validationStrategy");
const { validationRuleMap } = require("../../utils/defaultAnswerValidations");

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

const buildValidations = async (validationConfigs = {}, answer, references) => {
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
          enabled
        });
      }
      const update = {
        id: validation.id,
        [`${validationType}Input`]: {
          ...restOfConfig,
          previousAnswer: references.answers[(previousAnswer || {}).id],
          metadata: references.metadata[(metadata || {}).id]
        }
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
    answerId: answer.id
  };

  let option;
  if (existingOption) {
    option = await OptionRepository.update({
      ...existingOption,
      ...optionDetails
    });
  } else {
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
    mutuallyExclusive: false
  });

  for (let i = 0; i < optionConfigs.length; ++i) {
    const option = await createOrUpdateOption(
      optionConfigs[i],
      existingOptions[i],
      answer,
      references
    );
    options.push(option);
  }

  return options;
};

const buildOtherAnswer = async (
  { answer: answerConfig, option: optionConfig },
  parentAnswer
) => {
  const { answer, option } = await AnswerRepository.createOtherAnswer(
    parentAnswer
  );
  const otherAnswer = await AnswerRepository.update({
    ...answerConfig,
    id: answer.id
  });
  otherAnswer.options = [
    await OptionRepository.update({
      ...optionConfig,
      id: option.id
    })
  ];
  return otherAnswer;
};

const buildAnswers = async (answerConfigs = [], page, references) => {
  let answers = [];
  for (let i = 0; i < answerConfigs.length; ++i) {
    const {
      options,
      mutuallyExclusiveOption,
      validation,
      other,
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
      questionPageId: page.id
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

    answer.validation = await buildValidations(validation, answer, references);
    if (other) {
      answer.otherAnswer = await buildOtherAnswer(other, answer);
    }

    answers.push(answer);
  }

  return answers;
};

const buildPages = async (pageConfigs, section, references) => {
  let pages = [];
  for (let i = 0; i < pageConfigs.length; ++i) {
    const { answers, id, ...pageConfig } = pageConfigs[i];
    let page = await PageRepository.insert({
      pageType: "QuestionPage",
      ...pageConfig,
      title: replacePiping(pageConfig.title || "Untitled Page", references),
      description: replacePiping(pageConfig.description, references),
      guidance: replacePiping(pageConfig.guidance, references),
      sectionId: section.id
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

    page.answers = await buildAnswers(answers, page, references);

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
      questionnaireId: questionnaire.id
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
      questionnaireId: questionnaire.id
    });
    metadata = await MetadataRepository.update({
      ...metadataConfig,
      id: metadata.id
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
          checked: true
        });
      })
    );
    return { value: newValues };
  }

  if (numberValue) {
    const existingValues = await RoutingRepository.findAllRoutingConditionValues(
      {
        conditionId
      }
    );
    const existingValue = existingValues[0];
    let valueToUpdate = existingValue;
    if (!existingValue) {
      valueToUpdate = await RoutingRepository.createConditionValue({
        conditionId
      });
    }
    const newConditionValue = await RoutingRepository.updateConditionValue({
      ...valueToUpdate,
      customNumber: numberValue
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
      comparator: rest.comparator || "Equal"
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
        destinationType: logicalDestination
      }
    };
  }

  const { __typename, id } = absoluteDestination;

  const typenameToRef = {
    Section: "sections",
    QuestionPage: "pages"
  };

  return {
    absoluteDestination: {
      destinationType: __typename,
      destinationId: references[typenameToRef[__typename]][id]
    }
  };
};

const buildRules = async (ruleConfigs, ruleSetId, pageId, references) => {
  let rules = [];
  const existingRules = await RoutingRepository.findAllRoutingRules({
    routingRuleSetId: ruleSetId
  });

  for (let i = 0; i < ruleConfigs.length; ++i) {
    const { goto, conditions } = ruleConfigs[i];
    let existingRule = existingRules[i];
    if (!existingRule) {
      existingRule = await RoutingRepository.createRoutingRule({
        routingRuleSetId: ruleSetId
      });
    }

    const rule = await RoutingRepository.updateRoutingRule({
      id: existingRule.id,
      goto: {
        id: existingRule.routingDestinationId,
        ...transformDestinationConfig(goto, references)
      }
    });

    rule.goto = await RoutingRepository.getRoutingDestination(
      rule.routingDestinationId
    );

    const existingConditions = await RoutingRepository.findAllRoutingConditions(
      {
        routingRuleId: rule.id
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
    questionPageId: pageId
  });

  const { else: elseConfig, routingRules } = ruleSetConfig;

  await RoutingRepository.updateRoutingRuleSet({
    id: ruleSet.id,
    else: {
      id: ruleSet.routingDestinationId,
      ...transformDestinationConfig(elseConfig, references)
    }
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
    ...questionnaireProps
  });

  const references = {
    options: {},
    answers: {},
    pages: {},
    sections: {},
    metadata: {},
    pagesWithRouting: []
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

module.exports = buildQuestionnaire;
