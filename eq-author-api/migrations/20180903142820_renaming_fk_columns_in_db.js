exports.up = function(knex) {
  let promiseArray = [];

  promiseArray.push(
    knex.schema.table("Answers", t => {
      t.renameColumn("QuestionPageId", "questionPageId");
    })
  );

  promiseArray.push(
    knex.schema.table("Options", t => {
      t.renameColumn("AnswerId", "answerId");
    })
  );

  promiseArray.push(
    knex.schema.table("Pages", t => {
      t.renameColumn("SectionId", "sectionId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_ConditionValues", t => {
      t.renameColumn("OptionId", "optionId");
      t.renameColumn("ConditionId", "conditionId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_Conditions", t => {
      t.renameColumn("RoutingRuleId", "routingRuleId");
      t.renameColumn("QuestionPageId", "questionPageId");
      t.renameColumn("AnswerId", "answerId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_Destinations", t => {
      t.renameColumn("PageId", "pageId");
      t.renameColumn("SectionId", "sectionId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_RuleSets", t => {
      t.renameColumn("QuestionPageId", "questionPageId");
      t.renameColumn("RoutingDestinationId", "routingDestinationId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_Rules", t => {
      t.renameColumn("RoutingRuleSetId", "routingRuleSetId");
      t.renameColumn("RoutingDestinationId", "routingDestinationId");
    })
  );

  promiseArray.push(
    knex.schema.table("Sections", t => {
      t.renameColumn("QuestionnaireId", "questionnaireId");
    })
  );

  promiseArray.push(
    knex.schema.table("Validation_AnswerRules", t => {
      t.renameColumn("AnswerId", "answerId");
    })
  );

  promiseArray.push(
    knex.schema.table("Metadata", t => {
      t.renameColumn("QuestionnaireId", "questionnaireId");
    })
  );

  return Promise.all(promiseArray);
};

exports.down = function(knex) {
  let promiseArray = [];

  promiseArray.push(
    knex.schema.table("Answers", t => {
      t.renameColumn("questionPageId", "QuestionPageId");
    })
  );

  promiseArray.push(
    knex.schema.table("Options", t => {
      t.renameColumn("answerId", "AnswerId");
    })
  );

  promiseArray.push(
    knex.schema.table("Pages", t => {
      t.renameColumn("sectionId", "SectionId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_ConditionValues", t => {
      t.renameColumn("optionId", "OptionId");
      t.renameColumn("conditionId", "ConditionId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_Conditions", t => {
      t.renameColumn("routingRuleId", "RoutingRuleId");
      t.renameColumn("questionPageId", "QuestionPageId");
      t.renameColumn("answerId", "AnswerId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_Destinations", t => {
      t.renameColumn("pageId", "PageId");
      t.renameColumn("sectionId", "SectionId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_RuleSets", t => {
      t.renameColumn("questionPageId", "QuestionPageId");
      t.renameColumn("routingDestinationId", "RoutingDestinationId");
    })
  );

  promiseArray.push(
    knex.schema.table("Routing_Rules", t => {
      t.renameColumn("routingRuleSetId", "RoutingRuleSetId");
      t.renameColumn("routingDestinationId", "RoutingDestinationId");
    })
  );

  promiseArray.push(
    knex.schema.table("Sections", t => {
      t.renameColumn("questionnaireId", "QuestionnaireId");
    })
  );

  promiseArray.push(
    knex.schema.table("Validation_AnswerRules", t => {
      t.renameColumn("answerId", "AnswerId");
    })
  );

  promiseArray.push(
    knex.schema.table("Metadata", t => {
      t.renameColumn("questionnaireId", "QuestionnaireId");
    })
  );
  return Promise.all(promiseArray);
};
