#!/usr/bin/env node
/* eslint-disable import/unambiguous */
const fs = require("fs");
const jsonPath = process.env.DATA_DIR;
const { createQuestionnaire } = require("../db/datastore");

if (!jsonPath) {
  throw new Error("Set DATA_DIR environment variable");
}

const importQuestionnaire = async (contents) => {
  return createQuestionnaire({ ...contents, id: contents.id });
};

const transformDestination = ({ section, page, ...rest }) => ({
  sectionId: section ? section.id : section,
  pageId: page ? page.id : page,
  ...rest,
});

const transformBinaryExpression = (binaryExpression) => {
  const { left, right, ...rest } = binaryExpression;
  if (left && left.__typename) {
    if (
      left.__typename === "BasicAnswer" ||
      left.__typename === "MultipleChoiceAnswer"
    ) {
      left.type = "Answer";
      left.answerId = left.id;
    }
  }

  if (right && right.__typename) {
    if (right.__typename === "CustomValue2") {
      right.type = "Custom";
      right.customValue = { number: right.number };
    }
    if (right.__typename === "SelectedOptions2") {
      right.type = "SelectedOptions";
      right.optionIds = right.options.map((o) => o.id);
    }
  }

  return {
    ...rest,
    left,
    right,
  };
};

const transformRule = (rule) => {
  rule.destination = transformDestination(rule.destination);
  rule.expressionGroup.expressions = rule.expressionGroup.expressions.map(
    transformBinaryExpression
  );
  return rule;
};

const transformRouting = (routing) => {
  if (!routing) {
    return routing;
  }
  routing.else = transformDestination(routing.else);
  routing.rules = routing.rules.map(transformRule);
  return routing;
};

const transformValidation = ({ metadata, previousAnswer, ...rest }) => ({
  previousAnswer: previousAnswer ? previousAnswer.id : previousAnswer,
  metadata: metadata ? metadata.id : metadata,
  ...rest,
});

const transformAnswer = (answer) => {
  if (answer.childAnswers) {
    answer.secondaryLabel = answer.childAnswers[1].label;
  }
  answer.validation = Object.keys(answer.validation || {}).reduce(
    (validations, key) => ({
      ...validations,
      [key]: transformValidation(answer.validation[key]),
    }),
    {}
  );
  return answer;
};

const transformPage = (page) => ({
  ...page,
  routing: transformRouting(page.routing),
  answers: page.answers.map(transformAnswer),
});

const transformSection = (section) => ({
  ...section,
  pages: section.pages.map(transformPage),
});

const loadQuestionnaireJSON = async (path) => {
  const contents = JSON.parse(fs.readFileSync(path, "utf-8"));
  contents.type = "Business";
  contents.createdBy = contents.createdBy.name || "Unknown";
  contents.version = 0;
  contents.sections = contents.sections.map(transformSection);
  await importQuestionnaire(contents);
};

fs.readdir(jsonPath, async function (err, items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i][0] !== "." && items[i] !== "QuestionnaireList.json") {
      await loadQuestionnaireJSON(`${jsonPath}/${items[i]}`);
    }
  }
});
