const { head } = require("lodash/fp");
const { parseInt, isNil, find, isEmpty, get, includes } = require("lodash");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE,
} = require("../../constants/logicalDestinations");
const { CURRENCY, NUMBER } = require("../../constants/answerTypes");

const updateAllRoutingConditions = (trx, where, values) =>
  trx("Routing_Conditions")
    .where(where)
    .update(values)
    .returning("*");

const updateRoutingCondition = (
  trx,
  id,
  questionPageId,
  answerId,
  comparator
) =>
  trx("Routing_Conditions")
    .where({ id })
    .update({
      questionPageId,
      answerId,
      comparator,
    })
    .returning("*")
    .then(head);

const getFirstAnswer = (trx, questionPageId) =>
  trx("Answers")
    .where({ questionPageId, isDeleted: false })
    .orderBy("id")
    .first();

const findAnswerByIdAndQuestionPageId = (trx, id, questionPageId) =>
  trx("Answers")
    .where({ isDeleted: false })
    .where({ id, questionPageId })
    .then(head);

const deleteRoutingConditionValues = (trx, where) =>
  trx("Routing_ConditionValues")
    .where(where)
    .del();

const getPageById = (trx, id) =>
  trx("PagesView")
    .where({ id })
    .first();

const getSectionById = (trx, id) =>
  trx("Sections")
    .where({ id, isDeleted: false })
    .first();

const getPageDestinations = (trx, { sectionId, order }) =>
  trx("PagesView")
    .where({ sectionId })
    .where("order", ">", order);

const getSectionDestinations = (trx, { order, questionnaireId }) =>
  trx("SectionsView")
    .select("*")
    .where({ questionnaireId })
    .where("order", ">", order);

const findRoutingRuleSet = (trx, questionPageId) =>
  trx("Routing_RuleSets")
    .where({ questionPageId, isDeleted: false })
    .first();

const getRoutingRuleSetById = (trx, routingRuleSetId) => {
  return trx("Routing_RuleSets")
    .where({ id: routingRuleSetId, isDeleted: false })
    .first();
};

const createSpecificConditionValue = async (trx, conditionId) =>
  trx("Routing_ConditionValues")
    .insert({
      conditionId,
      customNumber: null,
    })
    .returning("*")
    .then(head);

const addConditionValue = (trx, { answer, condition }) => {
  if (!isNil(answer) && includes([CURRENCY, NUMBER], answer.type)) {
    return createSpecificConditionValue(trx, condition.id);
  }
};

const insertRoutingCondition = async (trx, routingCondition, answer) => {
  return trx("Routing_Conditions")
    .insert(routingCondition)
    .returning("*")
    .then(head)
    .tap(condition => addConditionValue(trx, { answer, condition }));
};

const insertRoutingRule = (trx, routingRule) =>
  trx("Routing_Rules")
    .insert(routingRule)
    .returning("*")
    .then(head);

const insertRoutingRuleSet = async (
  trx,
  { questionPageId, routingDestinationId }
) =>
  trx("Routing_RuleSets")
    .insert({
      questionPageId: parseInt(questionPageId, 10),
      routingDestinationId: parseInt(routingDestinationId, 10),
    })

    .returning("*")
    .then(head);

const checkAnswerBelongsToPage = async (trx, answerId, questionPageId) => {
  if (isNil(answerId)) {
    return;
  }

  const answer = await findAnswerByIdAndQuestionPageId(
    trx,
    answerId,
    questionPageId
  );
  if (!answer) {
    throw new Error(
      `Answer ${answerId} does not belong to ${questionPageId}. Choose a different answer.`
    );
  }
};

const getAnswerOrFirstAnswerOnPage = (trx, answerId, questionPageId) => {
  if (!isNil(answerId)) {
    return trx("Answers")
      .select("*")
      .where({ id: answerId })
      .then(head);
  }
  return getFirstAnswer(trx, questionPageId);
};

const checkIfPageChange = async (trx, routingConditionId, newAnswerId) => {
  const routingCondition = await trx("Routing_Conditions")
    .select("*")
    .where({ id: routingConditionId })
    .then(head);

  return routingCondition.answerId !== newAnswerId;
};

const updateRoutingConditionStrategy = async (
  trx,
  { id: routingConditionId, questionPageId, answerId, comparator }
) => {
  await checkAnswerBelongsToPage(trx, answerId, questionPageId);
  const routingConditionAnswer = await getAnswerOrFirstAnswerOnPage(
    trx,
    answerId,
    questionPageId
  );

  const hasPageChanged = await checkIfPageChange(
    trx,
    routingConditionId,
    routingConditionAnswer.id
  );

  if (hasPageChanged) {
    await deleteRoutingConditionValues(trx, {
      conditionId: routingConditionId,
    });
    comparator = "Equal";
    if (
      !isNil(routingConditionAnswer) &&
      includes([CURRENCY, NUMBER], routingConditionAnswer.type)
    ) {
      await createSpecificConditionValue(trx, routingConditionId);
    }
  }

  return updateRoutingCondition(
    trx,
    routingConditionId,
    questionPageId,
    get(routingConditionAnswer, "id", null),
    comparator
  );
};

const toggleConditionOptionStrategy = async (
  trx,
  { conditionId, optionId, checked }
) => {
  const table = trx("Routing_ConditionValues");
  const where = { optionId, conditionId };
  const existing = await table.where(where);

  if (!isEmpty(existing) && checked) {
    throw new Error("A condition value already exists");
  }

  const query = checked
    ? table.insert({ conditionId, optionId })
    : table.where({ optionId }).del();

  return query.returning("*").then(head);
};

async function getAvailableRoutingDestinations(trx, pageId) {
  const page = await getPageById(trx, pageId);
  const section = await getSectionById(trx, page.sectionId);
  const questionPages = await getPageDestinations(trx, page);
  const sections = await getSectionDestinations(trx, section);

  return {
    questionPages,
    sections,
  };
}

const checkRoutingDestinations = async (
  availableRoutingDestinations,
  destination
) => {
  const { logicalDestinations } = availableRoutingDestinations;
  const { logicalDestination, absoluteDestination } = destination;

  if (!isNil(logicalDestination)) {
    if (
      !find(logicalDestinations, {
        logicalDestination: logicalDestination.destinationType,
      })
    ) {
      throw new Error(
        `Unable to route from this question ${
          logicalDestination.destinationType
        }`
      );
    }
  }

  if (!isNil(absoluteDestination)) {
    const { destinationType, destinationId } = absoluteDestination;
    const key =
      destinationType === "QuestionPage" ? "questionPages" : "sections";
    if (
      !find(availableRoutingDestinations[key], {
        id: parseInt(destinationId, 10),
      })
    ) {
      throw new Error(
        `Unable to route from this question to ${destinationType} ${destinationId}`
      );
    }
  }
};

async function createRoutingConditionStrategy(trx, routingCondition) {
  const { questionPageId, answerId } = routingCondition;

  let firstAnswerOnPage;
  if (isNil(answerId)) {
    firstAnswerOnPage = await getFirstAnswer(trx, questionPageId);
  }

  const targetAnswerId = get(firstAnswerOnPage, "id", answerId);

  let targetAnswer;
  if (!isNil(targetAnswerId)) {
    targetAnswer = await trx("Answers")
      .select()
      .where({ id: targetAnswerId })
      .first();
  } else {
    targetAnswer = null;
  }

  return insertRoutingCondition(
    trx,
    {
      ...routingCondition,
      answerId: targetAnswerId,
    },
    targetAnswer
  );
}

const getNextDestination = (trx, { questionPageId: id }) => {
  return trx("PagesView")
    .where({ id })
    .then(head)
    .then(({ sectionId, position: pagePosition }) => {
      return trx("PagesView")
        .where({ sectionId })
        .andWhere("position", ">", pagePosition)
        .then(pages => {
          if (pages.length) {
            return {
              entityType: "Page",
              result: head(pages),
            };
          }

          return trx("SectionsView")
            .where({ id: sectionId })
            .then(head)
            .then(({ questionnaireId, position: sectionPosition }) => {
              return trx("SectionsView")
                .where({ questionnaireId })
                .andWhere("position", ">", sectionPosition)
                .then(sections => {
                  if (sections.length) {
                    return {
                      entityType: "Section",
                      result: head(sections),
                    };
                  } else {
                    return {
                      result: END_OF_QUESTIONNAIRE,
                    };
                  }
                });
            });
        });
    });
};

const createRoutingDestination = (trx, { questionPageId }) => {
  return getNextDestination(trx, {
    questionPageId,
  }).then(({ result }) => {
    const destination = {};
    if (result === END_OF_QUESTIONNAIRE) {
      destination.logicalDestination = END_OF_QUESTIONNAIRE;
    } else {
      destination.logicalDestination = NEXT_PAGE;
    }
    return trx("Routing_Destinations")
      .insert(destination)
      .returning("*")
      .then(head);
  });
};

async function createRoutingRuleStrategy(
  trx,
  { routingRuleSetId, operation = "And" }
) {
  const { questionPageId } = await getRoutingRuleSetById(trx, routingRuleSetId);
  const routingDestination = await createRoutingDestination(trx, {
    questionPageId,
  });
  const routingRule = await insertRoutingRule(trx, {
    operation,
    routingRuleSetId,
    routingDestinationId: routingDestination.id,
  });

  await createRoutingConditionStrategy(trx, {
    comparator: "Equal",
    routingRuleId: routingRule.id,
    questionPageId,
  });

  return routingRule;
}

async function createRoutingRuleSetStrategy(trx, questionPageId) {
  const existingRuleSet = await findRoutingRuleSet(trx, questionPageId);
  if (!isNil(existingRuleSet)) {
    throw new Error(
      `Cannot add a second RoutingRuleSet to question ${questionPageId}. Delete the existing one first.`
    );
  }

  const routingDestination = await createRoutingDestination(trx, {
    questionPageId,
  });

  const routingRuleSetDefaults = {
    questionPageId,
    routingDestinationId: routingDestination.id,
  };

  const routingRuleSet = await insertRoutingRuleSet(
    trx,
    routingRuleSetDefaults
  );

  const routingRuleInput = {
    routingRuleSetId: routingRuleSet.id,
    questionPageId,
  };

  await createRoutingRuleStrategy(trx, routingRuleInput);
  return routingRuleSet;
}

const handlePageDeleted = (trx, pageId) =>
  updateAllRoutingConditions(
    trx,
    {
      questionPageId: parseInt(pageId, 10),
    },
    {
      questionPageId: null,
      answerId: null,
    }
  );

const handleAnswerDeleted = (trx, answerId) =>
  updateAllRoutingConditions(
    trx,
    {
      answerId: parseInt(answerId, 10),
    },
    {
      questionPageId: null,
      answerId: null,
    }
  );

const handleAnswerCreated = async (trx, answer) => {
  if (!answer.questionPageId) {
    return;
  }
  const firstAnswer = await getFirstAnswer(trx, answer.questionPageId);

  if (firstAnswer.id === answer.id) {
    const conditions = await updateAllRoutingConditions(
      trx,
      {
        questionPageId: parseInt(answer.questionPageId, 10),
      },
      {
        answerId: answer.id,
      }
    );
    return Promise.all(
      conditions.map(condition => addConditionValue(trx, { answer, condition }))
    );
  }
};

const handleOptionDeleted = (trx, optionId) =>
  deleteRoutingConditionValues(trx, {
    optionId: parseInt(optionId, 10),
  });

Object.assign(module.exports, {
  checkRoutingDestinations,
  getAvailableRoutingDestinations,
  toggleConditionOptionStrategy,
  updateRoutingConditionStrategy,
  createRoutingRuleSetStrategy,
  createRoutingRuleStrategy,
  createRoutingConditionStrategy,
  handlePageDeleted,
  handleAnswerDeleted,
  handleOptionDeleted,
  handleAnswerCreated,
});
